import dayjs, { Dayjs as Date } from 'dayjs';
import { Page } from 'puppeteer';

import {
  MappedInAppPurchasePricing,
  RawInAppPurchasePricing,
  MappedInAppPurchase,
} from '../../models/InAppPurchase';

import { mapInAppPurchaseData } from './helpers';

type MaybeDate = Date | null;

interface PriceDateMapping {
  date: string;
  data: RawInAppPurchasePricing[];
}

interface MappedPriceDateMapping {
  date: MaybeDate;
  data: MappedInAppPurchasePricing[];
}

// Helpers

const startingDateIdentifier = 'Starting Price';

const mapInAppPurchase = (items: PriceDateMapping[]) => {
  return items.map(item => ({
    date: item.date === startingDateIdentifier ? null : dayjs(item.date),
    data: mapInAppPurchaseData(item.data),
  }));
};

const findOccurences = (
  items: MappedPriceDateMapping[],
  searchTerm: string
) => {
  let occurences = [] as MaybeDate[];

  items.forEach(item => {
    const hasOccurrence = item.data.find(i => i.region === searchTerm);

    if (hasOccurrence) {
      occurences.push(item.date);
    }
  });

  const comparableOccurences = occurences.filter(date => date !== null);

  const hasNewerOccurence = comparableOccurences.length > 0;
  const lastOccurence = hasNewerOccurence
    ? comparableOccurences.reduce((a, b) => {
        return (a as Date).isAfter(b as Date) ? a : b;
      })
    : null;

  return {
    hasNewerOccurence,
    lastOccurence,
  };
};

const sortInAppPurchases = (pricingTable: MappedPriceDateMapping[]) => {
  const initialData = pricingTable.find(item => item.date === null)?.data;

  const mappedData = initialData?.map(item => {
    const { hasNewerOccurence, lastOccurence } = findOccurences(
      pricingTable,
      item.region
    );

    if (hasNewerOccurence) {
      const lastPricingOccurence = pricingTable.find(item =>
        item.date!.isSame(lastOccurence!)
      )?.data;

      const newItem = lastPricingOccurence?.find(
        i => i.region === item.region
      )!;
      return newItem;
    } else {
      return item;
    }
  });

  return mappedData;
};

// Handlers

const handlePriceChanges = async (page: Page, item: MappedInAppPurchase) => {
  // Find the table element
  const data = await page.evaluate(() => {
    const pricingTable = document.querySelectorAll(
      'table[ng-show="showDateSchedule && futurePriceChangeCount !== tempPageContent.pricingDisplayArray.length"]'
    )[0];

    const pricingChanges = pricingTable.querySelectorAll(
      'tbody[ng-repeat="scheduleItem in tempPageContent.pricingDisplayArrayFiltered track by $index"]'
    );

    const data = Array.from(pricingChanges).map(item => {
      // Show items
      const button = item.getElementsByClassName(
        'hasChevron'
      )[0] as HTMLElement;
      button.click();

      // Get data
      const ths = Array.from(
        item.querySelector('tr[class="noborder"]')!.children
      ) as HTMLElement[];

      const headers = ths.map((_, i) => {
        switch (i) {
          case 0: {
            return 'price';
          }
          case 1: {
            return 'regionDescriptor';
          }
          default: {
            return 'unknown';
          }
        }
      });

      const date = ths.map(th => th.innerText)[0];

      const trs = Array.from(
        item.querySelectorAll('tr[ng-repeat="territory in scheduleItem.value"]')
      );

      let data = [] as RawInAppPurchasePricing[];

      trs.forEach(tr => {
        let r = {} as RawInAppPurchasePricing;
        let tds = Array.from(tr.querySelectorAll('td')).map(td => td.innerText);

        headers.forEach((k, i) => ((r as any)[k] = tds[i]));
        data.push(r);
      });

      const result = {
        date,
        data,
      };

      return result;
    });

    return data;
  });

  const mappedInAppPurchases = mapInAppPurchase(data);
  const orderedInAppPurchases = sortInAppPurchases(
    mappedInAppPurchases
  ) as MappedInAppPurchasePricing[];

  const result = {
    name: item.name,
    id: item.id,
    data: orderedInAppPurchases,
  };

  return result;
};

export { handlePriceChanges };

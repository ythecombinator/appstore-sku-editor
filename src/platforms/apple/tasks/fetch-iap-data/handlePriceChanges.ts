import { Page } from 'puppeteer';

import {
  RawInAppPurchasePricing,
  MappedInAppPurchasePricing,
} from '../../models/InAppPurchase';
import { formatCurrency, formatPrice, formatRegion } from '../../util/string';
import dayjs, { Dayjs as Date } from 'dayjs';

interface PriceDateMapping {
  date: string;
  data: RawInAppPurchasePricing[];
}

interface MappedPriceDateMapping {
  date: Date | null;
  data: {
    region: string;
    currency: string;
    price: number;
  }[];
}

// Helpers

const mapInAppPurchasesData = (items: RawInAppPurchasePricing[]) => {
  return items.map(item => ({
    region: formatRegion(item.regionDescriptor),
    currency: formatCurrency(item.regionDescriptor),
    price: formatPrice(item.price),
  }));
};

const mapInAppPurchases = (items: PriceDateMapping[]) => {
  return items.map(item => ({
    date: item.date === 'Starting Price' ? null : dayjs(item.date),
    data: mapInAppPurchasesData(item.data),
  }));
};

const findOccurences = (
  items: MappedPriceDateMapping[],
  searchTerm: string
) => {
  let occurences = [] as (Date | null)[];

  items.forEach(item => {
    const occur = item.data.find(i => i.region === searchTerm);

    if (occur) {
      occurences.push(item.date);
    }
  });

  const comparable = occurences.filter(date => date !== null);
  const newer = comparable.length > 0;

  const last = newer
    ? comparable.reduce((a, b) => {
        return (a as Date).isAfter(b as Date) ? a : b;
      })
    : null;

  return {
    newer,
    last,
  };
};

const orderInAppPurchases = (pricingTable: MappedPriceDateMapping[]) => {
  const original = pricingTable.find(item => item.date === null)?.data;

  const mapped = original?.map(item => {
    const { newer, last } = findOccurences(pricingTable, item.region);

    if (newer) {
      const where = pricingTable.find(item => item.date!.isSame(last!))?.data;
      const newItem = where?.find(i => i.region === item.region);
      return newItem;
    } else {
      return item;
    }
  });

  return mapped;
};

// Handlers

const handlePriceChanges = async (page: Page) => {
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

  const mappedInAppPurchases = mapInAppPurchases(data);
  const orderedInAppPurchases = orderInAppPurchases(
    mappedInAppPurchases
  ) as MappedInAppPurchasePricing[];

  return orderedInAppPurchases;
};

export { handlePriceChanges };

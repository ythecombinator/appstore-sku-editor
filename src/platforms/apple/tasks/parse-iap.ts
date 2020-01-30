import { Page } from 'puppeteer';

import {
  MappedInAppPurchase,
  RawInAppPurchase,
  InAppPurchaseType,
  InAppPurchaseStatus,
} from '../models/InAppPurchase';

// Helpers

const parseInAppPurchasesTable = async (page: Page) => {
  const data = await page.evaluate(() => {
    // Headers
    const ths = Array.from(document.querySelectorAll('table th.sort-asc'));
    const headers = ths.map(th => (th as HTMLElement).innerText);

    // Rows
    const trs = Array.from(
      document.querySelectorAll(
        'table tr[ng-repeat="iap in filteredIaps track by $index"]'
      )
    );

    let results = [] as RawInAppPurchase[];

    trs.forEach(tr => {
      let r = {} as RawInAppPurchase;

      let tds = Array.from(tr.querySelectorAll('td')).map(td => {
        const children = Array.from(td.children);
        const firstElement = children[0] as HTMLAnchorElement;

        if (children.length === 2 && firstElement.tagName === 'A') {
          return {
            name: firstElement.text,
            url: firstElement.href,
          };
        } else {
          return td.innerText;
        }
      });

      headers.forEach((k, i) => {
        (r as any)[k] = tds[i];
      });

      results.push(r);
    });

    return results;
  });

  return data as RawInAppPurchase[];
};

const mapInAppPurchasesTable = (
  items: RawInAppPurchase[]
): MappedInAppPurchase[] => {
  return items.map(item => ({
    name: item['Reference Name'].name,
    id: item['Product ID'],
    type: item.Type,
    status: item.Status,
    url: item['Reference Name'].url,
  }));
};

const filterInAppPurchasesTable = (items: MappedInAppPurchase[]) => {
  return items
    .filter(item => item.type !== InAppPurchaseType.consumable)
    .filter(item => item.status !== InAppPurchaseStatus.removed);
};

// Task

const parseIAPs = async (page: Page) => {
  await page.waitForSelector('table th.sort-asc');

  const rawData = await parseInAppPurchasesTable(page);
  const mappedData = mapInAppPurchasesTable(rawData);
  const filteredData = filterInAppPurchasesTable(mappedData);

  return filteredData;
};

export { parseIAPs };

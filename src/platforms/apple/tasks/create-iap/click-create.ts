import { Page } from 'puppeteer';

const clickCreate = async (page: Page) => {
  await page.waitFor(30000);
  await page.evaluate(() => {
    const createButton = Array.from(document.querySelectorAll('button')).find(
      item => item.innerText === 'Create'
    );

    createButton?.scrollIntoView();
    createButton?.click();
  });
};

export { clickCreate };

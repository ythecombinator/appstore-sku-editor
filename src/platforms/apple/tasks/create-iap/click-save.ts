import { Page } from 'puppeteer';

const clickSave = async (page: Page) => {
  await page.waitFor(2000);
  await page.evaluate(() => {
    const saveButton = Array.from(document.querySelectorAll('button')).find(
      item => item.innerText === 'Save'
    );

    saveButton?.click();
  });

  await page.waitFor(15000);
};

export { clickSave };

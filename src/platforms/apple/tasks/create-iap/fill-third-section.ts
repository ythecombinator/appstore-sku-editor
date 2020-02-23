import { Page } from 'puppeteer';

const fillThirdSection = async (page: Page) => {
  await page.waitFor(5000);

  await page.evaluate(() => {
    // Select Subscription Group
    const premiumLabel = Array.from(document.querySelectorAll('label')).find(
      el => el.innerText === 'Premium'
    );
    const premiumContainer = premiumLabel?.parentElement;
    const premiumCheckbox = premiumContainer?.querySelector('a');
    premiumCheckbox?.click();

    // Click 'Create'
    const createButton = document.querySelector(
      'button[ng-click="onNext()"]'
    ) as HTMLElement;
    createButton?.click();
  });
};

export { fillThirdSection };

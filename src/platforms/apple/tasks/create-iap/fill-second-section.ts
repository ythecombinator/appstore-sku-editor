import { Page } from 'puppeteer';

const fillSecondSection = async (
  page: Page,
  referenceName: string,
  productId: string
) => {
  await page.waitFor(5000);

  await page.type(
    'input[ng-model="data.newSub.displayName.value"]',
    referenceName
  );

  await page.type('input[ng-model="data.newSub.productId.value"]', productId);

  const nextButton = await page.$('button[ng-click="onNext()"]');
  nextButton?.click();
};

export { fillSecondSection };

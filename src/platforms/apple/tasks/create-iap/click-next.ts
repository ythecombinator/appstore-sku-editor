import { Page } from 'puppeteer';

const clickNext = async (page: Page) => {
  await page.evaluate(() => {
    const paragraphs = Array.from(document.body.querySelectorAll('p'));
    const description = paragraphs.find(
      item =>
        item.innerText ===
        "Choose a price, and we'll automatically calculate the prices for all 155 countries or regions based on the most recent foreign exchange rates. You can edit prices for individual countries or regions in the next step."
    );
    const nextButtonContainer =
      description?.parentElement?.parentElement?.parentElement?.parentElement
        ?.parentElement;
    const nextButton = nextButtonContainer?.querySelector(
      'button[ng-click="onNext()"]'
    );

    nextButton!.id = 'usd-pricing-next-button';
  });

  await page.click('#usd-pricing-next-button');
};

export { clickNext };

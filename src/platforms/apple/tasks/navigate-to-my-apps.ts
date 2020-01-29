import { Page } from 'puppeteer';

const navigateToMyApps = async (page: Page) => {
  // Click on user profile menu
  await page.waitForSelector('.user-profile-menu-trigger');
  await page.evaluate(() => {
    const userProfileMenu = document.getElementsByClassName(
      'user-profile-menu-trigger'
    )[0] as HTMLElement;

    userProfileMenu?.click();
  });

  // Click on `Surge Gay App s.r.o.` organization
  await page.waitForSelector('li[title="Surge Gay App s.r.o."]');
  await page.evaluate(() => {
    const organization = document.querySelector<HTMLElement>(
      'li[title="Surge Gay App s.r.o."]'
    );

    organization?.click();
  });

  // Click on `My Apps`
  await page.waitFor(5000);
  await page.evaluate(() => {
    const menuItems = Array.from(
      document.getElementsByClassName('main-nav-label')
    );

    const myAppsButton = menuItems.find(
      item => (item as HTMLElement).innerText === 'My Apps'
    ) as HTMLElement;

    myAppsButton?.click();
  });
};

export { navigateToMyApps };

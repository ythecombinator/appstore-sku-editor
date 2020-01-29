import { Page } from 'puppeteer';

import { config } from '../config';
import { AppStoreConnectCredentials } from '../models/AppStoreConnectCredentials';
import { AppStoreConnectService } from '../services/AppStoreConnectService';

const { homeURL } = config.constants.appStoreConnect;

const login = async (page: Page, credentials: AppStoreConnectCredentials) => {
  const { email, password } = credentials;

  const instance = new AppStoreConnectService({});

  const authenticationCookies = await instance.login(email, password);
  const { itctx, myacinfo } = authenticationCookies;

  await page.setCookie({
    name: 'itctx',
    value: `${itctx}`,
    domain: '.apple.com',
  });

  await page.setCookie({
    name: 'myacinfo',
    value: myacinfo,
    domain: '.apple.com',
  });

  await page.goto(homeURL);
};

export { login };

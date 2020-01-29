import request from 'request-promise-native';

import { parse } from '../../../util/cookies';
import { prompt } from '../../../util/prompt';
import { config } from '../config';
import { AppStoreConnectCookies } from '../models/AppStoreConnectCookies';

const {
  appleWidgetKey,
  baseURL,
  loginURL,
  settingsURL,
} = config.constants.appStoreConnect;

const defaultOptions = {
  baseURL,
  loginURL,
  settingsURL,
  appleWidgetKey,
  concurrentRequests: 2,
};

type AppStoreConnectOptions = Partial<typeof defaultOptions>;

class AppStoreConnectService {
  options: AppStoreConnectOptions;
  _cookies: string;

  constructor(options: AppStoreConnectOptions) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
    this._cookies = (null as unknown) as string;
  }

  async login(
    username: string,
    password: string
  ): Promise<AppStoreConnectCookies> {
    return new Promise((resolve, reject) => {
      request
        .post({
          url: `${this.options.loginURL}/signin`,
          headers: {
            'Content-Type': 'application/json',
            'X-Apple-Widget-Key': this.options.appleWidgetKey,
          },
          json: {
            accountName: username,
            password: password,
            rememberMe: false,
          },
          resolveWithFullResponse: true,
        })
        .catch(result => {
          if (result.statusCode !== 409) {
            return Promise.reject(result);
          }

          const headers = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            scnt: result.response.headers['scnt'],
            'X-Apple-ID-Session-Id':
              result.response.headers['x-apple-id-session-id'],
            'X-Apple-Widget-Key': this.options.appleWidgetKey,
            'X-Requested-With': 'XMLHttpRequest',
            'X-Apple-Domain-Id': '3',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
          };

          return prompt('Enter the 2FA code: ').then(code =>
            request
              .post({
                url: `${this.options.loginURL}/verify/trusteddevice/securitycode`,
                headers,
                json: {
                  securityCode: { code },
                },
                resolveWithFullResponse: true,
              })
              .then(() =>
                request.get({
                  url: `${this.options.loginURL}/2sv/trust`,
                  headers,
                  resolveWithFullResponse: true,
                })
              )
              .catch(result => Promise.reject(result))
          );
        })
        .then(({ headers }) => {
          const cookies = headers['set-cookie'];
          if (!(cookies && cookies.length)) {
            throw new Error(AppStoreConnectError.missingCredentials);
          }
          const myAccount = /myacinfo=.+?;/.exec(cookies);
          if (myAccount == null || myAccount.length == 0) {
            throw new Error(AppStoreConnectError.missingAccountCookie);
          }

          const cookie = myAccount[0];

          this._cookies = cookie;

          return request.get({
            url: `${this.options.baseURL}/session`,
            followRedirect: false,
            headers: {
              Cookie: cookie,
            },
            resolveWithFullResponse: true,
          });
        })
        .then(({ headers }) => {
          const cookies = headers['set-cookie'];
          if (!(cookies && cookies.length)) {
            throw new Error(AppStoreConnectError.missingCookies);
          }

          const itCtx = /itctx=.+?;/.exec(cookies);

          if (itCtx == null || itCtx.length == 0) {
            throw new Error(AppStoreConnectError.missingItCtxCookie);
          }

          this._cookies = `${this._cookies} ${itCtx[0]}`;

          const parsedResult = (parse(
            this._cookies
          ) as unknown) as AppStoreConnectCookies;

          resolve(parsedResult);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

export { AppStoreConnectService };

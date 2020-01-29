import { config } from 'dotenv';

import { AppStoreConnectConfig } from '../models/AppStoreConnectConfig';

config();

const {
  APP_STORE_CONNECT_EMAIL,
  APP_STORE_CONNECT_PASSWORD,
  APP_STORE_CONNECT_APP_ID,
} = process.env;

const variables = {
  appStoreConnect: {
    credentials: {
      email: APP_STORE_CONNECT_EMAIL,
      password: APP_STORE_CONNECT_PASSWORD,
    },
    app: {
      id: APP_STORE_CONNECT_APP_ID,
    },
  } as AppStoreConnectConfig,
};

export { variables };

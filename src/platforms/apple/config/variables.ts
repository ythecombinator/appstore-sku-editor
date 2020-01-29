import { config } from 'dotenv';

config();

const { APP_STORE_CONNECT_EMAIL, APP_STORE_CONNECT_PASSWORD } = process.env;

const variables = {
  appStoreConnect: {
    email: APP_STORE_CONNECT_EMAIL,
    password: APP_STORE_CONNECT_PASSWORD,
  },
};

export { variables };

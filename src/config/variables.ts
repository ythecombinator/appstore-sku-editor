import { config } from 'dotenv';

config();

const { GOOGLE_SPREADSHEET_ID } = process.env;

export interface Config {
  googleSheets: {
    id: string;
  };
}

const variables = {
  googleSheets: {
    id: GOOGLE_SPREADSHEET_ID,
  },
} as Config;

export { variables };

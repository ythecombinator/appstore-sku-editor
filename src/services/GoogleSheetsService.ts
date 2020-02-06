import { GoogleSpreadsheet } from 'google-spreadsheet';

import { priceToString } from '../util/currency';
import { timeout } from '../util/function';

import { InAppPurchase } from '../platforms/apple/models/InAppPurchase';
import { GoogleSheetsServiceCredentials } from '../models/GoogleSheetsServiceCredentials';

const defaultHeaders = ['Region', 'Currency', 'Price'];

interface Options {
  id: string;
  credentials: GoogleSheetsServiceCredentials;
}

class GoogleSheetsService {
  private static instance: GoogleSheetsService;

  private options: Options;
  private googleSpreadsheet: any;

  static async getInstance(options: Options) {
    if (!this.instance) {
      this.instance = new GoogleSheetsService(options);
    }
    await this.instance.setup();
    return this.instance;
  }

  constructor(options: Options) {
    this.options = options;
    this.googleSpreadsheet = new GoogleSpreadsheet(options.id);
  }

  setup = async () => {
    await this.googleSpreadsheet.useServiceAccountAuth(
      this.options.credentials
    );
    await this.googleSpreadsheet.loadInfo();
  };

  // Worksheets

  createWorksheet = async (item: InAppPurchase) => {
    const worksheet = await this.googleSpreadsheet.addSheet({
      title: item.id,
      headers: defaultHeaders,
    });

    return worksheet;
  };

  deleteWorksheet = async (index: number) => {
    const sheets = await this.googleSpreadsheet.sheetsByIndex;
    const toBeDeleted = sheets[index];
    if (toBeDeleted) {
      toBeDeleted.delete();
      await this.googleSpreadsheet.loadInfo();
    }
  };

  static formatWorksheet = async (worksheet: any) => {
    await worksheet.loadCells('A1:C1');

    const regionCell = worksheet.getCell(0, 0);
    const currencyCell = worksheet.getCell(0, 1);
    const priceCell = worksheet.getCell(0, 2);

    regionCell.textFormat = { bold: true };
    currencyCell.textFormat = { bold: true };
    priceCell.textFormat = { bold: true };

    await worksheet.saveUpdatedCells();
  };

  static appendToWorksheet = async (worksheet: any, iap: InAppPurchase) => {
    for (const item of iap.data) {
      await timeout(5000);
      const { region, currency, price } = item;
      await worksheet.addRow({
        Region: region,
        Currency: currency,
        Price: priceToString(price),
      });
    }
  };
}

export { GoogleSheetsService };

import { GoogleSpreadsheet } from 'google-spreadsheet';

import { priceToString } from '../util/currency';
import { timeout } from '../util/function';
import { chunk } from '../util/array';

import {
  InAppPurchase,
  MappedInAppPurchasePricing,
} from '../platforms/apple/models/InAppPurchase';
import { GoogleSheetsServiceCredentials } from '../models/GoogleSheetsServiceCredentials';

// Types

interface Options {
  id: string;
  credentials: GoogleSheetsServiceCredentials;
}

// Constants

const defaultHeaders = ['Region', 'Currency', 'Price'];
const requiredWorksheetName = '_ignore_';
const googleApiTimeout = 100000;
// Ideally, this would be 99 (100-1), but going for half the regions (156/2) is safer
const googleApiThreshold = 78;

// Helpers

const addRow = async (worksheet: any, items: MappedInAppPurchasePricing[]) => {
  for (const item of items) {
    const { region, currency, price } = item;
    await worksheet.addRow({
      Region: region,
      Currency: currency,
      Price: priceToString(price),
    });
  }
};

// Module

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

  // Spreadsheets • Instance properties

  cleanupSpreadsheet = async () => {
    // Items
    const sheets = await this.googleSpreadsheet.sheetsById;
    const ids = Object.keys(this.googleSpreadsheet._rawSheets).map(id =>
      Number(id)
    );

    // Excluding required Worksheet
    const sheetsToBeDeleted = ids
      .map(id => sheets[id])
      .filter(item => item._rawProperties.title !== requiredWorksheetName);

    // Deleting
    for (const item of sheetsToBeDeleted) {
      await this.deleteWorksheet(item);
      await timeout(googleApiTimeout);
    }
  };

  // Worksheets • Instance properties

  createWorksheet = async (item: InAppPurchase) => {
    const worksheet = await this.googleSpreadsheet.addSheet({
      title: item.id,
      headers: defaultHeaders,
    });

    return worksheet;
  };

  deleteWorksheet = async (worksheet: any) => {
    await worksheet.delete();
    await this.googleSpreadsheet.loadInfo();
  };

  // Worksheets • Class properties

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

  static appendToWorksheet = async (worksheet: any, item: InAppPurchase) => {
    const newData = chunk(item.data, googleApiThreshold);

    for (const chunk of newData) {
      await addRow(worksheet, chunk);
      await timeout(googleApiTimeout);
    }
  };
}

export { GoogleSheetsService };

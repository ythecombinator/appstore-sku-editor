import { config } from '../../../config';
import { GoogleSheetsService } from '../../../services/GoogleSheetsService';
import { InAppPurchase } from '../models/InAppPurchase';

import credentials from '../../../../credentials.json';

const { id } = config.variables.googleSheets;

const pushToGoogleSheets = async (data: InAppPurchase[]) => {
  const googleSheetsService = await GoogleSheetsService.getInstance({
    id,
    credentials,
  });

  let index = 1;

  for (const item of data) {
    await googleSheetsService.deleteWorksheet(index);
    const newWorksheet = await googleSheetsService.createWorksheet(item);

    await GoogleSheetsService.formatWorksheet(newWorksheet);
    await GoogleSheetsService.appendToWorksheet(newWorksheet, item);

    index++;
  }
};

export { pushToGoogleSheets };

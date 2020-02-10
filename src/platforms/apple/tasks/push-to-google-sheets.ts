import { config } from '../../../config';
import { GoogleSheetsService } from '../../../services/GoogleSheetsService';
import { InAppPurchase } from '../models/InAppPurchase';

import credentials from '../../../../credentials.json';

const { id } = config.variables.googleSheets;

const pushToGoogleSheets = async (data: InAppPurchase, index: number) => {
  const googleSheetsService = await GoogleSheetsService.getInstance({
    id,
    credentials,
  });

  await googleSheetsService.deleteWorksheet(index);
  const newWorksheet = await googleSheetsService.createWorksheet(data);

  await GoogleSheetsService.formatWorksheet(newWorksheet);
  await GoogleSheetsService.appendToWorksheet(newWorksheet, data);
};

export { pushToGoogleSheets };

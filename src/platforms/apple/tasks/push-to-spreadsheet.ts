import { config } from '../../../config';
import { GoogleSheetsService } from '../../../services/GoogleSheetsService';
import { InAppPurchase } from '../models/InAppPurchase';

import credentials from '../../../../credentials.json';

const { id } = config.variables.googleSheets;

const pushToSpreadsheet = async (data: InAppPurchase) => {
  // Get service instance
  const googleSheetsService = await GoogleSheetsService.getInstance({
    id,
    credentials,
  });

  // Create new Worksheet
  const newWorksheet = await googleSheetsService.createWorksheet(data);
  await GoogleSheetsService.formatWorksheet(newWorksheet);
  await GoogleSheetsService.appendToWorksheet(newWorksheet, data);
};

export { pushToSpreadsheet };

import { config } from '../../../config';
import { GoogleSheetsService } from '../../../services/GoogleSheetsService';

import credentials from '../../../../credentials.json';

const { id } = config.variables.googleSheets;

const cleanupSpreadsheet = async () => {
  // Get service instance
  const googleSheetsService = await GoogleSheetsService.getInstance({
    id,
    credentials,
  });

  // Cleanup
  await googleSheetsService.cleanupSpreadsheet();
};

export { cleanupSpreadsheet };

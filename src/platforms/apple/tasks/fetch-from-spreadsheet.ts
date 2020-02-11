import credentials from '../../../../credentials.json';
import { config } from '../../../config';
import { GoogleSheetsService } from '../../../services/GoogleSheetsService';
import { GoogleSheetsServiceInAppPurchase } from '../../../models/GoogleSheetsServiceInAppPurchase';
import { MappedInAppPurchasePricing } from '../models/InAppPurchase';

const { id } = config.variables.googleSheets;

const mapRowToInAppPurchaseData = (
  data: GoogleSheetsServiceInAppPurchase['data']
): MappedInAppPurchasePricing[] => {
  return data.map(item => ({
    region: item[0],
    currency: item[1],
    price: Number(item[2]),
  }));
};

const fetchFromSpreadsheet = async () => {
  // Get service instance
  const googleSheetsService = await GoogleSheetsService.getInstance({
    id,
    credentials,
  });

  // Get data from Spreadsheet
  const rawData = await googleSheetsService.readSpreadsheet();
  const data = rawData.map(item => {
    return {
      id: item.id,
      data: mapRowToInAppPurchaseData(item.data),
    };
  });
  return data;
};

export { fetchFromSpreadsheet };

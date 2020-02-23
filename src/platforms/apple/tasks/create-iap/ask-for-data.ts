import { prompt } from '../../../../util/terminal';

import { GoogleSheetsInAppPurchase } from '../../models/InAppPurchase';

const askForData = async (baseInAppPurchase: GoogleSheetsInAppPurchase) => {
  // Ask for data

  const { id } = baseInAppPurchase;

  const referenceName = await prompt(
    `Enter the Reference Name for IAP created on top of ${id}: `
  );

  const productId = await prompt(
    `Enter the Product ID for IAP created on top of ${id}: `
  );

  return { referenceName, productId };
};

export { askForData };

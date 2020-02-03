import { RawInAppPurchasePricing } from '../../models/InAppPurchase';
import { formatCurrency, formatPrice, formatRegion } from '../../util/string';

const mapInAppPurchaseData = (items: RawInAppPurchasePricing[]) => {
  return items.map(item => ({
    region: formatRegion(item.regionDescriptor),
    currency: formatCurrency(item.regionDescriptor),
    price: formatPrice(item.price),
  }));
};

export { mapInAppPurchaseData };

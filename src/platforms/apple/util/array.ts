import { AppStoreConnectPricingOption } from '../models/AppStoreConnectPricingOption';
import { formatPrice } from './string';

const mapPricingOptions = (arr: AppStoreConnectPricingOption[]) => {
  return arr
    .filter(item => item.key)
    .map(item => ({
      key: item.key,
      value: formatPrice(item.value),
    }));
};

export { mapPricingOptions };

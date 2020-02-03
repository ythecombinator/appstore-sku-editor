enum InAppPurchaseType {
  autoRenewableSubscription = 'Auto-Renewable Subscription',
  consumable = 'Consumable',
}

enum InAppPurchaseStatus {
  approved = 'Approved',
  removed = 'Developer Removed from Sale',
}

interface RawInAppPurchase {
  'Reference Name': {
    name: string;
    url: string;
  };
  'Product ID': string;
  Type: InAppPurchaseType;
  Status: InAppPurchaseStatus;
}

interface MappedInAppPurchase {
  name: string;
  id: string;
  type: InAppPurchaseType;
  status: InAppPurchaseStatus;
  url: string;
}

interface RawInAppPurchasePricing {
  regionDescriptor: string;
  price: string;
  priceAfterYear1: string;
  priceAfterYear2: string;
}

interface MappedInAppPurchasePricing {
  region: string;
  currency: string;
  price: number;
}

export {
  InAppPurchaseStatus,
  InAppPurchaseType,
  RawInAppPurchase,
  MappedInAppPurchase,
  RawInAppPurchasePricing,
  MappedInAppPurchasePricing,
};

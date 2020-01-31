const parenthesesRegExp = /\(([^)]+)\)/;

const formatCurrency = (descriptor: string) =>
  parenthesesRegExp.exec(descriptor)![1];

const formatRegion = (descriptor: string) =>
  descriptor.replace(parenthesesRegExp, '');

const formatPrice = (price: string) => Number(price.replace(/\D+/g, ''));

export { formatCurrency, formatRegion, formatPrice };

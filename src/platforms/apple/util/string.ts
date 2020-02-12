const parenthesesRegExp = /\(([^)]+)\)/;
const numbersRegExp = /\D+/g;

const formatCurrency = (descriptor: string) =>
  parenthesesRegExp.exec(descriptor)![1];

const formatRegion = (descriptor: string) =>
  descriptor.replace(parenthesesRegExp, '');

const formatPrice = (price: string) => Number(price.replace(numbersRegExp, ''));

export { formatCurrency, formatRegion, formatPrice };

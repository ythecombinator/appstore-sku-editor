import currency from 'dinero.js';

const priceToString = (amount: number) => currency({ amount }).toFormat('0.00');

export { priceToString };

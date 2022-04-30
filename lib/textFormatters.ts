export const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const priceConverter = (price: number, convertTo: string): number => {
  return convertTo === 'lb' ? price / 2.2046 : convertTo === 'kg' ? price * 2.2046 : 0;
};

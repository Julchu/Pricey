export const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Prices are /lb by default; switch to kg if needed
export const priceConverter = (price: number, currentUnit: string): number => {
  // if (currentUnit === 'lb') return price * 2.2046;
  if (currentUnit === 'kg') return price / 2.2046;
  else return price;
};

import { Unit } from './firebase/interfaces';

export const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Prices are /lb by default; switch to kg if needed
export const priceConverter = (price: number, currentUnit?: Unit, toUnit?: Unit): number => {
  if (currentUnit === Unit.lb && toUnit === Unit.kg) return price / 2.2046;
  else if (currentUnit === Unit.kg && toUnit === Unit.lb) return price * 2.2046;
  else return price;
};

export const isMass = (unit?: Unit): boolean => {
  return unit === Unit.lb || unit === Unit.kg;
};

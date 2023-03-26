import { Unit } from './firebase/interfaces';

export const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const unitFormatter = (unit?: Unit): string => {
  // if (unit === Unit.squareFeet) return 'ft²';
  // else if (unit === Unit.squareMeters) return 'm²';
  return unit || '';
};

/* Prices are /lb by default; switch to kg if needed
 * @example: $X per 1 lb, $X per 0.4536 kg, $X / 0.4536 per 1 kg = $X * 2.2046 per 1 kg
 * $1 for 1 lb
 * $1 for 0.4536 kg
 * $2.2045 for 1 kg
 *
 * @example: $X per 1 kg, $X per 2.2046 lb, $X / 2.2046 per 1 lb
 * $1 for 1 kg
 * $1 for 2.2046 lb
 * $0.4536 for 1 lb
 */

export const priceConverter = (
  price: number,
  currentUnit?: Unit,
  toUnit?: { mass: Unit; liquid: Unit },
): number => {
  if (currentUnit === Unit.pound && toUnit?.mass === Unit.kilogram) return price * 2.2046;
  else if (currentUnit === Unit.kilogram && toUnit?.mass === Unit.pound) return price / 2.2046;
  else if (currentUnit === Unit.litre && toUnit?.liquid === Unit.quart) return price * 1.05669;
  else if (currentUnit === Unit.quart && toUnit?.liquid === Unit.litre) return price / 1.05669;
  else return price;
};

export const isMass = (unit?: Unit): boolean => {
  return unit === Unit.pound || unit === Unit.kilogram;
};

export const isLiquid = (unit?: Unit): boolean => {
  return unit === Unit.litre || unit === Unit.quart;
};

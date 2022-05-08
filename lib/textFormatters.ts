import { Unit } from './firebase/interfaces';

export const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const unitFormatter = (unit?: Unit): string => {
  if (unit === Unit.squareFeet) return 'ft²';
  else if (unit === Unit.squareMeters) return 'm²';
  else return unit || '';
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
  toUnit?: { mass: Unit; area: Unit },
): number => {
  if (currentUnit === Unit.lb && toUnit?.mass === Unit.kg) return price * 2.2046;
  else if (currentUnit === Unit.kg && toUnit?.mass === Unit.lb) return price / 2.2046;
  else if (currentUnit === Unit.squareFeet && toUnit?.area === Unit.squareMeters)
    return price * 10.764;
  else if (currentUnit === Unit.squareMeters && toUnit?.area === Unit.squareFeet)
    return price / 10.764;
  else return price;
};

export const isMass = (unit?: Unit): boolean => {
  return unit === Unit.lb || unit === Unit.kg;
};

export const isArea = (unit?: Unit): boolean => {
  return unit === Unit.squareFeet || unit === Unit.squareMeters;
};

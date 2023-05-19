import { Unit, UnitCategory } from './firebase/interfaces';

export const filterNullableObject = (obj: Record<string, unknown>): Record<string, unknown> => {
  return Object.entries(obj).reduce<Record<string, unknown>>((previousObject, [key, value]) => {
    if (value) previousObject[key] = value;
    return previousObject;
  }, {});
};

export const isMass = (unit: Unit): boolean => unit === Unit.kilogram || unit === Unit.pound;
export const isVolume = (unit?: Unit): boolean => unit === Unit.litre || unit === Unit.quart;

export const priceConverter = (price: number, fromUnit?: Unit, toUnits?: UnitCategory): number => {
  /* Prices are /lb by default; switch to kg if needed
   ** Example: $X per 1 lb, $X per 0.4536 kg, $X / 0.4536 per 1 kg = $X * 2.2046 per 1 kg
   *** $1 for 1 lb
   *** $1 for 0.4536 kg
   *** $2.2045 for 1 kg
   ** Example: $X per 1 kg, $X per 2.2046 lb, $X / 2.2046 per 1 lb
   *** $1 for 1 kg
   *** $1 for 2.2046 lb
   *** $0.4536 for 1 lb
   * if (beforeUnit === Unit.pound && afterUnit?.mass === Unit.kilogram) return price * 2.2046;
   * else if (beforeUnit === Unit.kilogram && afterUnit?.mass === Unit.pound) return price / 2.2046;
   * else if (beforeUnit === Unit.litre && afterUnit?.liquid === Unit.quart) return price * 1.05669;
   * else if (beforeUnit === Unit.quart && afterUnit?.liquid === Unit.litre) return price / 1.05669;
   * else return price;
   */
  if (fromUnit === Unit.pound && toUnits?.mass === Unit.kilogram) return price * 2.2046;
  else if (fromUnit === Unit.kilogram && toUnits?.mass === Unit.pound) return price / 2.2046;
  else if (fromUnit === Unit.litre && toUnits?.volume === Unit.quart) return price * 1.05669;
  else if (fromUnit === Unit.quart && toUnits?.volume === Unit.litre) return price / 1.05669;
  else if (fromUnit === Unit.tablespoon && toUnits?.volume === Unit.cup) return price * 16;
  else if (fromUnit === Unit.cup && toUnits?.volume === Unit.tablespoon) return price / 16;

  return price;
};

/* Gets current individual unit and converts to individual toUnit based on category
 * If selected unit is mass (Unit.pound) and currentUnits = { mass: Unit.kilogram, volume: Unit.litres }
 * Return opposite mass (Unit.litres)
 */
export const unitConverter = (
  fromUnit: Unit,
  toUnits: UnitCategory = { mass: Unit.kilogram, volume: Unit.litre },
): Unit => {
  if (isMass(fromUnit)) return toUnits.mass;
  else if (isVolume(fromUnit)) return toUnits.volume;
  return Unit.item;
};

// Price per measurement per unit; takes care of float by multiplying by 100 to cents
export const calcIndividualPrice = (
  price: number,
  capacity: number = 1, // default 1 for GroceryList ingredients that might not have measurements added
  quantity: number = 1,
): number => {
  return (price * 100) / (capacity > 0 ? capacity : 1) / (quantity > 0 ? quantity : 1) / 100;
};

// Total price based on price per measurement and capacity/quantity
export const calcTotalPrice = (
  price: number,
  capacity: number = 1,
  quantity: number = 1,
): number => {
  console.log('price', price);
  console.log('capacity', capacity);
  console.log('quantity:', quantity);
  return (price * 100 * capacity * quantity) / 100;
};

export const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const getPercentChange = (earlierPrice: number, laterPrice: number): number =>
  ((laterPrice - earlierPrice) / earlierPrice) * 100;

export const percentageFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const validateIsNumber = (value: number): boolean => {
  return !!value;
};
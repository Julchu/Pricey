export const readFile = (file: File): Promise<string> => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result as string), false);
    reader.readAsText(file);
  });
};

export const parseCSV = (data: string): string[] => {
  // 16 columns: PLU, CATEGORY, COMMODITY, VARIETY, SIZE, MEASUREMENTS (NA), MEASUREMENTS (GLOBAL), RESTRICTIONS/NOTES, BOTNICAL NAME, AKA, NOTES, REVISION DATE, DATE ADDED, GPC, IMAGE, IMAGE_SOURCE
  return data.split(',');
};

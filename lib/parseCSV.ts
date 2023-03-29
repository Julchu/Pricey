import { parse } from 'csv-parse';
import { Dispatch, SetStateAction } from 'react';

export const readFile = (file: File): Promise<string> => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result as string), false);
    reader.readAsText(file);
  });
};

export const parseCSV = (
  data: string,
  setFileLoading: Dispatch<SetStateAction<boolean>>,
): Promise<string[][]> => {
  return new Promise(resolve => {
    const records: string[][] = [];
    // // Initialize the parser
    const parser = parse(data, {
      delimiter: ',',
    });
    // Use the readable stream api to consume records
    parser.on('readable', function () {
      let row: string[];
      const _ = parser.read();
      while ((row = parser.read()) !== null) {
        records.push([row[0], row[1], row[2], row[3], row[14]]);
      }
    });

    parser.on('end', () => {
      setFileLoading(false);
      resolve(records);
    });

    // Catch any error
    parser.on('error', function (err) {
      console.error(err.message);
    });
  });
};

// Compares ingredients from sheets to Firestore using their unique PLU code
// export const compareIngredients = async (): Promise<void> => {
/* 16 columns:
 ** 0: "PLU"
 ** 1: "CATEGORY"
 ** 2: "COMMODITY"
 ** 3: "VARIETY"
 ** -- 4: "SIZE"
 ** -- 5: "MEASUREMENTS: NORTH AMERICA"
 ** -- 6: "MEASUREMENTS: REST OF WORLD"
 ** -- 7: "RESTRICTIONS / NOTES"
 ** -- 8: "BOTANICAL NAME"
 ** -- 9: "AKA"
 ** -- 10: "NOTES"
 ** -- 11: "REVISION DATE"
 ** -- 12: "DATE ADDED"
 ** -- 13: "GPC"
 ** 14: "IMAGE"
 ** -- 15: "IMAGE_SOURCE"
 */
// };

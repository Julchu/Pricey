import assert from 'assert';
import * as fs from 'fs';
import { parse } from 'csv-parse';

export const readFile = (file: File): Promise<string> => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result as string), false);
    reader.readAsText(file);
  });
};

export const parseCSV = (data: string): Promise<string[]> => {
  return new Promise(resolve => {
    const records: string[] = [];
    // // Initialize the parser
    const parser = parse(data, {
      delimiter: ',',
    });
    // Use the readable stream api to consume records
    parser.on('readable', function () {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });

    parser.on('end', () => {
      resolve(records);
    });

    // Catch any error
    parser.on('error', function (err) {
      console.error(err.message);
    });
  });
};

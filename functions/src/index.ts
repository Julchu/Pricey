import * as functions from 'firebase-functions';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
// http://localhost:5001/anyprojectid/us-central1/helloWorld
const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});

// fs.createReadStream
// export const parseCSV = (fileName: string): void => {
//   // csvStream.on('close', () => {
//   //   if (!hasError) fs.unlink(`${fileName}.csv`);
//   // });
// };

// parseCSV('Commodities_20230323060327');

export { helloWorld };

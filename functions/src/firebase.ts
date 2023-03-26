// eslint-disable-next-line import/named
// import admin, { firestore } from 'firebase-admin';
// import * as functions from 'firebase-functions';

// admin.initializeApp();

// const db = admin.firestore();
// const storage = admin.storage();
// db.settings({ ignoreUndefinedProperties: true });
// const logger = functions.logger;
// const config = functions.config();

// const { FieldValue, FieldPath } = firestore;

// // Listens for new messages added to /messages/:documentId/original and creates an
// // uppercase version of the message to /messages/:documentId/uppercase
// exports.makeUppercase = functions.firestore
//   .document('/messages/{documentId}')
//   .onCreate((snap, context) => {
//     // Grab the current value of what was written to Firestore.
//     const original = snap.data().original;

//     // Access the parameter `{documentId}` with `context.params`
//     functions.logger.log('Uppercasing', context.params.documentId, original);

//     const uppercase = original.toUpperCase();

//     // You must return a Promise when performing asynchronous tasks inside a Functions such as
//     // writing to Firestore.
//     // Setting an 'uppercase' field in Firestore document returns a Promise.
//     return snap.ref.set({ uppercase }, { merge: true });
//   });

// export { db, storage, logger, config, admin, functions, FieldValue, FieldPath };
export {};

const admin = require('firebase-admin');
//import * as async from 'async'

let serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

module.exports = {
  db
}
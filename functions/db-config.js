const admin = require('firebase-admin');
require('dotenv').config();
//import * as async from 'async'

serviceAccount = JSON.parse(process.env.FIRE_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://class-reminders.firebaseio.com"
});

module.exports = {
  admin
}
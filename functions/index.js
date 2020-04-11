import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { parseSchedule } from '../server'

admin.initializeApp(functions.config().firebase);
let db = admin.firestore()

const handleFormSubmission = async (email, url) => {
  const splitter = 'schedule/'
  const indexSp = url.indexOf(splitter);
  const id = str.slice(indexSp + splitter.length);

  parseSchedule(id)
    .then(response => {
      classes = Object.keys(response);
      classCollection = db.collection('classList');
      for (let i = 0; i < classes.length; i++) {
        const data = {
          email: email,
          className: classes[i]
        }
        await classCollection.doc(response[classes[i]]).doc()set(data, { merge: true })
      }
    })
    .then(_ => res.send('success'))
    .catch(err => console.log(err));
}
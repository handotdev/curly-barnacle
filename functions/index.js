const functions = require('firebase-functions')
const admin = require('firebase-admin')
const scraper = require('../Scraper-Controller.js')
//import * as async from 'async'

admin.initializeApp(functions.config().firebase);
let db = admin.firestore()

const insertData = (collectionRef, data, time) => {
  return new Promise((resolve, reject) => {
    collectionRef.doc(time).collection('students').add(data, { merge: true })
      .then(() => resolve())
      .catch(err => reject(err))
  })
}

function handleFormSubmission(email, url) {
  return new Promise((resolve, reject) => {
    const splitter = 'schedule/'
    const indexSp = url.indexOf(splitter);
    const id = url.slice(indexSp + splitter.length);

    scraper.parseSchedule(id)
      .then(response => {
        const classes = Object.keys(response);
        const classCollectionRef = db.collection('classList');

        //need to restructure for loop with asychronous foreachof
        let promises = []
        for (let i = 0; i < classes.length; i++) {
          const data = {
            email: email,
            className: classes[i]
          }
          //await classCollectionRef.doc(response[classes[i]]).collection('students').doc().set(data, { merge: true })
          promises.push(insertData(classCollectionRef, response[classes[i]], data))
        }
        return Promise.all(promises);
      })
      .then(_ => resolve())
      .catch(err => reject(err));
  })
}

module.exports = {
  handleFormSubmission: handleFormSubmission
}
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const scraper = require('../scraper.js');
//import * as async from 'async'

let serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
let db = admin.firestore()

const insertData = (collectionsRef, docName, email, docData) => {
  return new Promise((resolve, reject) => {
    collectionsRef
      .doc(docName)
      .collection('students')
      .doc(email)
      .set(docData)
      .then(_ => resolve())
      .catch(err => reject(err))
  })
}

function handleFormSubmission(email, url) {
  return new Promise((resolve, reject) => {
    const splitter = 'schedule/'
    const indexSp = url.indexOf(splitter);
    const id = url.slice(indexSp + splitter.length);

    scraper.parseSchedule(id)
      .then(async (response) => {
        // console.log(response)
        const collectionsRef = await db.collection('classTimes');
        let promises = []
        response.forEach(courseInfo => {
          for (let i = 0; i < courseInfo['days'].length; i += 1) {

            // Get the string containing the group of days this class takes place
            let currentDayGroup = courseInfo['days'][i];

            for (let j = 0; j < currentDayGroup.length; j += 1) {

              // This document name will be something like '11:40AM T' or '11:40AM R'
              let docName = courseInfo['times'][i] + ' ' + currentDayGroup.charAt(j)

              // Store what will go insde the document for a specific email (which is, obviously, in a specific time slot)
              let docData = {
                course: courseInfo['course'],
                name: courseInfo['name'],
                section: courseInfo['section'][i]
              }
              promises.push(insertData(collectionsRef, docName, email, docData))
            }
          }
          Promise.all(promises)
        })
      })
      .then(_ => resolve())
      .catch(err => reject(err));
  })
}

module.exports = {
  handleFormSubmission
}
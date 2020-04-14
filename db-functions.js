let scraper = require('./scraper.js');
let firebase = require('./functions/db-config')

const db = firebase.db

const insertData = (collectionsRef, docName, email, docData) => {
  return new Promise((resolve, reject) => {
    let docRef = collectionsRef.doc(docName)
    docRef.set({ dummy: 'dummy' })
    docRef.collection('students')
      .doc(email)
      .set(docData)
      .then(() => {
        docRef.update({ dummy: admin.firestore.FieldValue.delete() })
        return resolve(true)
      })
      .catch(err => reject(err))
  })
}

function handleFormSubmission(email, id) {
  return new Promise((resolve, reject) => {

    scraper.parseSchedule(id)
      .then(async (response) => {
        if (response.length === 0) throw Error("no responses");
        const collectionsRef = await db.collection('classTimes');
        let promises = [];
        response.forEach(courseInfo => {
          for (let i = 0; i < courseInfo['days'].length; i += 1) {

            // Get the string containing the group of days this class takes place
            let currentDayGroup = courseInfo['days'][i];
            let currentTime = courseInfo['times'][i];

            // Filter out classes without times
            if (currentTime.length > 0) {
              for (let j = 0; j < currentDayGroup.length; j += 1) {

                // Consider for Sunday edge case ('Su')
                const isSunday = currentDayGroup.charAt(j) === 'S' && currentDayGroup.charAt(j + 1) === 'u';

                // This document name will be something like '11:40AM T' or '11:40AM R'
                // Account for "Su" as in Sunday
                const docName = `${(isSunday) ? 'Su' : currentDayGroup.charAt(j)} ${courseInfo['times'][i]}`;

                const docData = {
                  course: courseInfo['course'],
                  name: courseInfo['name'],
                  section: courseInfo['section'][i]
                }

                // Increment if it is Sunday
                if (isSunday) j++;

                // Add data to firebase
                promises.push(insertData(collectionsRef, docName, email, docData))
              }
            }
          }
        })
        return Promise.all(promises).then(() => resolve(true))
      })
      .then(() => { return resolve(true) })
      .catch(err => reject(err));
  })
}

function deleteUser(email) {
  return new Promise((resolve, reject) => {
    db
      .collection('classTimes')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const time = doc.id
          doc.ref
            .collection('students')
            .get()
            .then(querySnapshotForStudents => {
              return querySnapshotForStudents.forEach(async (student) => {
                if (student.id === email) {
                  await student.ref.delete().catch(err => console.log(err))
                }
              })
            })
            .catch(err => reject(err))
        })
        return resolve(true)
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  handleFormSubmission,
  deleteUser
}
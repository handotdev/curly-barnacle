let scraper = require('./scraper.js');
let firebase = require('./functions/db-config');
let emailUtil = require('./functions/email/email-user.ts')

const db = firebase.admin.firestore();


const insertData = (collectionsRef, time, email, docData) => {
  return new Promise((resolve, reject) => {
    let docRef = collectionsRef.doc(time)
    docRef.set({ dummy: 'dummy' })
    docRef.collection('students')
      .doc(email)
      .set(docData)
      .then(() => {
        docRef.update({ dummy: firebase.admin.firestore.FieldValue.delete() })
        resolve(true)
      })
      .catch(err => {
        console.log(err)
        reject(err)
      })
  })
}

function handleFormSubmission(email, id) {
  return new Promise((resolve, reject) => {

    scraper.parseSchedule(id)
      .then(async (response) => {
        if (response.length === 0) reject("Invalid Schedule URL");
        const collectionsRef = await db.collection('classTimes');
        let promises = [];
        let courseData = [];
        let stored = new Set()
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

                if (!stored.has(docData.course + ' ' + docData.section)) {
                  courseData.push(docData)
                  stored.add(docData.course + ' ' + docData.section)
                }
                // Increment if it is Sunday
                if (isSunday) j++;

                // Add data to firebase
                promises.push(insertData(collectionsRef, docName, email, docData))
              }
            }
          }
        })
        Promise.all(promises).then(() => resolve(true))
        return courseData
      })
      .then(async (courseData) => {
        emailUtil.sendConfirmation(email, courseData)
          .then(() => resolve(true))
          .catch((err) => reject(err))
      })
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
        resolve(true)
      })
      .catch(err => reject(err))
  })
}

function deleteClassForUser(email, classCode, classSection) {
  return new Promise((resolve, reject) => {
    db
      .collection('classTimes')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref
            .collection('students')
            .get()
            .then(querySnapshotForStudents => {
              querySnapshotForStudents.forEach(async (student) => {
                console.log(student.id)
                if (student.id === email) {
                  let docData = student.data()
                  if (docData.course === classCode && docData.section === classSection) {
                    await student.ref.delete().catch(err => console.log(err))
                  }
                }
              })
            })
        })
        resolve(true)
      })
      .catch(err => console.log(err));
  })
}

module.exports = {
  insertData,
  handleFormSubmission,
  deleteUser,
  deleteClassForUser
}
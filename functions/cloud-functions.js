const functions = require('firebase-functions');
const emailUtil = require('../email/email-user.ts')
const firebaseDB = require('./firebase-functions.js')

/**
 * DayMapping is an enumeration that maps the day indices (as returned by the
 * .getDay() function for the `Date` object) to either a one or a two character
 * representation of that day. These mapped characters are used in the Firebase
 * documents.
 */
const DayMapping = {
  0: 'Su',
  1: 'M',
  2: 'T',
  3: 'W',
  4: 'R',
  5: 'F',
  6: 'S'
}

/**
 * 
 * @param {*} hours A Number between 0 and 23, representing the hour in 24 hour time
 * @param {*} minutes A number between 0 and 59, representing the minutes
 */
function getRegularTime(hours, minutes) {
  let hoursPrefix;
  let xm;
  if (hours >= 12) {
    hoursPrefix = `${(hours >= 13 ? hours % 12 : hours)}`;
    xm = 'PM'
    if (hours >= 13 && hours < 22) {
      hoursPrefix = '0' + hoursPrefix
    }
  } else {
    hoursPrefix = `${hours}`
    xm = 'AM'
    if (hours >= 0 && hours < 10) {
      hoursPrefix = '0' + hoursPrefix
    }
  }

  const minutesPadded = (minutes >= 0 && minutes < 10) ? ('0' + minutes) : minutes

  return `${hoursPrefix}:${minutesPadded}${xm}`
}

/**
 * Returns a string representing the current time, rounded of to the nearesr 5
 * minutes. The string output replicates the firebase document nomenclature. 
 */
function findNextPossibleClassTime() {
  const coeff = 1000 * 60 * 5;
  const date = new Date(Date.now());
  const rounded = new Date(Math.round(date.getTime() / coeff) * coeff)
  return `${DayMapping[rounded.getDay()]} ${getRegularTime(rounded.getHours(), rounded.getMinutes())}`
}

const sendEmails = async () => {

  // find the time to search Firebase for
  const docToSearch = findNextPossibleClassTime();
  let promises = []
  await firebaseDB.db
    .collection('classList')
    .doc(docToSearch)
    .collection('students')
    .get()
    .then(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        const email = doc.id;
        const classDetails = doc.data();
        const classCode = classDetails.course;
        const className = classDetails.name
        const classSection = classDetils.section
        promises.push(emailUtil.send(email, classCode, className, classSection));
      })

      Promise.all(promises)
    })
    .catch(err => console.log(err))

}
console.log(findNextPossibleClassTime());
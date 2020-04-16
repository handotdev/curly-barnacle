const functions = require('firebase-functions');
const emailUtil = require('./email/email-user.ts')
const firebase = require('./db-config.js')
const moment = require('moment-timezone');


const db = firebase.admin.firestore()
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
    xm = 'PM';
  } else {
    if (hours === 0) {
      hoursPrefix = '12'
    } else {
      hoursPrefix = `${hours}`;
    }
    xm = 'AM';
  }

  const minutesPadded = (minutes >= 0 && minutes < 10) ? ('0' + minutes) : minutes;

  return `${hoursPrefix}:${minutesPadded}${xm}`;
}

/**
 * Returns a string representing the current time, rounded of to the nearesr 5
 * minutes. The string output replicates the firebase document nomenclature. 
 */
function findNextPossibleClassTime() {
  const coeff = 1000 * 60 * 5;
  //get current datetime
  const date = new Date(Date.now());

  // round to the nearest 5 minutes
  let rounded = new Date(Math.round(date.getTime() / coeff) * coeff);

  // Convert to EST, search 10 minutes ahead
  const estDate = moment(rounded).add(10, 'm').tz('America/New_York');

  // convert to our document id format
  return `${DayMapping[estDate.day()]} ${getRegularTime(estDate.hours(), estDate.minutes())}`;
}

const sendEmails = async () => {

  // Find the time to search Firebase for
  const docToSearch = findNextPossibleClassTime();
  // Initialize promises array
  let promises = [];

  await db
    .collection('classTimes')
    // Find the current time's document
    .doc(docToSearch)
    .collection('students')
    // get all documents
    .get()
    .then(querySnapshot => {
      querySnapshot.docs.forEach(async (doc) => {
        const email = doc.id;
        const classDetails = doc.data();
        const classCode = classDetails.course;
        const className = classDetails.name;
        const classSection = classDetails.section;

        // Store the reference to the document corresponding to the class code
        const classRef = db.collection('zoomLinks').doc(classCode);
        await classRef
          .get()
          .then(linkdoc => {
            // If class exists
            if (linkdoc.exists) {
              const link = linkdoc.data()[classSection];
              promises.push(emailUtil.send(email, classCode, className, classSection, link));
            } else {
              promises.push(emailUtil.send(email, classCode, className, classSection, undefined));
            }
            return true
          })
          .catch(err => console.log(err))
      })
      Promise.all(promises).catch(err => console.log(err));
      return true
    })
    .catch(err => console.log(err))
}

exports.scheduledEmailSend = functions.pubsub.schedule('*/5 7-22 * * *')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    console.log('sending emails')
    await sendEmails()
  })

sendEmails()
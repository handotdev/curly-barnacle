let firebase = require('../functions/db-config');

const db = firebase.admin.firestore();
const collectionsRef = db.collection('zoomLinks');

function addLink(classCode, section, link) {
  const data = {}
  data[section] = link
  collectionsRef
    .doc(classCode)
    .set(data, { merge: true })
    .then(() => console.log('successfully added link'))
    .catch(err => console.log(err))
}

addLink('CS 3110', 'DIS 69', 'lets go')
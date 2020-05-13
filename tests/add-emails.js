let firebase = require('../functions/db-config');
const functions = require('../db-functions.js');

const db = firebase.admin.firestore();
const collectionsRef = db.collection('classTimes');

const toAdd = {
    // Format D H:MMZZ (e.g. W 12:55AM or M 1:25PM)
    // time: 'W 1:25AM',

    // email to send email
    // ag759@cornell.edu
    // email: 'hyw2@cornell.edu',

    data: {
        // Course code (e.g. INFO 1200)
        course: 'INFO 1200',
        // Name of course to be displayed
        name: 'Intro to Law and Ethics of Technology',
        // Section ID (DIS 204)
        section: 'DIS 204'
    }
}

const times = ['4:00', '4:05', '4:10', '4:15', '4:20', '4:25', '4:30', '4:35', '4:40'];

// times.forEach((time) => {
//     functions.insertData(collectionsRef, "Su " + time + "AM", 'ag759@cornell.edu', toAdd.data).then((res) => {
//         console.log("Successfully add doc for ag759@cornell.edu at " + time);
//     });
//     functions.insertData(collectionsRef, "Su " + time + "AM", 'hyw2@cornell.edu', toAdd.data).then((res) => {
//         console.log("Successfully add doc for hyw2@cornell.edu at " + time);
//     });
// })
let alpha = "qwertyuiopasdfghjklzxcvbnm"
const emails = ['ag759@cornell.edu', 'hyw2@cornell.edu']

alpha.split("").forEach(char => {
    emails.push(char + "@cornell.edu")
    emails.push(char + "a@cornell.edu")
})

emails.forEach(email => {
    functions.insertData(collectionsRef, "F 4:35AM", email, toAdd.data)
        .then((res) => console.log('successfully added email for ' + email))
})
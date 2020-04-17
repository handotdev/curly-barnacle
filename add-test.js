let firebase = require('./functions/db-config');
const functions = require('./db-functions.js');

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

const times = ['8:10', '8:15', '8:20', '8:25', '8:30', '8:35'];

times.forEach((time) => {
    functions.insertData(collectionsRef, "R " + time + "PM", 'ag759@cornell.edu', toAdd.data).then((res) => {
        console.log("Successfully add doc for ag759@cornell.edu at " + time);
    });
    functions.insertData(collectionsRef, "R " + time + "PM", 'hyw2@cornell.edu', toAdd.data).then((res) => {
        console.log("Successfully add doc for hyw2@cornell.edu at " + time);
    });
})
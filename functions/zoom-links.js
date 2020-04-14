const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

// Initialize firebase firestore credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
let db = admin.firestore();

function setLinks(zoomLinks) {
    // Set promises to send message after successful setting of all courses
    let promises = [];
    const entries = Object.entries(zoomLinks);
    entries.forEach(([course, links]) => {
        const collectionsRef = db.collection('zoomLinks');
        // {merge:true} is very important to allow for overriding
        promises.push(collectionsRef.doc(course).set(links, { merge: true }).then(() => {
            return console.log("Successfully set links for " + course);
        }));
    })
    Promise.all(promises).then(() => {
        return console.log("All courses set successfully");
    }).catch(err => err)
}

// Zoom links to set/update the database. 
const zoomLinks = {
    "INFO 1200": {
        "DIS 202": "https://applications.zoom.us/lti/rich/j/338807462?oauth_consumer_key=s8PjZ54aTV69YUzqkRvzMw&lti_scid=554d4e62cca20a396828998037615dfe9cceefe50c359d66c9ce004830889adf",
        "DIS 204": "https://applications.zoom.us/lti/rich/j/270554391?oauth_consumer_key=s8PjZ54aTV69YUzqkRvzMw&lti_scid=554d4e62cca20a396828998037615dfe9cceefe50c359d66c9ce004830889adf"
    },
    "CS 3110": {
        "LEC 001": "TEST"
    }
}

// Invoke function
setLinks(zoomLinks);
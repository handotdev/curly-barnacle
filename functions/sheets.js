const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
require('dotenv').config();
const firebase = require('./db-config')

const db = firebase.admin.firestore()

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load the sheets API credentials
const sheetsCredentials = process.env.SHEETS_CREDENTIALS

// call the script.
authorize(JSON.parse(sheetsCredentials), uploadToFirebase)

// store the ID of our sheet
const sheetID = '1pFQNnNGhzM0OJhFTCXoSdSv1JDDuGrNzYH9YxlwNnJc'
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Get all the meeting IDs stored on the google sheets to transform to a zoom link
 * 
 * @param {*} auth: The authorization credentials allowing us to interface with the
 * sheets API
 */
function getMeetingLinks(auth) {
  return new Promise((resolve, reject) => {
    // Initialize google sheets
    const sheets = google.sheets({ version: 'v4', auth });

    // idLinks will contain the objects of the class with meeting id link with the cell it was stored in
    let idLinks = []

    sheets.spreadsheets.values
      .get({
        spreadsheetId: sheetID,

        // get all the columns where the links and meeting IDs are stored
        range: 'LinkFormData!E2:E',
      }, (err, res) => {
        if (err) return reject('The API returned an error: ' + err);

        // get all the rows
        const rows = res.data.values;

        if (rows.length) {
          rows.map((row, index) => {
            // TODO: change this check.

            // check for empty rows
            if (row.length) {
              console.log(row)
              if (/[0-9]{3}-[0-9]{3}-[0-9]{3,5}/.test(row[0])) {
                // Push the meetingID and corresponding cell onto iddLinks
                idLinks.push({ meetingID: row[0], cell: `E${2 + index}`, toUpdate: true })
              } else if (row[0].includes('cornell.zoom.us') || row[0].includes('canvas.cornell.edu')) {
                idLinks.push({ meetingID: row[0], cell: `E${2 + index}`, toUpdate: false })
              }
            }
          });
        } else {
          reject('No data found.');
        }
        console.log(idLinks)
        resolve(idLinks)
      })
  })
}

function updateMeetingToLink(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  // Get all the entries where meeting IDs have been entered instead of zoom links
  return new Promise((resolve, reject) => {
    getMeetingLinks(auth)
      .then(idLinks => {
        let dataArr = []
        idLinks.forEach(({ meetingID, cell, toUpdate }) => {
          // reformat meeting ID to zoom link (if it needs to be updated)
          let meetingLink = toUpdate ? 'https://cornell.zoom.us/j/' + meetingID.split('-').join('') : meetingID

          // set the value to enter onto the cell
          const value = [[meetingLink]]

          // Reformat the cell value to A1 notation
          const cellInput = `LinkFormData!${cell}:${cell}`

          // Set the data config for this specific entry
          const data = {
            range: cellInput,
            majorDimension: "ROWS",
            values: value
          }
          dataArr.push(data)
        })

        const resource = {
          valueInputOption: 'RAW',
          data: dataArr
        }

        // batch update all the entries that need updating
        sheets.spreadsheets.values.batchUpdate({
          spreadsheetId: sheetID,
          resource: resource
        }, (err, _) => {
          if (err) return console.log(err);
          console.log('successfully updated')
          resolve()
        })
      })
      .catch(err => reject(err))
  })
}

function addNewLink(course, section, link) {
  return new Promise(async (resolve, reject) => {

    const courseRef = await db.collection('unconfirmedLinks').doc(course);
    courseRef.set({ [section]: link }, { merge: true }).then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

async function uploadToFirebase(auth) {
  const _ = await updateMeetingToLink(auth)
  const sheets = google.sheets({ version: 'v4', auth });
  sheets.spreadsheets.values
    .get({
      spreadsheetId: sheetID,

      // get all the columns where the links and meeting IDs are stored
      range: 'LinkFormData!A2:E',
    }, (err, res) => {
      if (err) return console.log('Error in uploadToFirebase: ' + err)

      // get all the rows from spreadsheet
      const rows = res.data.values;

      if (rows.length) {
        rows.forEach(async row => {
          if (row.length) {
            const courseCode = row[2]
            const sectionCode = row[3]
            const zoomLink = row[4]
            // add the zoom link corresponding to the appropriate class + section to firebase
            const _ = await addNewLink(courseCode, sectionCode, zoomLink)
          }
        })

        // Delete all rows, 'refresh' spreadsheet
        sheets.spreadsheets.batchUpdate({
          spreadsheetId: sheetID,
          resource: {

            "requests": [
              {
                "deleteRange": {
                  "range": {
                    "sheetId": "545073997",
                    "startRowIndex": "2",
                    "endRowIndex": 100
                  },
                  "shiftDimension": "ROWS"
                }
              }
            ]
          }
        }, (err, _) => {
          if (err) return console.log(err)
        })


      } else {
        console.log('no data found.')
      }
    })
}

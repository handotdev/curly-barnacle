const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
require('dotenv').config();

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
// fs.readFile('credentials.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Google Sheets API.
//   authorize(JSON.parse(content), listMajors);
// });

const sheetsCredentials = process.env.SHEETS_CREDENTIALS
authorize(JSON.parse(sheetsCredentials), updateMeetingToLink)

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

function getMeetingLinks(auth) {
  return new Promise((resolve, reject) => {
    const sheets = google.sheets({ version: 'v4', auth });
    let idLinks = []
    sheets.spreadsheets.values
      .get({
        spreadsheetId: '1pFQNnNGhzM0OJhFTCXoSdSv1JDDuGrNzYH9YxlwNnJc',
        range: 'LinkFormData!E2:E',
      }, (err, res) => {
        if (err) return reject('The API returned an error: ' + err);
        const rows = res.data.values;
        if (rows.length) {
          rows.map((row, index) => {
            if (!(row[0].includes('cornell.zoom.us'))) {
              idLinks.push({ meetingID: row[0], cell: `G${2 + index}` })
            }
          });
        } else {
          reject('No data found.');
        }
        resolve(idLinks)
      })
  })
}

function updateMeetingToLink(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  getMeetingLinks(auth)
    .then(idLinks => {
      idLinks.forEach(({ meetingID, cell }) => {
        // reformat meeting ID to zoom link
        const meetingLink = 'https://cornell.zoom.us/j/' + meetingID.split('-').join('')
        const value = [[meetingLink]]
        const cellInput = `LinkFormData!${cell}:${cell}`

        const resource = { values: value }
        sheets.spreadsheets.values.update({
          spreadsheetId: '1pFQNnNGhzM0OJhFTCXoSdSv1JDDuGrNzYH9YxlwNnJc',
          range: cellInput,
          valueInputOption: 'RAW',
          resource: resource
        }, (err, _) => {
          if (err) return console.log(err);
          console.log('successfully updated')
        })
      })
    })
}

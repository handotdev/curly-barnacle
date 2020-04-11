import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { parseScheduleURL } from '../server'

admin.initializeApp(functions.config().firebase);
let db = admin.firestore()

exports.handleFormSubmission = (email, url) => {
  parseScheduleURL(url)
    .then(responseJSON => {

    })
}
export { db }
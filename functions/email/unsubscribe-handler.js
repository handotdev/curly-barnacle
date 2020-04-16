const axios = require('axios')

function removeUser(email) {
  axios.post(`/api/delete-user?email=${email}`)
    .then(() => true)
    .catch(err => false)
}

function removeClassSection(email, classCode, classSection) {
  axios.post(`/api/delete-class-section?email=${email}&classCode=${classCode}&classSection=${classSection}`)
    .then(() => true)
    .catch(_ => false)
}

module.exports = {
  removeUser,
  removeClassSection
}
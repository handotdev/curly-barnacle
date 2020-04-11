const express = require('express')
const app = express();

//const scraper = require('./Scraper-Controller.js')
const functions = require('./functions/index.js')

// app.get('/api/schedule', (req, res) => {
//     scraper.parseSchedule(req.query.id)
//         .then(result => {
//             res.send({
//                 success: true,
//                 data: result,
//                 response: 'data successfully retrieved'
//             });
//         })
//         .catch(err => {
//             console.log(err);
//             res.send({
//                 success: false,
//                 response: "something went wrong. This is likely to be a mistake in schedule parsing."
//             })
//         })
// })

app.get('/api/firebase-test', (req, res) => {
    functions.handleFormSubmission('hyw2@cornell.edu', 'https://classes.cornell.edu/shared/schedule/SP20/92eac951cf5b329be2522a9829421833')
        .then(_ => res.send('success'))
        .catch(err => console.log(err))
})

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

// module.exports = {
//     parseSchedule: parseSchedule
// }
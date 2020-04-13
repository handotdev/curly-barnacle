const express = require('express')
const app = express();
const cors = require('cors');
const functions = require('./functions/firebase-functions.js')

app.use(cors());

app.get('/api/schedule', (req, res) => {
    const { email, id } = req.query;
    functions.handleFormSubmission(email, id)
        .then((status) => res.send({ success: status }))
        .catch((error) => res.send({ success: false, message: error }))
})

const PORT = 3333;
// functions.deleteUser('hyw2@cornell.edu');

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
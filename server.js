const express = require('express')
const app = express();
const cors = require('cors');
const functions = require('./functions/firebase-functions.js')

app.use(cors());

app.get('/api/schedule', (req, res) => {
    const { email, id } = req.query;
    functions.handleFormSubmission(email, id)
        .then((status) => res.send({success: status}))
        .catch((error) => res.send({success: false, message: error}))
})

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
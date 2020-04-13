const express = require('express')
const app = express();
const cors = require('cors');
const functions = require('./functions/index.js')

app.use(cors());

app.get('/api/schedule', (req, res) => {
    const { email, id } = req.query;
    functions.handleFormSubmission(email, id)
        .then(_ => res.send('success'))
        .catch(err => console.log(err))
})

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
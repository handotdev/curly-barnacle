const express = require('express')
const app = express();
const cors = require('cors');
const functions = require('./db-functions.js');

app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/api/schedule', (req, res) => {
    const { email, id } = req.query;
    functions.handleFormSubmission(email, id)
        .then((status) => res.send({ success: status }))
        .catch((error) => res.send({ success: false, message: error }))
})

app.post('/api/delete-user', (req, res) => {
    const email = req.query.email
    functions.deleteUser(email)
        .then(() => res.send({ success: true }))
        .catch(err => res.send({ success: false, message: err }))
})

app.post('/api/delete-class-section', (req, res) => {
    const { email, classCode, classSection } = req.query
    functions.deleteClassForUser(email, classCode, classSection)
        .then(() => res.send({ success: true }))
        .catch(err => res.send({ success: false, message: err }))
})

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const PORT = process.env.PORT || 3333;
// functions.deleteUser('hyw2@cornell.edu');

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const functions = require('./db-functions.js');
const CryptoJS = require('crypto-js')

app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/api/schedule', (req, res) => {
    const {
        email,
        id
    } = req.query;
    functions
        .handleFormSubmission(email, id)
        .then((status) =>
            res.send({
                success: status,
            })
        )
        .catch((error) =>
            res.send({
                success: false,
                message: error,
            })
        );
});

app.get('/api/addLink', (req, res) => {
    const {
        course,
        section,
        link
    } = req.query;
    functions.handleNewLink(course, section, link)
        .then((res) => {
            res.send({success: true, message: res})
        })
        .catch((err) => {
            res.send({success: false, message: err})
        });
})

app.get('/api/delete-user', (req, res) => {
    const {
        email
    } = req.query;

    const replacedEmail = email.replace(/p1L2u3S/g, '+').replace(/s1L2a3S4h/g, '/').replace(/e1Q2u3A4l/g, '=').replace(/2F9dCse/g, '?');

    const emailDec = CryptoJS.AES.decrypt(replacedEmail, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);

    functions
        .deleteUser(emailDec)
        .then(() => {
            res.redirect('https://media.giphy.com/media/XreQmk7ETCak0/giphy.gif');
        })
        .catch((err) => {
            res.redirect(
                'https://media.giphy.com/media/H54feNXf6i4eAQubud/giphy.gif'
            );
        });
});

app.get('/api/delete-class-section', (req, res) => {
    const {
        email,
        classCode,
        classSection
    } = req.query;

    const replacedEmail = email.replace(/p1L2u3S/g, '+').replace(/s1L2a3S4h/g, '/').replace(/e1Q2u3A4l/g, '=').replace(/2F9dCse/g, '?');

    const emailDec = CryptoJS.AES.decrypt(replacedEmail, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);

    const classCodeFormatted = classCode.split('+').join(' ');
    const classSectionFormatted = classSection.split('+').join(' ');

    functions
        .deleteClassForUser(emailDec, classCodeFormatted, classSectionFormatted)
        .then(() => {
            res.redirect('https://media.giphy.com/media/XreQmk7ETCak0/giphy.gif');
        })
        .catch((err) => {
            res.redirect(
                'https://media.giphy.com/media/H54feNXf6i4eAQubud/giphy.gif'
            );
        });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const PORT = process.env.PORT || 3333;
// functions.deleteUser('hyw2@cornell.edu');

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
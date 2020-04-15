const nodemailer = require('nodemailer');
const template = require('./email-template.js')

function send(email, classCode, className, classSection, zoomLink) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'curlybarnacles3333@gmail.com',
      pass: 'barnaclesarecurly',
    },
  });

  const mailOptions = {
    from: 'curlybarnacles3333@gmail.com',
    to: email,
    subject: 'Your class is about to start!',
    html: template.generateHTML(classCode, className, classSection, zoomLink),
    headers: {
      'X-Entity-Ref-ID': null
    }
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject(error)
      } else {
        console.log('Message sent: %s', info.messageId);
        console.log(info.response);
        resolve()
      }
    });
  })
}
// send().catch(console.error);

module.exports = {
  send
}
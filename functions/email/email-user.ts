const nodemailer = require('nodemailer');
const template = require('./email-template.js')

async function send(email, classCode, className, classSection, zoomLink) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '<curly-barnacle>@gmail.com',
      pass: '<curliest-barnacles>',
    },
  });

  const mailOptions = {
    from: '<curly-barnacle>@gmail.com',
    to: email,
    subject: 'Your class is about to start!',
    text: template.generateHTML(classCode, className, classSection, zoomLink),
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

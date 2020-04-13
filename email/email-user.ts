const nodemailer = require('nodemailer');
const template = require('./email-template.js')

async function send(email, className, classSection, zoomLink) {
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
    text: template.generateHTML(className, classSection, zoomLink),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent: %s', info.messageId);
      console.log(info.response);
    }
  });
}
// send().catch(console.error);

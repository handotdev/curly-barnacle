const nodemailer = require('nodemailer');

async function send() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '<curly-barnacle>@gmail.com',
      pass: '<curliest-barnacles>',
    },
  });

  const mailOptions = {
    from: 'anshgodha714@gmail.com',
    to: 'hyw2@cornell.edu, rf382@cornell.edu, anshgodha714@gmail.com',
    subject: 'Test email with Nodemailer!',
    text: "if this works, I'm going to be happy :)",
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

send().catch(console.error);

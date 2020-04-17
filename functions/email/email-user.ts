const nodemailer = require('nodemailer');
require('dotenv').config();
const template = require('./email-template.js');

const gifsDictionary = [
  'https://media.giphy.com/media/DU9uAwPbm2I2A/giphy.gif',
  'https://media.giphy.com/media/xUPJPlFxssGpmLemru/giphy.gif',
  'https://media.giphy.com/media/ny7UCd6JETnmE/giphy.gif',
  'https://media.giphy.com/media/a8749TBnyEIY8/giphy.gif',
  'https://media.giphy.com/media/QDJPrcQzXRAs0/giphy.gif',
  'https://media.giphy.com/media/SWKyABQ08mbXW/giphy.gif',
  'https://media.giphy.com/media/QB44N1iwGN53hAQ46L/giphy.gif',
  'https://media.giphy.com/media/CtqI1GmvT0YVO/giphy.gif',
  'https://media.giphy.com/media/xThuWtk3RNzSouANuU/giphy.gif',
  'https://media.giphy.com/media/heIX5HfWgEYlW/giphy.gif',
  'https://media.giphy.com/media/11JTxkrmq4bGE0/giphy.gif',
  'https://media.giphy.com/media/11JTxkrmq4bGE0/giphy.gif',
  'https://media.giphy.com/media/ReImZejkBnqYU/giphy.gif',
  'https://media.giphy.com/media/SfYTJuxdAbsVW/giphy.gif',
  'https://media.giphy.com/media/l4lRmOLxNiNrqQgAE/giphy.gif',
  'https://media.giphy.com/media/HlqvH9JrahLZ6/giphy.gif',
  'https://media.giphy.com/media/1msDUtCpBk1BihoOGD/giphy.gif',
  'https://media.giphy.com/media/5bdgsd3ChyajOVN0rl/giphy.gif',
  'https://media.giphy.com/media/lNY0TZWyo2bGn0zoFB/giphy.gif',
  'https://media.giphy.com/media/12XDYvMJNcmLgQ/giphy.gif',
  'https://media.giphy.com/media/xT9IgEYXCNqPZnqMuY/giphy.gif',
  'https://media.giphy.com/media/nwyqBwP65XCAU/giphy.gif',
  'https://media.giphy.com/media/1xVbRS6j52YSzp9P7N/giphy.gif',
  'https://media.giphy.com/media/3oEdv71FVw8zgglEu4/giphy.gif',
  'https://media.giphy.com/media/W23aKzDl1OFRAcki9z/giphy.gif',
  'https://media.giphy.com/media/Qeaa8XuP3wYy4/giphy.gif',
  'https://media.giphy.com/media/29IeTbAqWO9kZR49C2/giphy.gif',
  'https://media.giphy.com/media/29IeTbAqWO9kZR49C2/giphy.gif',
  'https://media.giphy.com/media/Te1GM8Hh8ctfKzTA0z/giphy.gif',
  'https://media.giphy.com/media/Te1GM8Hh8ctfKzTA0z/giphy.gif',
  'https://media.giphy.com/media/8Y5yvdpitNnsk/giphy.gif',
  'https://media.giphy.com/media/Zs3L3w6n6O5iw/giphy.gif',
  'https://media.giphy.com/media/Te1GM8Hh8ctfKzTA0z/giphy.gif',
  'https://media.giphy.com/media/Te1GM8Hh8ctfKzTA0z/giphy.gif',
  'https://media.giphy.com/media/Te1GM8Hh8ctfKzTA0z/giphy.gif',
  'https://media.giphy.com/media/3ohhwkYdZquHEowjLi/giphy.gif',
  'https://media.giphy.com/media/2uXgAePwRVfiw/giphy.gif',
  'https://media.giphy.com/media/IpkyqWqbipGg/giphy.gif',
  'https://media.giphy.com/media/Te1GM8Hh8ctfKzTA0z/giphy.gif',
  'https://media.giphy.com/media/116wwYf3ajIvrG/giphy.gif',
  'https://media.giphy.com/media/HteV6g0QTNxp6/giphy.gif',
  'https://media.giphy.com/media/CTX0ivSQbI78A/giphy.gif',
  'https://media.giphy.com/media/l44Qqz6gO6JiVV3pu/giphy.gif',
  'https://media.giphy.com/media/3o6gE9wjkvIvlUz2Pm/giphy.gif',
  'https://media.giphy.com/media/xT0GqCYuRSap3767fy/giphy.gif',
  'https://media.giphy.com/media/bPCwGUF2sKjyE/giphy.gif',
  'https://media.giphy.com/media/irPZPoUOtn2tq/giphy.gif',
  'https://media.giphy.com/media/QW3tBQFN3HPBe6TlEN/giphy.gif',
  'https://media.giphy.com/media/Te1GM8Hh8ctfKzTA0z/giphy.gif',
  'https://media.giphy.com/media/3j3Doprwg5EKA/giphy.gif',
  'https://media.giphy.com/media/1nR7M1kxocswvzZhSf/giphy.gif',
  'https://media.giphy.com/media/ZGDk9lMkuSDhm/giphy.gif',
  'https://media.giphy.com/media/Ymzmd5c2In6HUGjkTB/giphy.gif',
  'https://media.giphy.com/media/QXgBrbZ8HPLcyuqxwv/giphy.gif',
  'https://media.giphy.com/media/jG5uIKBfJyouY/giphy.gif',
  'https://media.giphy.com/media/jG5uIKBfJyouY/giphy.gif',
  'https://media.giphy.com/media/26xBPPcBnFA6kVXsk/giphy.gif',
  'https://media.giphy.com/media/26xBPPcBnFA6kVXsk/giphy.gif',
  'https://media.giphy.com/media/Zs3L3w6n6O5iw/giphy.gif',
  'https://media.giphy.com/media/Zs3L3w6n6O5iw/giphy.gif',
  'https://media.giphy.com/media/xlGYf1RUbYYes/giphy.gif',
  'https://media.giphy.com/media/xlGYf1RUbYYes/giphy.gif',
  'https://media.giphy.com/media/Qs1NPCMTc3DmdTuSOi/giphy.gif',
  'https://media.giphy.com/media/TDLOCATcExXAm24MPm/giphy.gif',
  'https://media.giphy.com/media/l3V0bHFXjLrgwWnWE/giphy.gif',
  'https://media.giphy.com/media/26n3JkrnmfjfGZkQ0/giphy.gif',
  'https://media.giphy.com/media/1msBxvEtlSaub37nqi/giphy.gif',
  'https://media.giphy.com/media/xT4uQy7XiGDu923snm/giphy.gif',
  'https://media.giphy.com/media/RMNrCC4WC0qfjN9F8p/giphy.gif',
  'https://media.giphy.com/media/l0HlA4HGCe8ASEuJ2/giphy.gif',
];

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

function send(email, classCode, className, classSection, zoomLink) {

  const gifDictLen = gifsDictionary.length;
  const randomGif = gifsDictionary[Math.floor(Math.random() * gifDictLen)];

  const mailOptions = {
    from: 'Notifs <curlybarnacles3333@gmail.com>',
    to: email,
    subject: `🔔 Your next class: ${classCode} is about to start!`,
    html: template.generateHTML(
      email,
      classCode,
      className,
      classSection,
      zoomLink,
      randomGif
    ),
    headers: {
      'X-Entity-Ref-ID': null,
    },
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log('Message sent: %s', info.messageId);
        console.log(info.response);
        resolve();
      }
    });
  });
}

function sendConfirmation(email, courseData) {

  const mailOptions = {
    from: 'Notifs <curlybarnacles3333@gmail.com>',
    to: email,
    subject: `💃 Successfully Registered!`,
    html: template.generateConfirmationHTML(courseData),
    headers: {
      'X-Entity-Ref-ID': null,
    },
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log('Message sent: %s', info.messageId);
        console.log(info.response);
        resolve();
      }
    });
  });
}

// send().catch(console.error);

module.exports = { send, sendConfirmation };

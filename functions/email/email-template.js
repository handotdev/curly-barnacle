// Thought - create a simple page displaying a message?
const CryptoJS = require('crypto-js');

function generateHTML(
  email,
  classCode,
  className,
  sectionName,
  zoomLink,
  gif = 'https://media.giphy.com/media/12XDYvMJNcmLgQ/giphy.gif',
  API_KEY
) {

  const secret
  return `
  <p>
    Your next class: <strong>${classCode} (${className}) Section ${sectionName}</strong> is starting in <strong>10 minutes</stron>!
  </p>
  <p>
    ${
      zoomLink
        ? `Access your class at: <a href="${zoomLink}">${zoomLink}</a>`
        : `We unfortunately don't have a zoom link for this class right now 😢<br>
      But you can tell us <a href="https://docs.google.com/forms/d/e/1FAIpQLSfIr_-DglAuOSA7Z7YbRW-e41tVZQdAtR6W1PxJly_hkEQeaQ/viewform?usp=pp_url&entry.366340186=${classCode
        .split(' ')
        .join('+')}&entry.805749716=${sectionName
            .split(' ')
            .join('+')}">here</a> so we can send this to you in the future!`
    }
  </p>
  <img src="${gif}">
  <p> Click <a href="www.cornellnotifs.com/api/delete-class-section?API_KEY=${API_KEY}&email=${email}&classCode=${classCode
    .split(' ')
    .join(
      '+'
    )}&classSection=${sectionName}">here</a> to stop receiving emails for this class. Click <a href="www.cornellnotifs.com/api/delete-user?API_KEY=${API_KEY}&email=${email}">here</a> to unsubscribe from Cornell Notifs</p>
  `;
}

module.exports = {
  generateHTML,
};

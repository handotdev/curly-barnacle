// Thought - create a simple page displaying a message?
const CryptoJS = require('crypto-js');

function generateHTML(
  email,
  classCode,
  className,
  sectionName,
  zoomLink,
  gif = 'https://media.giphy.com/media/12XDYvMJNcmLgQ/giphy.gif'
) {
  const secretKey = process.env.SECRET_KEY;
  const cipherText = CryptoJS.AES.encrypt(email, secretKey).toString();
  const cipherString = cipherText.replace(/\+/g, 'p1L2u3S').replace(/\//g, 's1L2a3S4h').replace(/=/g, 'e1Q2u3A4l').replace(/\?/g, '2F9dCse');
  return `
  <p>
    Your next class: <strong>${classCode} (${className}) Section ${sectionName}</strong> is starting in <strong>10 minutes</stron>!
  </p>
  <p>
    ${
    zoomLink
      ? `Access your class at: <a href="${zoomLink}">${zoomLink}</a>`
      : `We unfortunately don't have a zoom link for this class right now 😢<br>
      But you can tell us <a href="https://docs.google.com/forms/d/e/1FAIpQLSfIr_-DglAuOSA7Z7YbRW-e41tVZQdAtR6W1PxJly_hkEQeaQ/viewform?usp=pp_url&entry.366340186=${classCode.split(' ').join('+')}&entry.805749716=${sectionName.split(' ').join('+')}">here</a> so we can send this to you in the future!`
    }
  </p>
  <img src="${gif}">
  <p> Click <a href="www.cornellnotifs.com/api/delete-class-section?email=${cipherString}&classCode=${classCode.split(' ').join('+')}&classSection=${sectionName.split(' ').join('+')}">here</a> to stop receiving emails for this class. Click <a href="www.cornellnotifs.com/api/delete-user?email=${cipherString}">here</a> to unsubscribe from Cornell Notifs</p>
  `;
}

function generateConfirmationHTML(courseData) {

  let courses = ""
  courseData.forEach(courseInfo => {
    const courseCode = courseInfo.course
    const courseName = courseInfo.name
    const sectionCode = courseInfo.section
    courses += `<li>${courseCode} (${courseName}), ${sectionCode}</li>`
  })
  return (
    `
    <p>Hey there! Welcome to Cornell Notifs! You will get reminders for the following courses:</p> 
    <ul>
    ${courses}
    </ul>
    <img src="https://media.giphy.com/media/a0h7sAqON67nO/giphy.gif">
    <br>
    <p>Cheers,</p>
    <p>Han & Ansh</p>
    `
  )
}

module.exports = {
  generateHTML,
  generateConfirmationHTML
};
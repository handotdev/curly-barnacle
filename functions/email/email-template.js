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
      ? `Access your class at: <a href="${zoomLink}">${zoomLink}</a><br><br>
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSfIr_-DglAuOSA7Z7YbRW-e41tVZQdAtR6W1PxJly_hkEQeaQ/viewform?usp=pp_url&entry.366340186=${classCode.split(' ').join('+')}&entry.805749716=${sectionName.split(' ').join('+')}" style="font-weight: bold; text-decoration: none; color: #4082ed;">Incorrect Zoom Link? Let us know here</a>`
      : `We unfortunately don't have a zoom link for this class right now 😢<br><br>
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSfIr_-DglAuOSA7Z7YbRW-e41tVZQdAtR6W1PxJly_hkEQeaQ/viewform?usp=pp_url&entry.366340186=${classCode.split(' ').join('+')}&entry.805749716=${sectionName.split(' ').join('+')}" style="font-weight: bold; text-decoration: none; color: #4082ed;">Add Zoom Link</a>`
    }
  </p>
  <img src="${gif}">
  <br>
  <br>
  <p style="font-size:11px"> Click <a href="www.cornellnotifs.com/api/delete-class-section?email=${cipherString}&classCode=${classCode.split(' ').join('+')}&classSection=${sectionName.split(' ').join('+')}">here</a> to stop receiving emails for this class. Click <a href="www.cornellnotifs.com/api/delete-user?email=${cipherString}">here</a> to unsubscribe from Cornell Notifs</p>
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

function generateGoodbyeHTML() {
  return (
    `<p>Hey there!</p><br>
    <p>This will be our last email to you guys this semester 😢. It's been a tough semester for all of us, but hey... we made it! Just one last stretch, and we'll be done with finals. We can do it! We hope you guys have an amazing summer. To our seniors... congratulations! It sucks to not be with y'all on campus to see you off as you step into a new phase of your life. To the others... we hope to see you around next semester!</p><br>
    <p>Best of luck on finals, you're gonna do just fine! For now, this is goodbye.</p><br>

    <p>With ❤️,<p>
    <p>Ansh and Han</p>
    `
  )
}

module.exports = {
  generateHTML,
  generateConfirmationHTML,
  generateGoodbyeHTML
};
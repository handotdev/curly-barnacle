// Thought - create a simple page displaying a message?
function generateHTML(email, classCode, className, sectionName, zoomLink, gif = "https://media.giphy.com/media/12XDYvMJNcmLgQ/giphy.gif") {
  return (
    `
  <p>
    Your next class: <strong>${classCode} (${className}) Section ${sectionName}</strong> is starting in <strong>10 minutes</stron>!
  </p>
  <p>
    ${zoomLink ? `Access your class at: <a href="${zoomLink}">${zoomLink}</a>` :
      `We unfortunately don't have a zoom link for this class right now 😢<br>
      But you can tell us <a href="https://docs.google.com/forms/d/e/1FAIpQLSfIr_-DglAuOSA7Z7YbRW-e41tVZQdAtR6W1PxJly_hkEQeaQ/viewform?usp=pp_url&entry.366340186=${classCode.split(' ').join('+')}&entry.805749716=${sectionName.split(' ').join('+')}">here</a> so we can send this to you in the future!`
    }
  </p>
  <img src="${gif}">

  <footer>
    <p> Don't want notifications for this class section anymore? Click <a href="www.cornellnotifs.com" onclick='removeUser(${email})'>here</a> to stop receiving emails for this class.
    <p> Don't want any reminders? Click <a href="www.cornellnotifs.com" onclick='removeClassSection(${email},${classCode},${sectionName}')here</a> to stop receiving reminders from Cornell Notifs
  </footer>
  `
  )
}

module.exports = {
  generateHTML
}
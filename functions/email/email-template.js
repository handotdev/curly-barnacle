function generateHTML(classCode, className, sectionName, zoomLink, gif = "https://media.giphy.com/media/12XDYvMJNcmLgQ/giphy.gif") {
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
    <p>Don't want notifications for this class section anymore? Click <a href="delete user class link">here</a> </p>
    <p>Don't want class alerts? Click <a href="delete user link">here</a></p>
  </footer>
  `
  )
}

module.exports = {
  generateHTML
}
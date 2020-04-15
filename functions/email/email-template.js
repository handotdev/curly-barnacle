function generateHTML(classCode, className, sectionName, zoomLink) {
  return (
    `
  <p>Hello there!</p>
  <p>
    You have a class coming up - ${classCode}, ${className}, ${sectionName}. The Zoom link for the class
    is:
  </p>
  <a href="${zoomLink}">${zoomLink}</a>`
  )
}

module.exports = {
  generateHTML
}
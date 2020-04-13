function generateHTML(className, sectionName, zoomLink) {
  return (
    `<body> 
  <p>Hello there!</p>
  <p>
    You have a class coming up - ${className}, ${sectionName}. The Zoom link for the class
    is:
  </p>
  <a href="${zoomLink}">${zoomLink}</a>
  </body>`
  )
}


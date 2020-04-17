const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
/**  disable-eslint */

function parseSchedule(id) {
  return new Promise((resolve, reject) => {
    const url = `https://classes.cornell.edu/shared/schedule/${id}`;

    puppeteer
      .launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
      .then(browser => browser.newPage())
      .then(page => {
        return page.goto(url)
          .then(() => {
            return page.content();
          });
      })
      .then((html) => {
        const $ = cheerio.load(html);

        // Initialize a map of classes on schedule indicating that it is a 
        // selected class
        const coursesMap = {};
        const scheduleClasses = $('.fc-content');
        // Loop through all classes on schedule
        for (let i = 0; i < scheduleClasses.length; i++) {
          const scheduleClass = scheduleClasses[i];
          const courseCode = $(scheduleClass).children('span').first().text().trim();

          if (!coursesMap[courseCode]) coursesMap[courseCode] = true;
        }

        // Initialize list for class objects
        let classList = []

        const expander = $(".expander.ng-binding");
        // Loops through all expanders
        for (let i = 0; i < expander.length; i++) {
          const courseHeader = expander[i];

          // Grab course codes
          courseCode = $(courseHeader.children[1]).text().trim();

          // If the course is in the map on the schedule
          if (coursesMap[courseCode]) {

            // Initialize the class object
            let classInfo = {}
            classInfo['course'] = courseCode;

            // Grab course name
            courseNameRaw = $(courseHeader).text().trim();
            courseName = courseNameRaw.split(' ').slice(2).join(" ");
            classInfo['name'] = courseName;

            // Grab section ids
            const coursePinnedSection = $(courseHeader.parent.parent).find('.ng-binding.classnbr-pinned').toArray();
            classInfo['section'] = coursePinnedSection.map(section => section.children[0].data.trim());

            // Grab days for specific sections
            const coursePinnedDays = $(courseHeader.parent.parent).find('.mtg-pat.classnbr-pinned').toArray();
            classInfo['days'] = coursePinnedDays.map(day => $(day.children[2]).text().trim());

            // Grab times for specific sections
            const coursePinnedTimes = $(courseHeader.parent.parent).find('.mtg-time.classnbr-pinned').toArray();
            classInfo['times'] = coursePinnedTimes.map(time => $(time.children[2]).text().trim());

            // Add to class list
            classList.push(classInfo);

          }
        }
        resolve(classList)
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  parseSchedule
}
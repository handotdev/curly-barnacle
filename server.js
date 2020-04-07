const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const url = 'https://classes.cornell.edu/shared/schedule/SP20/92eac951cf5b329be2522a9829421833';

puppeteer
    .launch()
    .then(browser => browser.newPage())
        .then(page => {
            return page.goto(url).then(function() {
                return page.content();
            });
        })
    .then(html => {
        const $ = cheerio.load(html);

        const events = $('.fc-time-grid-event.fc-v-event.fc-event.fc-start.fc-end');
        
        for (const index in events) {
            const event = events[index];

            if (event.name === 'a') {
                // Get class of 'fc-content'
                const content = event.children[0];
                
                // Get DOM of span with course code
                const titleSpan = content.children[0];
                // Retrieve value of course code
                const courseCode = titleSpan.children[0].data;

                // Get DOM of span with course details
                const detailsSpan = content.children[2];
                // Identify DOM of section value
                const sectionDOM = detailsSpan.children[0];
                // Retrieve value of section
                const section = sectionDOM.data;
                // Identify DOM of times value
                const timeDOM = detailsSpan.children[4];
                // Retrieve value of time
                const time = timeDOM.data;

                const courseTime = {
                    courseCode,
                    section,
                    time
                }

                console.log(courseTime);

            }
        }
    })
    .catch(console.error);
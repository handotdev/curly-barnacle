const express = require('express')
const app = express();

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

app.get('/api/schedule', (req, res) => {

    const { id } = req.query;

    const url = `https://classes.cornell.edu/shared/schedule/${id}`;

    puppeteer
    .launch()
    .then(browser => browser.newPage())
        .then(page => {
            return page.goto(url).then(() => {
                return page.content();
            });
        })
    .then(html => {
        const $ = cheerio.load(html);

        const events = $('.fc-time-grid-event.fc-v-event.fc-event.fc-start.fc-end');

        if (events.length === 0) res.send({success: false, response: 'invalid schedule id'});
        
        // TODO: Find an optimized and more organized approach to retrieving
        // the values rather than this rigid approach

        let userCoursesData = [];

        for (const index in events) {
            const event = events[index];

            if (event.name === 'a') {
                // Get class of 'fc-content'
                const content = event.children[0];
                
                // Get DOM of span with course code
                const titleSpan = content.children[0];
                // Retrieve value of course code
                const course = titleSpan.children[0].data;

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
                    course,
                    section,
                    time
                }

                userCoursesData.push(courseTime)
            }
        }

        const requestResult = {
            success: true,
            response: 'data successfully retrieved',
            data: userCoursesData 
        }
        
        res.send(requestResult);
    })
    .catch((err) => {
        res.send({success: false, response: 'browser did not load'})
    });
})

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
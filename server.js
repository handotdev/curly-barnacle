const express = require('express');
const cors = require('cors');
const app = express();
// Enable cors
app.use(cors());

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');


const parseSchedule = id => {
    return new Promise((resolve, reject) => {
        const url = `https://classes.cornell.edu/shared/schedule/SP20/${id}`;

        puppeteer
            .launch()
            .then(browser => browser.newPage())
            .then(page => {
                return page.goto(url)
                    .then(() => {
                        return page.content();
                    });
            })
            .then(html => {
                const $ = cheerio.load(html);

                const tableWrapper = $(".fc-content-skeleton");

                //get table
                const table = tableWrapper[0].children[0];
                // get table body
                const tableBody = table.children[0];
                // get .tr class
                const tr = tableBody.children[0];
                // finally... get the content-carrying .tds 
                const tdList = tr.children.slice(1);
                let userCoursesData = []
                for (const index in tdList) {
                    const tdEl = tdList[index];

                    // get .event-container
                    const eventContainer = tdEl.children[0].children[1];
                    eventContainer.children.forEach(child => {
                        if (child.name === 'a') { //we are now in the classlist .fc-time-grid-event.fc-v-event.fc-event.fc-start.fc-end
                            // Get class of 'fc-content'
                            const content = child.children[0];

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
                                time,
                                index
                            }

                            userCoursesData.push(courseTime)
                        }
                    })
                }
                console.log(userCoursesData)
                resolve(userCoursesData)
            })
            .catch(err => reject(err))
    })
}

app.get('/api/schedule', (req, res) => {
    parseSchedule(req.query.id)
        .then(result => res.send({
            success: true,
            data: result,
            response: 'data successfully retrieved'
        }))
        .catch(err => {
            console.log(err);
            res.send({
                success: false,
                response: "somethng went wrong. This is likely to be a mistake in schedule parsing."
            })
        })
})

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
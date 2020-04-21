let firebase = require('./functions/db-config');

const db = firebase.admin.firestore();
const classesRef = db.collection('classTimes');
const linksRef = db.collection('zoomLinks');

const loopStudents = async () => {
    const snapshot = await classesRef.get();
    const studentData = [];
    snapshot.forEach((doc) => {
        studentData.push(doc.ref.collection('students').get());
    })
    return Promise.all(studentData);
}

const loopLinks = async () => {
    const snapshot = await linksRef.get();
    const linksData = [];
    snapshot.forEach((doc) => {
        linksData.push({course: doc.id, links: doc.data()});
    })
    return linksData;
}

const getUniqueStudents = () => {

    const studentsMap = {};
    loopStudents().then(res => {
        res.forEach(studentSnapshot => {
            studentSnapshot.forEach(student => {
                studentsMap[student.id] = true;
            })
        })
        const uniqueStudentsList = Object.keys(studentsMap);
        // Log all students
        console.log(uniqueStudentsList);
        // Log the number of unique
        console.log(`Number of unique students: ${uniqueStudentsList.length}`);
    })
}

const getUniqueCourses = () => {
    
    const coursesMap = {};
    loopStudents().then(res => {
        res.forEach(studentSnapshot => {
            studentSnapshot.forEach(student => {
                const { course, section } = student.data();
                if (coursesMap[`${course} ${section}`]) {
                    coursesMap[`${course} ${section}`].count += 1;
                } else {
                    coursesMap[`${course} ${section}`] = {count: 1, hasLink: false}
                }
            })
        })
        
        // Loop through links to see they exist for a course
        loopLinks().then(res => {
            res.forEach(courseObj => {
                const { course, links } = courseObj;
                Object.keys(links).forEach((section) => {
                    if (coursesMap[`${course} ${section}`]) coursesMap[`${course} ${section}`].hasLink = true;
                })
            })

            // Build array to visualize most popular courses
            const classesArray = [];
            Object.entries(coursesMap).forEach(([className, info]) => {
                classesArray.push({className: className, count: info.count, hasLink: info.hasLink})
            })
            // Sort list
            classesArray.sort((a, b) => (a.count > b.count) ? 1 : -1);
            // Log courses array
            console.log(classesArray);
            // Log number of unique courses
            console.log(`Number of unique classes: ${classesArray.length}`);
        })
    })
}

// Run functions to console log analytics
getUniqueStudents();
// getUniqueCourses();

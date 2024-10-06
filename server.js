const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db/connection');

const timetableRoutes = require('./routes/timetable');
const teacherRoutes = require('./routes/teachers');
const roomRoutes = require('./routes/rooms');
const courseRoutes = require('./routes/courses');
const sectionRoutes = require('./routes/sections');
const departmentRoutes = require('./routes/departments');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to database as id ' + connection.threadId);
});

app.get('/', (req, res) => {
    res.send('Timetable backend API is working!');
});

// Use the routes
app.use('/api/timetable', timetableRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/departments', departmentRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

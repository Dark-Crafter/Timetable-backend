const express = require('express');
const connection = require('./db/connection');

// Import route modules
const timetableRoutes = require('./routes/timetable');
const teacherRoutes = require('./routes/teachers');
const roomRoutes = require('./routes/rooms');
const courseRoutes = require('./routes/courses');
const sectionRoutes = require('./routes/sections');
const departmentRoutes = require('./routes/departments');
const timingsRoutes = require('./routes/timings');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        process.exit(1); // Exit the process if there's a database connection error
    }
    console.log('Connected to database as id ' + connection.threadId);
});

// Basic route for testing the server
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
app.use('/api/timings', timingsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

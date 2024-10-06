// routes/timetable.js
const express = require('express');
const router = express.Router();
const connection = require('../db/connection'); // Ensure this path is correct

// ===== Teachers Routes =====
router.get('/teachers', (req, res) => {
    connection.query('SELECT * FROM teachers', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query error' });
        res.status(200).json(results);
    });
});

router.post('/teachers', (req, res) => {
    const { teacher_name, designation } = req.body; // Adjusted field names
    const query = 'INSERT INTO teachers (teacher_name, designation) VALUES (?, ?)';
    connection.query(query, [teacher_name, designation], (err) => {
        if (err) return res.status(500).json({ error: 'Database insertion error' });
        res.status(201).json({ message: 'Teacher added successfully' });
    });
});

// ===== Rooms Routes =====
router.get('/rooms', (req, res) => {
    connection.query('SELECT * FROM rooms', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query error' });
        res.status(200).json(results);
    });
});

router.post('/rooms', (req, res) => {
    const { room_id, room_type } = req.body; // Adjusted field names
    const query = 'INSERT INTO rooms (room_id, room_type) VALUES (?, ?)';
    connection.query(query, [room_id, room_type], (err) => {
        if (err) return res.status(500).json({ error: 'Database insertion error' });
        res.status(201).json({ message: 'Room added successfully' });
    });
});

// ===== Courses Routes =====
router.get('/courses', (req, res) => {
    connection.query('SELECT * FROM courses', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query error' });
        res.status(200).json(results);
    });
});

router.post('/courses', (req, res) => {
    const { course_id, course_name, course_credits, course_teacher } = req.body; // Adjusted field names
    const query = 'INSERT INTO courses (course_id, course_name, course_credits, course_teacher) VALUES (?, ?, ?, ?)';
    connection.query(query, [course_id, course_name, course_credits, course_teacher], (err) => {
        if (err) return res.status(500).json({ error: 'Database insertion error' });
        res.status(201).json({ message: 'Course added successfully' });
    });
});

// ===== Timetable Entries =====
router.get('/entries', (req, res) => {
    connection.query('SELECT * FROM timetable', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query error' });
        res.status(200).json(results);
    });
});

router.post('/entries', (req, res) => {
    const { course_id, teacher_id, room_id, meeting_id } = req.body; // Ensure these fields match your database
    const query = 'INSERT INTO timetable (course_id, teacher_id, room_id, meeting_id) VALUES (?, ?, ?, ?)';
    connection.query(query, [course_id, teacher_id, room_id, meeting_id], (err) => {
        if (err) return res.status(500).json({ error: 'Database insertion error' });
        res.status(201).json({ message: 'Timetable entry added successfully' });
    });
});

// ===== Sections Routes =====
router.get('/sections', (req, res) => {
    connection.query('SELECT * FROM sections', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query error' });
        res.status(200).json(results);
    });
});

router.post('/sections', (req, res) => {
    const { section_id, department_id, courses_per_week } = req.body; // Adjusted field names
    const query = 'INSERT INTO sections (section_id, department_id, courses_per_week) VALUES (?, ?, ?)';
    connection.query(query, [section_id, department_id, courses_per_week], (err) => {
        if (err) return res.status(500).json({ error: 'Database insertion error' });
        res.status(201).json({ message: 'Section added successfully' });
    });
});

module.exports = router;

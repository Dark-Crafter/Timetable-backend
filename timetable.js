const express = require('express');
const router = express.Router();
const db = require('../db/connection'); // Make sure this path is correct based on your structure

// Get all timetable entries
router.get('/', (req, res) => {
    db.query('SELECT * FROM timetable', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

// Add a timetable entry
router.post('/', (req, res) => {
    const { courseId, teacherId, roomId, sectionId, timing } = req.body;

    const query = 'INSERT INTO timetable (courseId, teacherId, roomId, sectionId, timing) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [courseId, teacherId, roomId, sectionId, timing], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(201).json({ id: result.insertId, courseId, teacherId, roomId, sectionId, timing });
    });
});

// Add other necessary routes (update, delete) as needed...

module.exports = router;

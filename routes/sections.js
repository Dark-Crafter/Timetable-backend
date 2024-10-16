// routes/sections.js
const express = require('express');
const router = express.Router();
const connection = require('../db/connection'); // Ensure this path is correct

// ===== Sections Routes =====

// Get all sections
router.get('/', (req, res) => {
    connection.query('SELECT * FROM sections', (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.status(200).json(results);
    });
});

// Add a new section
router.post('/', (req, res) => {
    const { department_id, courses_per_week } = req.body; // Adjusted field names

    // Check if department_id exists
    connection.query('SELECT * FROM departments WHERE department_id = ?', [department_id], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        if (results.length === 0) {
            return res.status(400).json({ error: 'Department ID does not exist.' });
        }

        const query = 'INSERT INTO sections (department_id, courses_per_week) VALUES (?, ?)';
        connection.query(query, [department_id, courses_per_week], (err) => {
            if (err) {
                console.error('Database insertion error:', err);
                return res.status(500).json({ error: 'Database insertion error' });
            }
            res.status(201).json({ message: 'Section added successfully' });
        });
    });
});

// Update a section
router.put('/:section_id', (req, res) => {
    const section_id = req.params.section_id;
    const { department_id, courses_per_week } = req.body; // Adjusted field names

    // Check if section exists
    connection.query('SELECT * FROM sections WHERE section_id = ?', [section_id], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Section ID not found.' });
        }

        // Check if department_id exists
        connection.query('SELECT * FROM departments WHERE department_id = ?', [department_id], (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ error: 'Database query error' });
            }
            if (results.length === 0) {
                return res.status(400).json({ error: 'Department ID does not exist.' });
            }

            const query = 'UPDATE sections SET department_id = ?, courses_per_week = ? WHERE section_id = ?';
            connection.query(query, [department_id, courses_per_week, section_id], (err) => {
                if (err) {
                    console.error('Database update error:', err);
                    return res.status(500).json({ error: 'Database update error' });
                }
                res.status(200).json({ message: 'Section updated successfully' });
            });
        });
    });
});

// Delete a section
router.delete('/:section_id', (req, res) => {
    const section_id = req.params.section_id;

    // Check if section exists
    connection.query('SELECT * FROM sections WHERE section_id = ?', [section_id], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Section ID not found.' });
        }

        const query = 'DELETE FROM sections WHERE section_id = ?';
        connection.query(query, [section_id], (err) => {
            if (err) {
                console.error('Database deletion error:', err);
                return res.status(500).json({ error: 'Database deletion error' });
            }
            res.status(200).json({ message: 'Section deleted successfully' });
        });
    });
});

module.exports = router;

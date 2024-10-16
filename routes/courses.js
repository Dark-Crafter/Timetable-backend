const express = require('express');
const router = express.Router();
const connection = require('../db/connection'); // Ensure this path is correct

// ===== Courses Routes =====

// Get all courses
router.get('/', (req, res) => {
    connection.query('SELECT * FROM courses', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query error' });
        res.status(200).json(results);
    });
});

// Add a new course
router.post('/', (req, res) => {
    const { course_id, course_name, course_credits, course_teacher } = req.body; // Adjusted field names

    const query = 'INSERT INTO courses (course_id, course_name, course_credits, course_teacher) VALUES (?, ?, ?, ?)';
    connection.query(query, [course_id, course_name, course_credits, course_teacher], (err) => {
        if (err) {
            console.error('Error inserting course:', err); // Log error details
            return res.status(500).json({ error: 'Database insertion error' });
        }
        res.status(201).json({ message: 'Course added successfully', course_id });
    });
});

// Update a course
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { course_name, course_credits, course_teacher } = req.body; // Adjusted field names

    // Check if the course exists before updating
    connection.query('SELECT * FROM courses WHERE course_id = ?', [id], (err, results) => {
        if (err) {
            console.error('Database query error:', err); // Log error details
            return res.status(500).json({ error: 'Database query error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: `Course with ID: ${id} not found` });
        }

        const query = 'UPDATE courses SET course_name = ?, course_credits = ?, course_teacher = ? WHERE course_id = ?';
        connection.query(query, [course_name, course_credits, course_teacher, id], (updateErr) => {
            if (updateErr) {
                console.error('Error updating course:', updateErr); // Log error details
                return res.status(500).json({ error: 'Database update error' });
            }
            res.status(200).json({ message: `Course updated successfully with ID: ${id}` });
        });
    });
});

// Delete a course
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    
    // Check if the course exists before deleting
    connection.query('SELECT * FROM courses WHERE course_id = ?', [id], (err, results) => {
        if (err) {
            console.error('Database query error:', err); // Log error details
            return res.status(500).json({ error: 'Database query error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: `Course with ID: ${id} not found` });
        }

        const query = 'DELETE FROM courses WHERE course_id = ?';
        connection.query(query, [id], (deleteErr) => {
            if (deleteErr) {
                console.error('Error deleting course:', deleteErr); // Log error details
                return res.status(500).json({ error: 'Database deletion error' });
            }
            res.status(200).json({ message: `Course deleted successfully with ID: ${id}` });
        });
    });
});

module.exports = router;

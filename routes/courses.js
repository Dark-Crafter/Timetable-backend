const express = require('express');
const router = express.Router();
const connection = require('../db/connection');

// Get all courses
router.get('/', (req, res) => {
    connection.query('SELECT * FROM courses', (error, results) => {
        if (error) return res.status(500).send({ error: 'Database query error: ' + error.message });
        res.status(200).json(results);
    });
});

// Add a new course
router.post('/', (req, res) => {
    const { course_id, course_name, course_credits, course_teacher } = req.body; // Updated field name
     
    // Check if any required fields are missing
    if (!course_id || !course_name || course_credits === undefined || course_teacher === undefined) {
        return res.status(400).send({ error: 'All fields are required' });
    }

    connection.query(
        'INSERT INTO courses (course_id, course_name, course_credits, course_teacher) VALUES (?, ?, ?, ?)', 
        [course_id, course_name, course_credits, course_teacher], 
        (error, results) => {
            if (error) {
                return res.status(500).send({ error: `Database insertion error: ${error.message}` });
            }
            res.status(201).send(`Course added with ID: ${results.insertId}`);
        }
    );
});

// Update a course
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { course_name, course_credits, course_teacher } = req.body; // Updated field name

    // Ensure the ID and required fields are provided
    if (!course_name || course_credits === undefined || course_teacher === undefined) {
        return res.status(400).send({ error: 'All fields are required for update' });
    }

    connection.query(
        'UPDATE courses SET course_name = ?, course_credits = ?, course_teacher = ? WHERE course_id = ?', 
        [course_name, course_credits, course_teacher, id], 
        (error, results) => {
            if (error) return res.status(500).send({ error: `Database update error: ${error.message}` });
            if (results.affectedRows === 0) return res.status(404).send({ error: 'Course not found' });
            res.status(200).send(`Course updated with ID: ${id}`);
        }
    );
});

// Delete a course
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM courses WHERE course_id = ?', [id], (error, results) => {
        if (error) return res.status(500).send({ error: `Database deletion error: ${error.message}` });
        if (results.affectedRows === 0) return res.status(404).send({ error: 'Course not found' });
        res.status(200).send(`Course deleted with ID: ${id}`);
    });
});

module.exports = router;

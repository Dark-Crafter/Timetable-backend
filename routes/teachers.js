// routes/teachers.js
const express = require('express');
const router = express.Router();
const connection = require('../db/connection');

// ======= Get all teachers =======
router.get('/', (req, res) => {
    connection.query('SELECT * FROM teachers', (error, results) => {
        if (error) {
            console.error('Error retrieving teachers:', error);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.status(200).json(results);
    });
});

// ======= Add a new teacher =======
router.post('/', (req, res) => {
    const { teacher_name, designation } = req.body; // Ensure these field names match your database

    // Log the incoming request for debugging
    console.log('Adding teacher:', req.body);

    connection.query('INSERT INTO teachers (teacher_name, designation) VALUES (?, ?)', [teacher_name, designation], (error, results) => {
        if (error) {
            console.error('Error inserting teacher:', error);
            return res.status(500).json({ error: `Database insertion error: ${error.message}` });
        }
        res.status(201).json({ message: 'Teacher added successfully', teacherId: results.insertId });
    });
});

// ======= Update a teacher =======
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { teacher_name, designation } = req.body;

    connection.query('UPDATE teachers SET teacher_name = ?, designation = ? WHERE teacher_id = ?', [teacher_name, designation, id], (error, results) => {
        if (error) {
            console.error('Error updating teacher:', error);
            return res.status(500).json({ error: 'Database update error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: `No teacher found with ID: ${id}` });
        }
        res.status(200).json({ message: `Teacher updated successfully with ID: ${id}` });
    });
});

// ======= Delete a teacher =======
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    // Step 1: Delete related courses first
    const deleteCoursesQuery = 'DELETE FROM courses WHERE course_teacher = ?';
    connection.query(deleteCoursesQuery, [id], (error) => {
        if (error) {
            console.error('Error deleting related courses:', error);
            return res.status(500).json({ error: 'Error deleting related courses' });
        }

        // Step 2: Now delete the teacher
        connection.query('DELETE FROM teachers WHERE teacher_id = ?', [id], (error, results) => {
            if (error) {
                console.error('Error deleting teacher:', error);
                return res.status(500).json({ error: 'Database deletion error' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: `No teacher found with ID: ${id}` });
            }
            res.status(200).json({ message: `Teacher deleted successfully with ID: ${id}` });
        });
    });
});

module.exports = router;

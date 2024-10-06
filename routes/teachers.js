const express = require('express');
const router = express.Router();
const connection = require('../db/connection');

// ===== Get all teachers =====
router.get('/', (req, res) => {
    connection.query('SELECT * FROM teachers', (error, results) => {
        if (error) return res.status(500).send({ error: 'Database query error: ' + error.message });
        res.status(200).json(results);
    });
});

// ===== Add a new teacher =====
router.post('/', (req, res) => {
    const { teacher_name, designation } = req.body;  // Ensure these field names match your database

    // Log the incoming request for debugging
    console.log('Adding teacher:', req.body);

    connection.query('INSERT INTO teachers (teacher_name, designation) VALUES (?, ?)', [teacher_name, designation], (error, results) => {
        if (error) {
            return res.status(500).send({ error: 'Database insertion error: ' + error.message });
        }
        res.status(201).send({ message: `Teacher added with ID: ${results.insertId}` });
    });
});

// ===== Update a teacher =====
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { teacher_name, designation } = req.body;

    connection.query('UPDATE teachers SET teacher_name = ?, designation = ? WHERE teacher_id = ?', [teacher_name, designation, id], (error, results) => {
        if (error) return res.status(500).send({ error: 'Database update error: ' + error.message });
        res.status(200).send({ message: `Teacher updated with ID: ${id}` });
    });
});

// ===== Delete a teacher =====
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    connection.query('DELETE FROM teachers WHERE teacher_id = ?', [id], (error, results) => {
        if (error) return res.status(500).send({ error: 'Database deletion error: ' + error.message });
        res.status(200).send({ message: `Teacher deleted with ID: ${id}` });
    });
});

module.exports = router;

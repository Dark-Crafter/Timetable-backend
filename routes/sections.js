const express = require('express');
const router = express.Router();
const connection = require('../db/connection');

// Get all sections
router.get('/', (req, res) => {
    connection.query('SELECT * FROM sections', (error, results) => {
        if (error) return res.status(500).send(error);
        res.status(200).json(results);
    });
});

// Add a new section
router.post('/', (req, res) => {
    const { section_id, department_id, courses_per_week } = req.body; // Ensure this matches your DB schema
    connection.query('INSERT INTO sections (section_id, department_id, courses_per_week) VALUES (?, ?, ?)', [section_id, department_id, courses_per_week], (error, results) => {
        if (error) {
            return res.status(500).send({ error: `Database insertion error: ${error.message}` });
        }
        res.status(201).send(`Section added with ID: ${results.insertId}`);
    });
});

// Update a section
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { department_id, courses_per_week } = req.body;
    connection.query('UPDATE sections SET department_id = ?, courses_per_week = ? WHERE section_id = ?', [department_id, courses_per_week, id], (error, results) => {
        if (error) return res.status(500).send(error);
        res.status(200).send(`Section updated with ID: ${id}`);
    });
});

// Delete a section
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM sections WHERE section_id = ?', [id], (error, results) => {
        if (error) return res.status(500).send(error);
        res.status(200).send(`Section deleted with ID: ${id}`);
    });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const connection = require('../db/connection');

// ===== Get all timings =====
router.get('/', (req, res) => {
    connection.query('SELECT * FROM timings', (error, results) => {
        if (error) return res.status(500).send({ error: 'Database query error: ' + error.message });
        res.status(200).json(results);
    });
});

// ===== Add a new timing =====
router.post('/', (req, res) => {
    const { timing, day } = req.body; // Match field names with your DB schema

    // Log the incoming request for debugging
    console.log('Adding timing:', req.body);

    const query = 'INSERT INTO timings (timing, day) VALUES (?, ?)';
    connection.query(query, [timing, day], (error, results) => {
        if (error) {
            return res.status(500).send({ error: 'Database insertion error: ' + error.message });
        }
        res.status(201).send({ message: `Timing added with ID: ${results.insertId}` });
    });
});

// ===== Update a timing =====
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { timing, day } = req.body; // Match field names with your DB schema

    const query = 'UPDATE timings SET timing = ?, day = ? WHERE meeting_id = ?';
    connection.query(query, [timing, day, id], (error, results) => {
        if (error) return res.status(500).send({ error: 'Database update error: ' + error.message });
        if (results.affectedRows === 0) {
            return res.status(404).send({ message: `No timing found with ID: ${id}` });
        }
        res.status(200).send({ message: `Timing updated with ID: ${id}` });
    });
});

// ===== Delete a timing =====
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM timings WHERE meeting_id = ?';
    connection.query(query, [id], (error, results) => {
        if (error) return res.status(500).send({ error: 'Database deletion error: ' + error.message });
        if (results.affectedRows === 0) {
            return res.status(404).send({ message: `No timing found with ID: ${id}` });
        }
        res.status(200).send({ message: `Timing deleted with ID: ${id}` });
    });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const connection = require('../db/connection');

// Get all timings
router.get('/', (req, res) => {
    connection.query('SELECT * FROM timings', (error, results) => {
        if (error) return res.status(500).send(error);
        res.status(200).json(results);
    });
});

// Add a new timing
router.post('/', (req, res) => {
    const { timing_id, timing_slot } = req.body; // Adjust field names as necessary
    connection.query('INSERT INTO timings (timing_id, timing_slot) VALUES (?, ?)', [timing_id, timing_slot], (error, results) => {
        if (error) return res.status(500).send(`Database insertion error: ${error.message}`);
        res.status(201).send(`Timing added with ID: ${results.insertId}`);
    });
});

// Update a timing
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { timing_slot } = req.body; // Adjust field name
    connection.query('UPDATE timings SET timing_slot = ? WHERE timing_id = ?', [timing_slot, id], (error, results) => {
        if (error) return res.status(500).send(error);
        res.status(200).send(`Timing updated with ID: ${id}`);
    });
});

// Delete a timing
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM timings WHERE timing_id = ?', [id], (error, results) => {
        if (error) return res.status(500).send(error);
        res.status(200).send(`Timing deleted with ID: ${id}`);
    });
});

module.exports = router;
 

const express = require('express');
const router = express.Router();
const connection = require('../db/connection');

// Get all rooms
router.get('/', (req, res) => {
    connection.query('SELECT * FROM rooms', (error, results) => {
        if (error) return res.status(500).send(error);
        res.status(200).json(results);
    });
});

// Add a new room
router.post('/', (req, res) => {
    const { room_id, room_type } = req.body; // Ensure this matches your DB schema
    connection.query('INSERT INTO rooms (room_id, room_type) VALUES (?, ?)', [room_id, room_type], (error, results) => {
        if (error) {
            return res.status(500).send({ error: `Database insertion error: ${error.message}` });
        }
        res.status(201).send(`Room added with ID: ${results.insertId}`);
    });
});

// Update a room
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { room_type } = req.body;
    connection.query('UPDATE rooms SET room_type = ? WHERE room_id = ?', [room_type, id], (error, results) => {
        if (error) return res.status(500).send(error);
        res.status(200).send(`Room updated with ID: ${id}`);
    });
});

// Delete a room
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM rooms WHERE room_id = ?', [id], (error, results) => {
        if (error) return res.status(500).send(error);
        res.status(200).send(`Room deleted with ID: ${id}`);
    });
});

module.exports = router;

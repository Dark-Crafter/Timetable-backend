const express = require('express');
const router = express.Router();
const connection = require('../db/connection');

// Define valid room types
const validRoomTypes = ['Lab', 'Theory']; // Adjust based on your schema

// Get all rooms
router.get('/', (req, res) => {
    connection.query('SELECT * FROM rooms', (error, results) => {
        if (error) return res.status(500).send({ error: `Database query error: ${error.message}` });
        res.status(200).json(results);
    });
});

// Add a new room
router.post('/', (req, res) => {
    const { room_id, room_type } = req.body;

    // Validate room_type
    if (!validRoomTypes.includes(room_type)) {
        return res.status(400).send({ error: `Invalid room type. Valid types are: ${validRoomTypes.join(', ')}` });
    }

    connection.query('INSERT INTO rooms (room_id, room_type) VALUES (?, ?)', [room_id, room_type], (error, results) => {
        if (error) {
            return res.status(500).send({ error: `Database insertion error: ${error.message}` });
        }
        res.status(201).send(`Room added with ID: ${room_id}`);
    });
});

// Update a room
router.put('/:id', (req, res) => {
    const { id } = req.params;  // ID from the URL (room_id)
    const { room_type } = req.body; // Updated data

    // Validate room_type
    if (room_type && !validRoomTypes.includes(room_type)) {
        return res.status(400).send({ error: `Invalid room type. Valid types are: ${validRoomTypes.join(', ')}` });
    }

    // Check if room exists
    connection.query('SELECT * FROM rooms WHERE room_id = ?', [id], (error, results) => {
        if (error) return res.status(500).send({ error: `Database query error: ${error.message}` });
        if (results.length === 0) {
            return res.status(404).send({ error: `Room with ID: ${id} not found` });
        }

        // Perform the update
        connection.query('UPDATE rooms SET room_type = ? WHERE room_id = ?', [room_type, id], (updateError) => {
            if (updateError) return res.status(500).send({ error: `Database update error: ${updateError.message}` });
            res.status(200).send({ message: `Room updated with ID: ${id}` });
        });
    });
});

// Delete a room
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    // Check if the room is referenced in the timetable
    connection.query('SELECT * FROM timetable WHERE room_id = ?', [id], (checkError, checkResults) => {
        if (checkError) return res.status(500).send({ error: `Database query error: ${checkError.message}` });

        if (checkResults.length > 0) {
            // Delete entries in timetable referencing this room
            connection.query('DELETE FROM timetable WHERE room_id = ?', [id], (deleteTimetableError) => {
                if (deleteTimetableError) return res.status(500).send({ error: `Error deleting timetable entries: ${deleteTimetableError.message}` });

                // Now delete the room
                connection.query('DELETE FROM rooms WHERE room_id = ?', [id], (deleteError) => {
                    if (deleteError) return res.status(500).send({ error: `Database deletion error: ${deleteError.message}` });
                    res.status(200).send({ message: `Room and its references deleted successfully with ID: ${id}` });
                });
            });
        } else {
            // If not referenced, proceed to delete the room
            connection.query('DELETE FROM rooms WHERE room_id = ?', [id], (deleteError) => {
                if (deleteError) return res.status(500).send({ error: `Database deletion error: ${deleteError.message}` });
                res.status(200).send({ message: `Room deleted with ID: ${id}` });
            });
        }
    });
});
module.exports = router;

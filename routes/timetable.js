const express = require('express');
const router = express.Router();
const connection = require('../db/connection'); // Ensure this path is correct

// Function to check for conflicts
const checkConflict = (course_id, room_id, meeting_id, callback) => {
    const query = `
        SELECT * FROM timetable 
        WHERE room_id = ? AND meeting_id = ? AND course_id != ?`;

    connection.query(query, [room_id, meeting_id, course_id], (err, results) => {
        if (err) return callback(err);
        callback(null, results.length > 0);
    });
};

// ===== Teachers Routes =====
router.get('/teachers', (req, res) => {
    connection.query('SELECT * FROM teachers', (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.status(200).json(results);
    });
});

// POST a new teacher
router.post('/teachers', (req, res) => {
    const { teacher_name, designation } = req.body;
    const query = 'INSERT INTO teachers (teacher_name, designation) VALUES (?, ?)';
    connection.query(query, [teacher_name, designation], (err) => {
        if (err) {
            console.error('Database insertion error:', err);
            return res.status(500).json({ error: 'Database insertion error' });
        }
        res.status(201).json({ message: 'Teacher added successfully' });
    });
});

// PUT (update) a teacher
router.put('/teachers/:id', (req, res) => {
    const { id } = req.params;
    const { teacher_name, designation } = req.body;
    const query = 'UPDATE teachers SET teacher_name = ?, designation = ? WHERE teacher_id = ?';
    connection.query(query, [teacher_name, designation, id], (err) => {
        if (err) {
            console.error('Database update error:', err);
            return res.status(500).json({ error: 'Database update error' });
        }
        res.status(200).json({ message: `Teacher updated successfully with ID: ${id}` });
    });
});

// DELETE a teacher
router.delete('/teachers/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM teachers WHERE teacher_id = ?';
    connection.query(query, [id], (err) => {
        if (err) {
            console.error('Database deletion error:', err);
            return res.status(500).json({ error: 'Database deletion error' });
        }
        res.status(200).json({ message: `Teacher deleted successfully with ID: ${id}` });
    });
});

// ===== Rooms Routes =====
router.get('/rooms', (req, res) => {
    connection.query('SELECT * FROM rooms', (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.status(200).json(results);
    });
});

// POST a new room
router.post('/rooms', (req, res) => {
    const { room_id, room_type } = req.body;
    const query = 'INSERT INTO rooms (room_id, room_type) VALUES (?, ?)';
    connection.query(query, [room_id, room_type], (err) => {
        if (err) {
            console.error('Database insertion error:', err);
            return res.status(500).json({ error: 'Database insertion error' });
        }
        res.status(201).json({ message: 'Room added successfully' });
    });
});

// PUT (update) a room
router.put('/rooms/:id', (req, res) => {
    const { id } = req.params;
    const { room_id, room_type } = req.body;
    const query = 'UPDATE rooms SET room_id = ?, room_type = ? WHERE room_id = ?';
    connection.query(query, [room_id, room_type, id], (err) => {
        if (err) {
            console.error('Database update error:', err);
            return res.status(500).json({ error: 'Database update error' });
        }
        res.status(200).json({ message: `Room updated successfully with ID: ${id}` });
    });
});

// DELETE a room
router.delete('/rooms/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM rooms WHERE room_id = ?';
    connection.query(query, [id], (err) => {
        if (err) {
            console.error('Database deletion error:', err);
            return res.status(500).json({ error: 'Database deletion error' });
        }
        res.status(200).json({ message: `Room deleted successfully with ID: ${id}` });
    });
});

// ===== Courses Routes =====
router.get('/courses', (req, res) => {
    connection.query('SELECT * FROM courses', (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.status(200).json(results);
    });
});

// POST a new course
router.post('/courses', (req, res) => {
    const { course_id, course_name, course_credits } = req.body;
    const query = 'INSERT INTO courses (course_id, course_name, course_credits) VALUES (?, ?, ?)';
    connection.query(query, [course_id, course_name, course_credits], (err) => {
        if (err) {
            console.error('Database insertion error:', err);
            return res.status(500).json({ error: 'Database insertion error' });
        }
        res.status(201).json({ message: 'Course added successfully' });
    });
});

// PUT (update) a course
router.put('/courses/:id', (req, res) => {
    const { id } = req.params;
    const { course_id, course_name, course_credits } = req.body;
    const query = 'UPDATE courses SET course_id = ?, course_name = ?, course_credits = ? WHERE course_id = ?';
    connection.query(query, [course_id, course_name, course_credits, id], (err) => {
        if (err) {
            console.error('Database update error:', err);
            return res.status(500).json({ error: 'Database update error' });
        }
        res.status(200).json({ message: `Course updated successfully with ID: ${id}` });
    });
});

// DELETE a course
router.delete('/courses/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM courses WHERE course_id = ?';
    connection.query(query, [id], (err) => {
        if (err) {
            console.error('Database deletion error:', err);
            return res.status(500).json({ error: 'Database deletion error' });
        }
        res.status(200).json({ message: `Course deleted successfully with ID: ${id}` });
    });
});

// ===== Timetable Entries =====
// Get all timetable entries
router.get('/entries', (req, res) => {
    const query = 'SELECT * FROM timetable'; // Use the correct table name

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.status(200).json(results);
    });
});

// POST entry
router.post('/entries', (req, res) => {
    console.log('Received POST request with body:', req.body); // Log request body
    const { course_id, teacher_id, room_id, meeting_id } = req.body;

    if (!course_id || !teacher_id || !room_id || !meeting_id) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    checkConflict(course_id, room_id, meeting_id, (err, conflictExists) => {
        if (err) {
            console.error('Database conflict check error:', err);
            return res.status(500).json({ error: 'Database conflict check error' });
        }

        if (conflictExists) {
            return res.status(400).json({ error: 'Conflict exists: this room is already booked for this time' });
        }

        const query = 'INSERT INTO timetable (course_id, teacher_id, room_id, meeting_id) VALUES (?, ?, ?, ?)';
        connection.query(query, [course_id, teacher_id, room_id, meeting_id], (err) => {
            if (err) {
                console.error('Database insertion error:', err);
                return res.status(500).json({ error: 'Database insertion error' });
            }
            res.status(201).json({ message: 'Timetable entry created successfully' });
        });
    });
});

// PUT (update) an entry
router.put('/entries/:id', (req, res) => {
    const { id } = req.params; // Get the timetable ID from the URL
    console.log('Received PUT request for ID:', id, 'with body:', req.body); // Log request details
    const { course_id, teacher_id, room_id, meeting_id } = req.body;

    if (!course_id || !teacher_id || !room_id || !meeting_id) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    checkConflict(course_id, room_id, meeting_id, (err, conflictExists) => {
        if (err) {
            console.error('Database conflict check error:', err);
            return res.status(500).json({ error: 'Database conflict check error' });
        }

        if (conflictExists) {
            return res.status(400).json({ error: 'Conflict exists: this room is already booked for this time' });
        }

        const query = 'UPDATE timetable SET course_id = ?, teacher_id = ?, room_id = ?, meeting_id = ? WHERE timetable_id = ?';
        connection.query(query, [course_id, teacher_id, room_id, meeting_id, id], (err) => {
            if (err) {
                console.error('Database update error:', err);
                return res.status(500).json({ error: 'Database update error' });
            }
            res.status(200).json({ message: `Timetable entry updated successfully with ID: ${id}` });
        });
    });
});

// Delete a timetable entry
router.delete('/entries/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM timetable WHERE timetable_id = ?';
    connection.query(query, [id], (err) => {
        if (err) {
            console.error('Database deletion error:', err);
            return res.status(500).json({ error: 'Database deletion error' });
        }
        res.status(200).json({ message: `Timetable entry deleted successfully with ID: ${id}` });
    });
});

module.exports = router;

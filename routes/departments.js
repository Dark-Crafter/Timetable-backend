const express = require('express');
const router = express.Router();
const connection = require('../db/connection');

// Get all departments
router.get('/', (req, res) => {
    connection.query('SELECT * FROM departments', (error, results) => {
        if (error) return res.status(500).send({ error: 'Database query error: ' + error.message });
        res.status(200).json(results);
    });
});

// Add a new department
router.post('/', (req, res) => {
    const { department_name } = req.body; // Only include department_name as department_id is auto-increment
    connection.query('INSERT INTO departments (department_name) VALUES (?)', [department_name], (error, results) => {
        if (error) {
            return res.status(500).send({ error: `Database insertion error: ${error.message}` });
        }
        res.status(201).send({ message: `Department added successfully with ID: ${results.insertId}` });
    });
});

// Update a department
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { department_name } = req.body;
    connection.query('UPDATE departments SET department_name = ? WHERE department_id = ?', [department_name, id], (error, results) => {
        if (error) return res.status(500).send({ error: 'Database update error: ' + error.message });
        if (results.affectedRows === 0) {
            return res.status(404).send({ message: `No department found with ID: ${id}` });
        }
        res.status(200).send({ message: `Department updated successfully with ID: ${id}` });
    });
});

// Delete a department
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM departments WHERE department_id = ?', [id], (error, results) => {
        if (error) return res.status(500).send({ error: 'Database deletion error: ' + error.message });
        if (results.affectedRows === 0) {
            return res.status(404).send({ message: `No department found with ID: ${id}` });
        }
        res.status(200).send({ message: `Department deleted successfully with ID: ${id}` });
    });
});

module.exports = router;

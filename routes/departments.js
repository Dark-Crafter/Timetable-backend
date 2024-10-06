const express = require('express');
const router = express.Router();
const connection = require('../db/connection');

// Get all departments
router.get('/', (req, res) => {
    connection.query('SELECT * FROM departments', (error, results) => {
        if (error) return res.status(500).send(error);
        res.status(200).json(results);
    });
});

// Add a new department
router.post('/', (req, res) => {
    const { department_id, department_name } = req.body; // Ensure this matches your DB schema
    connection.query('INSERT INTO departments (department_id, department_name) VALUES (?, ?)', [department_id, department_name], (error, results) => {
        if (error) {
            return res.status(500).send({ error: `Database insertion error: ${error.message}` });
        }
        res.status(201).send(`Department added with ID: ${results.insertId}`);
    });
});

// Update a department
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { department_name } = req.body;
    connection.query('UPDATE departments SET department_name = ? WHERE department_id = ?', [department_name, id], (error, results) => {
        if (error) return res.status(500).send(error);
        res.status(200).send(`Department updated with ID: ${id}`);
    });
});

// Delete a department
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM departments WHERE department_id = ?', [id], (error, results) => {
        if (error) return res.status(500).send(error);
        res.status(200).send(`Department deleted with ID: ${id}`);
    });
});

module.exports = router;

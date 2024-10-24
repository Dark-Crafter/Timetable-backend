const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'hellofriend', 
    database: 'timetable_db' 
});

module.exports = connection;

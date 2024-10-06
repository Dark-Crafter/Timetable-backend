const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'PRAOABHAY_sql', 
    database: 'timetable_db' 
});

module.exports = connection;

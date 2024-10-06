const connection = require('./db/connection');

connection.query('SELECT 1 + 1 AS solution', (error, results) => {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
});

const { Client } = require('pg');

const pgClient = new Client({
    host: 'localhost',
    port: 5432,
    user: 'maks',
    password: '12345678',
    database: 'hwnode'
});

pgClient.connect(err => {
    if (err) {
        console.error('connect failed', err.stack, "error message", err.message);
    }
    console.log('connected to db');
});

module.exports = pgClient;

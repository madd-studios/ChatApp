const { Client } = require('pg');

/*
    This file needs a way to configure the database connection
    and possibly define functions that can be used as routing handlers
    for different types of resources like html, css, js files, and more 
*/


// DB CONFIG

let db_config = {
    host: 'localhost',
    port: 5432,
    database: 'chatapp',
    user: 'postgres',
    password: 'Database!1234'
}

const db_client = new Client(db_config);

db_client.connect((err) => {
    if(err) {
        console.error('connection error', err.stack);
    }
    else {
        console.log('connected');
    }
});

exports.db_client = db_client;
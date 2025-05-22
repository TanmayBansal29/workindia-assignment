const mysql = require("mysql2")
require("dotenv").config()

// Using the createConnection method to create a connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// Connecting to the connection and logging appropriate responses
connection.connect((err) => {
    if(err) {
        console.log("Database Connection failed: ", err)
        return
    }
    console.log("Database Connection Established")
})

module.exports = connection
// const mysql = require('mysql');
// const express = require("express");


// const con =mysql.createConnection({
//     host:"localhost",
//     user:"root",
//     password:"1234",
//     database:"college"
// });

// console.log("Database connected Successfully");
// module.exports = con;

const mysql = require('mysql');
const express = require("express");

const con = mysql.createConnection({
    host: "a2nlmysql3plsk.secureserver.net",
    port: "3306",
    user: "mysqld",
    password: "Egn37l53$",
    database: "milkappdb"
});

con.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Database connected successfully');
});

module.exports = con;

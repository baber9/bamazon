// use inquirer
var inquirer = require('inquirer');

// use mysql
var mysql = require('mysql');

// create connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "",                         // REMOVE PASSWORD BEFORE GIT
    database: "bamazon"
  });

  
  connection.connect(function(err) {
    if (err) {console.log('Error: ' + err);}
    // doStuff();
  });
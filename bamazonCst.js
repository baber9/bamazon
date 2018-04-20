var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "",           // REMOVE PASSWORD BEFORE GIT
    database: ""
  });

  
  
  connection.connect(function(err) {
    if (err) {console.log('Error: ' + err);}
    // doStuff();
  });


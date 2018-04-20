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

// connect and call main function
connection.connect(function(err) {
  if (err) {console.log('Error: ' + err);}
  bamazonCst();
});

// FUNCTION - main bamazon for customers
function bamazonCst () {
  
  // call display Welcome Message
  displayWelcomeMsg();

  // Show all products
  connection.query("SELECT item_id, product_name, price FROM products", (err, res) => {
    if(err){console.log(err);}
    
    // display id, product name, price
    for (var i = 0; i < res.length; i++) {
      console.log(`ID: ${res[i].item_id}\t- ${res[i].product_name} > $${res[i].price}`);
    }
    console.log('');
    
    // ask user which item and qty they would like to purchase
    inquirer.prompt([
      {
        name: 'itemID',
        message: 'Please enter the ID number of the item you would like to purchase?',
        type: 'input',
      },
      {
        name: 'qty',
        message: 'How many would you like to purchase?',
        type: 'input'
      }
    ]).then((resp) => {
      // check inventory to make sure order can be fulfilled
        // if not enough inventory, log 'Insufficient quantity!'
        // else process by updating database table, show customer total cost
    });
  });



  connection.end();
}

function displayWelcomeMsg () {
  var welcomeMsg = '';
  welcomeMsg += '\n************************************\n';
  welcomeMsg += 'Welcome to Bamazon!\n';
  welcomeMsg += 'Checkout our amazing products below.\n'
  welcomeMsg += '************************************\n';
  console.log(welcomeMsg);
}
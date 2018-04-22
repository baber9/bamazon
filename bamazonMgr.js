// use inquirer
var inquirer = require('inquirer');

// use mysql
var mysql = require('mysql');

// use easy-table
var Table = require('easy-table');

// create connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "root",                         // REMOVE PASSWORD BEFORE GIT
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

  inquirer.prompt([
    {
      type: 'list',
      name: 'view',
      message: "Please choose from the menu items below...",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ]
    }
  ]).then((resp) => {

    // Switch statement based on resp
    switch(resp.view) {
      case "View Products for Sale":
        displayAllProducts();
        break;
      case "View Low Inventory":
        displayLowInventory();
        break;
      case "Add to Inventory":
        addToInventory();
        break;
      case "Add New Product":
        addNewProduct();
        break;
    }
  });
}

// FUNCTION to display welcome message
function displayWelcomeMsg () {
  var welcomeMsg = '';
  welcomeMsg += '\n****************************\n';
  welcomeMsg += 'Welcome to Bamazon Manager!\n';
  welcomeMsg += '****************************\n';
  console.log(welcomeMsg);
}

function displayAllProducts () {
  // get all products and columns
  connection.query("SELECT * FROM products", (err, res) => {
    if(err){console.log(err);}
    // call printResults
    printResults(res);
  });
}

function displayLowInventory() {
  // SQL query
  connection.query("SELECT * FROM products WHERE stock_quantity < ?", [5], (err, res) => {
    if (err) {console.log(err);}
    // call printResults
    printResults(res);
  });
} 

function addToInventory() {
  // prompt user using inquirer
  inquirer.prompt([
    {
      type: 'input',
      name: 'itemID',
      message: 'Enter Item ID:'
    },
    {
      type: 'input',
      name: 'qty',
      message: 'How much would you like to add?'
    }
  ]).then((resp) => {
    // update product based on resp
    connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE ?", [resp.qty, {item_id: resp.itemID}], (err, res) => {
      if(err) {console.log(err);}
      // log message with update

      console.log(`\nYou have added a quantity of ${resp.qty} to Item ${resp.itemID}.`);
    });
    connection.end();
  });
}

function addNewProduct() {
  // prompt user using inquirer
  inquirer.prompt([
    {
      type: 'input',
      name: 'prodName',
      message: 'Enter the name of the product:'
    },
    {
      type: 'list',
      name: 'dept',
      message: 'Choose from the departments below:',
      choices: [
        "Pets",
        "Computers",
        "Household",
        "Electronics",
        "Personal Care",
        "Lawn and Garden"
      ]
    },
    {
      type: 'input',
      name: 'price',
      message: 'What is the price of this item?'
    },
    {
      type: 'input',
      name: 'qty',
      message: 'What is the initial quantity?'
    }
  ]).then((resp) => {
    // update product based on resp
    connection.query("INSERT into products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", [resp.prodName, resp.dept, resp.price, resp.qty],(err, res) => {
      if(err) {console.log(err);}
      
      // new instance of Tabe (easy-table)
      var t = new Table();
      // log message with update
      console.log(`\nThe following product has been added...`);
      t.cell('Product', resp.prodName);
      t.cell('Price', resp.price);
      t.cell('Department', resp.dept);
      t.cell('Stock', resp.qty);
      t.newRow();
      // print table
      console.log("\n" + t.toString());
    });
    // disconnect
    connection.end();
  });
}

function printResults (dbResults) {
  // create new instance of Table (using easy-table)
  var t = new Table;
  for(i = 0; i < dbResults.length; i++) {
    t.cell('Item ID', dbResults[i].item_id);
    t.cell('Product', dbResults[i].product_name);
    t.cell('Price', dbResults[i].price);
    t.cell('Department', dbResults[i].department_name);
    t.cell('Quantity in Stock', dbResults[i].stock_quantity);
    t.newRow();
  }
  // print table
  console.log('\n' + t.toString());
  // disconnect
  connection.end();
}
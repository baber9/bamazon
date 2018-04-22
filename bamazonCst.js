// use inquirer
var inquirer = require('inquirer');

// use mysql
var mysql = require('mysql');

// use easy-table
var Table = require('easy-table');

// create connection
var connection = mysql.createConnection({
    multipleStatements: true,
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
  connection.query("SELECT * FROM products", (err, res) => {
    if(err){console.log(err);}
    
    // new instance of Table (for easy-table display)
    var t = new Table;
    // display id, product name, price, and stock
    for (var i = 0; i < res.length; i++) {
      t.cell('Item ID', res[i].item_id);
      t.cell('Product', res[i].product_name);
      t.cell('Price', res[i].price);
      t.cell('Qty Available', res[i].stock_quantity);
      t.newRow();
    }
    console.log('\n' + t.toString());
    
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
        // check if quantity is available (db qty >= request qty)
        if (res[resp.itemID].stock_quantity >= resp.qty) {
          // calculate total cost
          var totalCost = (res[resp.itemID].price * resp.qty).toFixed(2);
          // call purchaseProduct to decrease qty of item in db
          purchaseProduct(resp.itemID, resp.qty, totalCost);
          // log purchase
          console.log(`\nCongrats!  You have purchased ${resp.qty} ${res[resp.itemID].product_name} for a total cost of $${totalCost}.`)
        } else {
          // if not enough 'in stock' tell user of insufficient qty
          console.log(`We do not have enough stock to fill your order. Our current inventory quantity of this item is ${res[resp.itemID].stock_quantity}.  Please choose less of this item.`)
        }
        connection.end();
      });
  });
}

// FUNCTION to display welcome message
function displayWelcomeMsg () {
  var welcomeMsg = '';
  welcomeMsg += '\n************************************\n';
  welcomeMsg += 'Welcome to Bamazon!\n';
  welcomeMsg += 'Checkout our amazing products below.\n'
  welcomeMsg += '************************************\n';
  console.log(welcomeMsg);
}

// FUNCTION to update database when purchase is made
function purchaseProduct(product, qty, totalCost) {
  connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?; UPDATE products SET product_sales = product_sales + ? WHERE item_id = ?", [qty, product, totalCost, product], (err, res) => {
    if (err) {
      console.log(err);
    }
  });
}
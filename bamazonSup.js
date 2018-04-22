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
    password: "",                         // REMOVE PASSWORD BEFORE GIT
    database: "bamazon"
  });

  
  connection.connect(function(err) {
    if (err) {console.log('Error: ' + err);}
    bamazonSup();
  });

  // FUNCTION - main bamazon for managers
function bamazonSup () {
  
  // call display Welcome Message
  displayWelcomeMsg();

  inquirer.prompt([
    {
      type: 'list',
      name: 'view',
      message: "Please choose from the menu items below...",
      choices: [
        "View Product Sales by Department",
        "Create New Department",
      ]
    }
  ]).then((resp) => {

    // Switch statement based on resp
    switch(resp.view) {
      case "View Product Sales by Department":
        viewProductsSalesByDept();
        break;
      case "Create New Department":
        createNewDept();
        break;
    }
  });
}

// FUNCTION to display welcome message
function displayWelcomeMsg () {
  var welcomeMsg = '';
  welcomeMsg += '\n******************************\n';
  welcomeMsg += 'Welcome to Bamazon Supervisor!\n';
  welcomeMsg += '******************************\n';
  console.log(welcomeMsg);
}

// FUNCTION to view prod sales by dept
function viewProductsSalesByDept() {
  connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales FROM departments RIGHT JOIN products ON products.department_name = departments.department_name GROUP BY department_name", (err, res) => {
    if(err) {console.log(err);}
    var t = new Table();
    // display id, product name, price, and stock
    for (var i = 0; i < res.length; i++) {
      t.cell('Dept ID', res[i].department_id);
      t.cell('Dept Name', res[i].department_name);
      t.cell('OH Costs', res[i].over_head_costs.toFixed(2));
      t.cell('Product Sales', res[i].product_sales.toFixed(2));
      t.cell('Total Profit', (res[i].product_sales - res[i].over_head_costs).toFixed(2));
      t.newRow();
    }
    console.log('\n' + t.toString());
  });
  connection.end();
}

function createNewDept() {
  inquirer.prompt([
    {
      name: 'deptName',
      type: 'input',
      message: 'Name of new department?'
    },
    {
      name: 'ohCost',
      type: 'input',
      message: 'What is the overhead cost for this department?'
    }
  ]).then((resp) => {
    // insert new product
    connection.query("INSERT into departments (department_name,over_head_costs) VALUES (?, ?)", [resp.deptName, resp.ohCost],(err, res) => {
      if(err) {console.log(err);}
      
      // new instance of Table (easy-table)
      var t = new Table();
      // log message with update
      console.log(`\nThe following department has been added...`);
      t.cell('Dept Name', resp.deptName);
      t.cell('OH Costs', resp.ohCost);
      t.newRow();
      // print table
      console.log("\n" + t.toString());
    });
    // disconnect
    connection.end();
  });
}
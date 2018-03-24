var mysql = require('mysql');
var inquirer = require('inquirer');
var table = require('console.table');
require('dotenv').load();

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) {
        console.error("connection error" + err.stack);
    }
    promptManager();
});

var mainMenu = {
    type: "list",
    name: "startMenu",
    message: "Select menu option",
    choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
};

function promptManager() {
    inquirer.prompt(mainMenu).then(answers => {
        if (answers.startMenu === 'View Products for Sale') {
            loadInventory();
        } else if (answers.startMenu === 'View Low Inventory') {
            lowInventory();
        } else if (answers.startMenu === 'Add to Inventory') {
            restock(products);
        } else if (answers.startMenu === 'Add New Product') {
            newProduct();
        }
    });
}

function loadInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
        promptManager();
    });
}

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity<=5", function(err, res) {
        if (err) throw err;
        console.table(res);
        promptManager();
    });
}

function restock(inventory) {
    console.table(inventory);
    inquirer.prompt([{
        type: "input",
        name: "choice",
        message: "What is the item ID you'd like to restock?",
        validate: function(value) {
            return !isNaN(value);
        }
    }]).then(function(value) {
        var idChosen = parseInt(value.choice);
        var product = checkInventory(idChosen, inventory);
        if (product) {
            promptQuantity(product);
        } else {
            console.log("\nThat item ID doesn't exist");
            promptManager();
        }
    });
}

function promptQuantity(product) {
    inquirer
        .prompt([{
            type: "input",
            name: "quantity",
            message: "How many would you like to add?",
            validate: function(value) {
                return value > 0;
            }
        }]).then(function(value) {
            var quantity = parseInt(value.quantity);
            addQuantity(product, quantity);
        });
}

function addQuantity(product, quantity) {
    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [product.stock_quantity + quantity, product.item_id],
        function(err, res) {
            console.log("\nSuccessfully restocked" + product.item_id + "\nNew Stock Quantity: " + product.stock_quantity);
            promptManager();
        });
}
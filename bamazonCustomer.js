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
    loadInventory();
});

function loadInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
        promptCustomer(res);
        var inventory = res;
    });
}

function checkInventory(idChosen, inventory) {
    for (var i = 0; i <= inventory.length; i++) {
        if (idChosen === inventory[i].item_id) {
            return inventory[i];
        }
    }
    return null;
}

function promptCustomer(inventory) {
    inquirer
        .prompt([{
            type: "input",
            name: "choice",
            message: "\nWhat is the ID of the item you would like to purchase?\n",
            validate: function(value) {
                return !isNaN(value);
            }
        }])
        .then(function(value) {
            var idChosen = parseInt(value.choice);
            var product = checkInventory(idChosen, inventory);

            if (product) {
                promptQuantity(product);
            } else {
                console.log("\nNot a valid item number\n");
                loadInventory();
            }
        });

}

function promptQuantity(product) {
    inquirer
        .prompt([{
            type: "input",
            name: "quantity",
            message: "How many would you like?",
            validate: function(value) {
                return value > 0;
            }

        }]).then(function(value) {
            var quantity = parseInt(value.quantity);
            if (quantity > product.stock_quantity) {
                console.log("\nInsufficient quantity!");
                promptCustomer();
            } else {
                purchase(product, quantity);
            }
        });
}

function purchase(product, quantity) {
    connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?", [quantity, product.item_id],
        function(err, res) {
            totalPrice = (quantity * product.price);
            console.log("\nSuccessfully purchased for " + totalPrice + "!\n\n");
            loadInventory();
        });
}
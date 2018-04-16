var mysql = require("mysql");

var inquirer = require("inquirer");

var password = require("./password.js")

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: password,
	database: "webstore"
})

function displayItems() {
	connection.query("SELECT * FROM products", function (err, res) {
		if (err) throw err;
		console.log("\nBelow is a list of all products on sale:\n")
		for (i = 0; i < res.length; i++) {
			console.log("ID number: " + res[i].item_id + 
						" | Product Name: " + res[i].product_name +
						" | Price: $" + res[i].price + 
						" | Quantity in Stock: " + res[i].stock_quantity +
						"\n---------------");
		}
		// connection.end();
		start();
	})
}

function viewLowInventory() {
	console.log("The following products have an inventory count lower than 5:\n");
	connection.query("SELECT * FROM products", function (err, res) {
		if (err) throw err;
		for (i = 0; i < res.length; i++) {
			if (res[i].stock_quantity < 5) {
				console.log("'" + res[i].product_name + "' has a low stock inventory count of " + res[i].stock_quantity + ".")
				console.log("-------------------");
			}
		}
		start();
	});	
}

function addToInventory() {
	// console.log("add to inventory");
	inquirer.prompt([
		{
			message: "What is the ID number of the product you would like to update?",
			name: "productID",
			validate: function(input) {
				if (isNaN(input) === false) {
					return true;
				} else {
					return false;
				}
			}
		},
		{
			message: "How many more items of this product are you adding?",
			name: "quantityAdded",
			validate: function(input) {
				if (isNaN(input) === false) {
					return true;
				} else {
					return false;
				}
			}
		}
	]).then(function(answers) {
		connection.query("SELECT * FROM products WHERE item_id = ?", [answers.productID], function(err, res) {
			if (err) throw err;
			var stockQuantity = res[0].stock_quantity;
			var newStockQuantity = stockQuantity + parseInt(answers.quantityAdded);
			connection.query("UPDATE products SET ? WHERE ?",
				[
					{
						stock_quantity: newStockQuantity
					},
					{
						item_id: answers.productID
					}
				], function(err) {
					if (err) throw err;
					console.log("\nUpdate successful! The new quantity in stock for product " +
						answers.productID + " is " + newStockQuantity + ".\n");
					start();
				})
		})
	});
}

function addProduct() {
	inquirer.prompt([
		{
			message: "What is the name of the name of the new product?",
			name: "productName"
		},
		{
			message: "To which deparment does the new product belong?",
			name: "productDeparment"
		},
		{
			message: "What is the price of the new product?",
			name: "productPrice",
			validate: function(input) {
				if (isNaN(input) === false) {
					return true;
				} else {
					return false;
				}
			}
		},
		{
			message: "How many items of this new product will be in stock?",
			name: "stockQuantity",
			validate: function(input) {
				if (isNaN(input) === false) {
					return true;
				} else {
					return false;
				}
			}
		}
	]).then(function(answers) {
		connection.query("INSERT INTO products SET ?", 
		{
			product_name: answers.productName,
			department_name: answers.productDeparment,
			price: answers.productPrice,
			stock_quantity: answers.stockQuantity
		},
		function(err) {
			if (err) throw err;
			console.log("\nNew product successfully added!\n\n" +
				"Name: " + answers.productName +
				"\nDeparment: " + answers.productDeparment +
				"\nPrice: " + answers.productPrice +
				"\nQuantity in Stock: " + answers.stockQuantity +
				"\n--------------------------------\n");
			start();
		})

	})
}

function endSession() {
	console.log("Thanks for your time!");
	connection.end();
}

function start() {
	inquirer.prompt([
		{
			type: "list",
			message: "Hello, Webstore Manager! What would you like to do?",
			choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "End Session"],
			name: "options"
		}
	]).then(function(answer) {
		if (answer.options === "View Products for Sale") {
			displayItems();
		} else if (answer.options === "View Low Inventory") {
			viewLowInventory();
		} else if (answer.options === "Add to Inventory") {
			addToInventory();
		} else if (answer.options === "Add New Product") {
			addProduct();
		} else if (answer.options === "End Session") {
			endSession();
		}
	});
}

start();
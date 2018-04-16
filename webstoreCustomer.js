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
		console.log("\nWelcome to our webstore! Below are all of our available products.\n")
		for (i = 0; i < res.length; i++) {
			console.log("ID number: " + res[i].item_id + 
						" | Product Name: " + res[i].product_name +
						" | Price: $" + res[i].price + "\n---------------");
		}
		// connection.end();
		buyItem()
	})
}

function buyItem() {
	inquirer.prompt([
		{	
			message: "What is the ID of the product you would like to buy?",
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
			message: "How many units of this product would you like to buy?",
			name: "quantityRequested",
			validate: function(input) {
				if (isNaN(input) === false) {
					return true;
				} else {
					return false;
				}
			}
		}
	]).then(function(answer) {
		connection.query("SELECT * FROM products WHERE item_id = ?", [answer.productID], function(err, res) {
			if (err) {
				// console.error(err);
				console.log("Please make sure you entered a valid ID number.")
				displayItems();
			}
			//console.log("quantity in stock: " + res[0].stock_quantity);	
			var quantityInStock = res[0].stock_quantity;
			//console.log(answer.productID);
			var price = res[0].price;
			var quantityRequested = answer.quantityRequested;
			var name = res[0].product_name;

			if (answer.quantityRequested > quantityInStock) {
				console.log("Sorry, insufficient quantity in stock!");
				displayItems();
			} else {
				var newStockQuantity = quantityInStock - answer.quantityRequested;
				connection.query("UPDATE products SET ? WHERE ?",
				[
					{
						stock_quantity: newStockQuantity
					},
					{
						item_id: answer.productID
					}
				], function(err, res) {
					if (err) throw err;
					var total = price * quantityRequested;
					console.log("\nThank you for your purchase of " + name + "! Your total is $" + total + ".\n");
					inquirer.prompt([
							{
								message: "Would you like to continue shopping?",
								type: "confirm",
								name: "confirmation",
								default: "true"
							}
						]).then(function(answer) {
							if (answer.confirmation === true ) {
								displayItems();
							} else {
								console.log("Thanks for shopping with us!");
								connection.end();
							}
						})
				} )
			}
		});	
	});
}

displayItems()
var mysql = require("mysql");
var inquirer = require("inquirer");
var password = require("./password.js")

//establishes connection with MySQL database with mysql node module
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: password,
	database: "webstore_db"
})

//displays all items and information from webstore_db
function displayItems() {
	connection.query("SELECT * FROM products", function (err, res) {
		if (err) throw err;
		console.log("\nWelcome to our webstore! Below are all of our available products.\n")
		for (i = 0; i < res.length; i++) {
			console.log("ID number: " + res[i].item_id + 
						" | Product Name: " + res[i].product_name +
						" | Price: $" + res[i].price + "\n---------------");
		}
		buyItem()
	})
}

//allows customer to buy an item by prompting for the ID and quantity of the item
//he or she would like to purchase
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
		//based on the above prompt, the database is searched for that item ID
		connection.query("SELECT * FROM products WHERE item_id = ?", [answer.productID], function(err, res) {
			if (err) {
				// console.error(err);
				console.log("Please make sure you entered a valid ID number.")
				displayItems();
			}
			var quantityInStock = res[0].stock_quantity;
			var price = res[0].price;
			var quantityRequested = answer.quantityRequested;
			var name = res[0].product_name;

			//Checks if there is sufficient quantity in stock 
			if (answer.quantityRequested > quantityInStock) {
				console.log("\nSorry, insufficient quantity in stock!\n");
				inquireContinue();
			} else {
				//if there is sufficient quantity in stock, the name of the product and
				//total cost is displayed and the customer is prompted whether to continue
				//shopping
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
					console.log("\nThank you for your purchase of '" + name + "'! Your total is $" + total + ".\n");
					inquireContinue();
				} )
			}
		});	
	});
}

function inquireContinue() {
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
			console.log("\nThanks for shopping with us!");
			connection.end();
		}
	})
}

displayItems();
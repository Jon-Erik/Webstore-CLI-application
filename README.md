# Webstore-CLI-application
#### Webstore CLI application using JavaScript, Node.js, and MySQL

This repository is demo CLI application which requires a MySQL connection to create a database table which is accessed and updated by the mysql node module. A schema for creating the database is found in the `sql_schema.sql` file. Prompts in the command line appear using the inquirer node module to mimic an online retail store. Two separate demo files can be run for this repository: a sample customer file (`webstoreCustomer.js`) and a sample manager file (`webstoreManager.js`).

### `webstoreCustomer.js`

Running this JavaScript file in Node.js will welcome the customer to the store and list all available products, including their ID number, name, and price, and prompt the customer to enter the ID number of the product they would like to purchase, as well as the quantity of the product. If there is insufficient quantity in stock, the customer will be told this and prompted whether they would like to continue shopping. If there _is_ sufficient quantity in stock, the customer will be thanked for their purchase and the total cost of their purchase will be indicated. The customer will then be prompted whether to continue shopping.

### `webstoreManager.js`

Running this JavaScript file in Node.js will welcome the manager and indicate five options: `View Products for Sale`, `View Low Inventory`,`Add to Inventory`, `Add New Product`, and `End Session`.

##### `View Products for Sale`

Selecting this option will display all items available for purchase in the store, including their product ID number, name, and quantity in stock.

##### `View Low Inventory`

Selecting this option will display all products with a stock inventory count lower than 5, and indicating the name, product ID number and stock quantity for each item.

##### `Add to Inventory`

Selecting this option will prompt the manager to enter the ID number of the product he or she would like to update and how many more items of this product the manager is adding. The manager will then be indicated the new quantity in stock for this product.

##### `Add New Product`

Selecting this option will prompt the manager to enter the name, deparment, price, and stock quantity for a new product. The manager will then be indicated that the product has been added successfully and display the information just entered.

##### `End Session`

Selecting this option closes the manager session.

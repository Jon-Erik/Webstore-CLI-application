CREATE DATABASE webstore_db;

USE webstore_db;

CREATE TABLE products (
	item_id INT(10) UNSIGNED PRIMARY KEY auto_increment,
    product_name VARCHAR(255),
    department_name VARCHAR(255),
	price INT(10) UNSIGNED,
    stock_quantity INT(10) UNSIGNED
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("The Habit of Being", "books", 15, 25),
	("SONY digital sound recorder",	"electronics", 150,	43),
    ("BOSE laptop speakers", "electronics", 50, 8),
    ("KORG tuner/metronome", "music accessories",	80,	30),
    ("leather messenger bag", "apparel and accessories", 30, 49),
    ("The Hitchhiker's Guide to the Galaxy", "books", 15, 2),
    ("NEXUS phone", "electronics", 170,	59),
    ("blue jeans", "apparel and accessories", 20, 1),
    ("gooseneck desk lamp",	"furnishings", 15, 46),
    ("Manhasset music stand", "music accessories", 70, 12),
    ("computer mouse",	"electronics", 10, 14);
    
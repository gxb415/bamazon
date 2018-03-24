DROP DATABASE bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
item_id INT NOT NULL,
product_name VARCHAR(245),
department_name VARCHAR(245),
price DECIMAL(7,2) NOT NULL,
stock_quantity INT NOT NULL,
PRIMARY KEY(item_id)
);

SELECT * FROM products;

INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES 
(1002, 'Blender', 'Appliances', 199.99, 10),
(2188, 'iPhone 8', 'Electronics', 799.99, 22),
(2008, 'Hp 12 inch Laptop', 'Electronics', 499.99, 3),
(4032, 'Jansport Backpack', 'Accessories', 24.99, 5),
(4598, 'Michael Kors Purse', 'Accessories', 399.99, 2),
(7660, 'The Hunger Games', 'Books', 15.99, 3),
(2055, 'Samsung SmartTV', 'Electronics', 1299.99, 2),
(9018, 'Tomatoes', 'Groceries', .99, 45),
(9001, 'Apples', 'Grocieries', .99, 30),
(3011, 'Call of Duty', 'Video Games', 49.99, 13),
(3801, 'xBox Console', 'Video Games', 399.99, 4)








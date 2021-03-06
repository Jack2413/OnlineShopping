CREATE TABLE users (
  username varchar(32) NOT NULL,
  email varchar(32) NOT NULL,
  encrypted_password varchar(256) NOT NULL,
  salt varchar(128) NOT NULL,
  permission INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

heroku addons:create heroku-postgresql WITH ENCODING 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8'

CREATE TABLE products (
  id serial NOT NULL,
  name varchar(32) NOT NULL,
  price money NOT NULL,
  description varchar(255) NOT NULL,
  imgcode INTEGER NOT NULL,
  PRIMARY KEY (id)
);

-- every user has only one cart, if user click checkout button, all information involves this useremail is deleted. this design is meant to keep the cart information if user reloads the page. 
CREATE TABLE  cart (
  email varchar(32) NOT NULL,
  id serial NOT NULL,
  name varchar(32) NOT NULL,
  price money NOT NULL,
  amount INTEGER NOT NULL,
  FOREIGN KEY (email) REFERENCES users (email),
  PRIMARY KEY (name, email)
);

CREATE TABLE orders (
  email varchar(32) NOT NULL,
  orderid serial NOT NULL,
  thedate timestamp NOT NULL,
  FOREIGN KEY (email) REFERENCES users (email),
  PRIMARY KEY (orderID)
);

CREATE TABLE  orderDetails (
  orderID INTEGER NOT NULL,
  email varchar(32) NOT NULL,
  productId INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  totalPrice MONEY NOT NULL,
  FOREIGN KEY (email) REFERENCES users (email),
  FOREIGN KEY (productId) REFERENCES products (id),
  FOREIGN KEY (orderID) REFERENCES orders (orderID),
  PRIMARY KEY (orderID,productId,email)
);


ALTER TABLE users ADD COLUMN resetPasswordToken varchar(128);
ALTER TABLE users ADD COLUMN resetPasswordExpires timestamp;

INSERT INTO products (name, price, description) VALUES('apple', 5, 'this is fruit',1);
INSERT INTO products (name, price, description) VALUES('pear', 3, 'this is fruit as well',2);

INSERT INTO products (name, price, description, imagecode) VALUES('DAVE THE MINION', 15, 'this is a minion toy',1);
INSERT INTO products (name, price, description, imagecode) VALUES('STUART THE MINION', 30, 'this is a minion toy',2);
INSERT INTO products (name, price, description, imagecode) VALUES('KEVIN THE MINION', 40, 'this is a minion toy',3);
INSERT INTO products (name, price, description, imagecode) VALUES('MINION FAMILY', 100, 'this is a minion family',4);

INSERT INTO orders (email, theDate) VALUES('test@gmail.com',  CURRENT_TIMESTAMP);
INSERT INTO orders (email, theDate) VALUES('test@gmail.com',  CURRENT_TIMESTAMP);
INSERT INTO orders (email, theDate) VALUES('user@gmail.com',  CURRENT_TIMESTAMP);
INSERT INTO orders (email, theDate) VALUES('user@gmail.com',  CURRENT_TIMESTAMP);

INSERT INTO orderDetails (orderID, email, productId, amount, totalPrice) VALUES(5,'test@gmail.com', 38,2,30);
INSERT INTO orderDetails (orderID, email, productId, amount, totalPrice) VALUES(5,'test@gmail.com', 39,1,30);
INSERT INTO orderDetails (orderID, email, productId, amount, totalPrice) VALUES(6,'test@gmail.com', 40,1,40);
INSERT INTO orderDetails (orderID, email, productId, amount, totalPrice) VALUES(6,'test@gmail.com', 41,1,100);

INSERT INTO orderDetails (orderID, email, productId, amount, totalPrice) VALUES(7,'test@gmail.com', 38,1,15);
INSERT INTO orderDetails (orderID, email, productId, amount, totalPrice) VALUES(7,'test@gmail.com', 39,2,60);
INSERT INTO orderDetails (orderID, email, productId, amount, totalPrice) VALUES(8,'test@gmail.com', 40,2,80);
INSERT INTO orderDetails (orderID, email, productId, amount, totalPrice) VALUES(8,'test@gmail.com', 41,1,100);

INSERT INTO orderDetails (email, totalPrice, theDate) VALUES('test@gmail.com', 140, CURRENT_TIMESTAMP);
INSERT INTO orderDetails (email, totalPrice, theDate) VALUES('user@gmail.com', 55, CURRENT_TIMESTAMP);
INSERT INTO orderDetails (email, totalPrice, theDate) VALUES('user@gmail.com', 115, CURRENT_TIMESTAMP);

-- some transactions to build cart functionality
INSERT INTO cart (email, id, name, price, amount)
VALUES('test@gmail.com', 38, 'DAVE THE MINION', 15, 1);

INSERT INTO cart (email, name, price, amount)
VALUES('test@gmail.com', 'STUART THE MINION', '$30.00', 3);


SELECT id FROM products WHERE NAME = 'DAVE THE MINION';
SELECT price FROM products WHERE NAME = 'DAVE THE MINION';.
DELETE FROM cart WHERE productname = 'DAVE THE MINION';
DELETE FROM cart WHERE email = 'test@gmail.com';

UPDATE cart SET amount = amount + 1 WHERE email = 'test@gmail.com' AND name = 'DAVE THE MINION';

INSERT INTO orders (email, thedate) VALUES ('test@gmail.com', CURRENT_TIMESTAMP);

SELECT orderid FROM orders ORDER BY thedate DESC LIMIT 1;

select imagecode, count(name)  from products, orderdetails where id = productid group by imagecode order by count(name) desc limit 3
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

CREATE TABLE  cart (
  email varchar(32) NOT NULL,
  productId INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  totalPrice MONEY NOT NULL,
  FOREIGN KEY (email) REFERENCES users (email),
  FOREIGN KEY (productId) REFERENCES products (id),
  PRIMARY KEY (productId,email)
);

CREATE TABLE orders (
  email varchar(32) NOT NULL,
  orderID serial NOT NULL,
  theDate timestamp NOT NULL,
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



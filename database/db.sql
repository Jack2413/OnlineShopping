CREATE TABLE users (
  username varchar(32) NOT NULL,
  email varchar(32) NOT NULL,
  encrypted_password varchar(256) NOT NULL,
  salt varchar(128) NOT NULL,
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
  totalPrice MONEY NOT NULL,
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
  FOREIGN KEY (orderID) REFERENCES order (orderID),
  PRIMARY KEY (orderID,productId,email)
);

INSERT INTO products (name, price, description) VALUES('apple', 5, 'this is fruit',1);
INSERT INTO products (name, price, description) VALUES('pear', 3, 'this is fruit as well',2);
INSERT INTO cart (email, productId, amount, totalPrice) VALUES('test@gmail.com',1 , 5, 10);
INSERT INTO cart (email, productId, amount, totalPrice) VALUES('test@gmail.com',2,, 5, 10);
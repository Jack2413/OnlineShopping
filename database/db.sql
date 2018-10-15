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
  PRIMARY KEY (id)
);

CREATE TABLE  cart (
  email varchar(32) NOT NULL,
  productId INTEGER NOT NULL,
  productName varchar(32) NOT NULL,
  amount INTEGER NOT NULL,
  totalPrice MONEY NOT NULL,
  FOREIGN KEY (email) REFERENCES users (email),
  FOREIGN KEY (productId, productName) REFERENCES products (id,name),
  PRIMARY KEY (productId,email)
);

INSERT INTO products (name, price, description) VALUES('apple', 5, 'this is fruit');
INSERT INTO products (name, price, description) VALUES('pear', 3, 'this is fruit as well');
INSERT INTO cart (email, productId, productName, amount, totalPrice) VALUES('test@gmail.com',1, apple, 5, 10);
INSERT INTO cart (email, productId, productName ,amount, totalPrice) VALUES('test@gmail.con',2, pear, 5, 10);
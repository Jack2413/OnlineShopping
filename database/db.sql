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


INSERT INTO products (name, price, description) VALUES('apple', 5, 'this is fruit');

INSERT INTO products (name, price, description) VALUES('pear', 3, 'this is fruit as well');
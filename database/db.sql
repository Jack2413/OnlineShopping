CREATE TABLE users (
  username varchar(32) NOT NULL,
  email varchar(32) NOT NULL,
  encrypted_password varchar(128) NOT NULL,
  salt varchar(64) NOT NULL,
  PRIMARY KEY (email),
); ENGINE=InnoDB DEFAULT CHARSET=utf8

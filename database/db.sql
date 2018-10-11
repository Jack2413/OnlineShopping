CREATE TABLE `user` (
  `username` varchar(32) NOT NULL 
  `email` varchar(32) NOT NULL,
  `encrypted_password` varchar(128) NOT NULL,

  PRIMARY KEY (`email`),
  UNIQUE KEY `login_name` (`login_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

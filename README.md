# OnlineShopping
video demo:
custormer->
https://youtu.be/Ps6XwzGULfE   

administrator->
https://youtu.be/WurhfYh604g
		 	 	 		
login, reset and register->
https://www.youtube.com/watch?v=WdQGMfZd0fQ
				
					
a. How to use your system?

Go to -> https://nwen304onlineshoping.herokuapp.com/


Accounts: 
Customers:
Username: test@gmail.com
Password: 123123

Username: user@gmail.com
Password: 123123

Administrator:
Username: Administrator@gmail.com
Password: 123123


Sign in / Sign out:
Working at the moment, but it is not stable (a runtime error sometimes occurs) due to unexpected reasons (perhpas on the heroku side). 2 branches have been hardcoded (test@gmail.com and Administrator) which mimic being logged with the 2 types of accounts.
To test these branches use:
Nodemon server.js

Forgot password: 
Allows user to reset their password, see password reset functionalities bellow.

Homepage Functionalities:
Recommendation system: 
We choose the top 3 most popular (best selling) products to recommend to our customers. So if there is nothing in the order details, the website will not recommend anything.

Search button: 
Type the full name of product, then click search; this search bar does not support vague search.

Launch modal to add item button: 
This function will be activated when an administrator signs in, in order to add new products to the website. The inconvenient part is an administrator needs to add images to our database first, then he can add new products, the database has 2 extra images (imagecode 5, imagecode 6), so an Administrator can only add 2 products with pictures.

Add button: 
The add button below each product is the button to add this product to cart, we've tried to keep the homepage simple, if customers regret their decision, they can amend products information in the cart page. Unlogged customers are not allowed to use Add button.

Cartpage functionalities:
+/-/delete button: Use these 3 buttons to change the amount of products.
Checkout button: for user who decides to checkout(buy all the product in cart). When checkout button is clicked, all products in the cart will be added to orders and orderdetails, The cart will be emptied.

Order page functionalities:
Administrator can see all orders owned by different customers, customers can see their own orders.
View button: click view button to see details of certain order.

Orderdetails functionalities: 
Administrator can amend product amount and delete the products, customers can only browse it.

Register functionlities:
The user has to insert a username, email, password and agree to the privacy provisions to summit the reset from. There are several rules for fill in the application. 
1. The user name can not be empty. 
2. The password must be at less 6 digits. 
3. If the email has been used for registration already, you can not use the same email to register again. If the rules above are met, it should be Registered successfully.   

Login functionlities:
The user has to insert their (correct) Registered emaill and password.

Password reset functionalities:
There are two reset functions, the first one is designed for users who know their old password and the second one is designed for users who forgot their old password. 

In the first function the user has to insert their email, old password and the new password to complete the reset function. If the old password does not match the password in the database, the website will reject the reset form, otherwise the password will be reset successfully.

In the second function, the user has to provide their registered email account, if the account exists in the database the server will automaticly send an email to the users email address. Containing a reset form link and token (to identify the user), it allows the user to click on the link to reset their password. The token has an expiry time (5 min). If the user does not reset the password in 5 min or the user tries to hack the tokens. the server will respond "used Invaild token or past expiry time" and reject the reset from. If the user has done everything correctly, reset password should be successful.

Once the password is reset, it will jump back to login page and the user must login again.


b. What the REST interface is?

All the back end stuff is in index.js file, server.js is for testing. 
Database schemas are in db.sql file.


API TYPE
API URL
EXPLANATION


LOGIN, RESET, SIGN UP, FORGOT PASSWORD=====>

get 
/forgot/:email
–Reset detail

post
/login
–login

post
/register
–register

put
/reset
–Password reset


ORDERS=====>

get 
/currentorderid
–Get current order id in order to insert cart information into orderdetails

get
/getOrder/:email
–Get customer’s orders in order page

get
/getOrderDetails/:orderID
–To show the details of certain order

post
/addtoorders
–Add customer email to orders then get a order id.

post
/addtoorderdetails
–insert cart information into orderdetails



ADMINISTRATOR=====>

put
/modifyOrder
–Administrator can modify order infomation

delete
/deleteOrderDetails
–Adiministrator can delete records in orderdetails

post
/addtoproduct
–Administrator add product to homepage


HOMEPAGE=====>

get
/db
–Products for homepage 

get 
/recommandation
–Recommand 3 top sellers

get 
/search/:name
–Find the product accoring to name


CART PAGE=====>

get 
/cartdb/:email
–Get customer’s cart infomation

post
/addtocart 
–Add certain product to cart 

Put 
/cartadd1
–Amount+1 in cart page

Put 
/carminus1
–Amount-1 in cart page

Put 
/emptycart
–Click checkoutbutton empty cart 

put
/cartdelete
–Delete one record instantly




c. What error handling has been implemented in your system?
We use post man and curl to test our api.
We use try catch in server side to test database.

d. Database design
We have five tables, users, products, cart, orders, orderdetails. 
We use users table’s primary key email to track user, products table’s primary key id to  track product.
In cart table, we use productname + email to track cart. This is not the best option, because we should use id + email. Product name is not likely to be same between products, so I did not change it.

Orders table ‘s primary key is orderid, this oderid is used to track orders in orderdetails table.

Orderdetails has 3 foreign keys, email, productid, orderid. We combine 3 foreign key together as primary key to track each records in orderdetails table.

For implementing the forgot password reset function we added two columns (resetpasswordtoken and resetpasswordexpire) to user, to store the token and expire time.

				
CREATE TABLE users (
  username varchar(32) NOT NULL,
  email varchar(32) NOT NULL,
  encrypted_password varchar(256) NOT NULL,
  salt varchar(128) NOT NULL,
  permission INTEGER NOT NULL DEFAULT 1,
  resetpasswordtoken varchar(128)
  resetpasswordexpair timestemp,
  PRIMARY KEY (email)
)；


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
		


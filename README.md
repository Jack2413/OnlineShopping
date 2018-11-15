# OnlineShopping
video demo:
custormer->
https://youtu.be/Ps6XwzGULfE   

administrator->
https://youtu.be/WurhfYh604g
		 	 	 		
			
				
					
a. How to use your system

Way1 go to .https://nwen304onlineshoping.herokuapp.com/


Accounts: 
Customers:
Username: test@gmail.com
Password: 123123

Username: user@gmail.com
Password: 123123

Administrator:
Username: Administrator@gmail.com
Password: 123123


sign in / sign out is working at the moment, but it is not stable (sometime runtime error occurs)due to unexpected reason on heroku side.  I hardcode 2 branches test@gmail.com and Administrator  mimic logged with 2 types of accounts.
To test use the other 2 branches use:
Nodemon server.js

Forgot password: reset password.

Homepage Functionalities:
Recommendation system: 
We choose top 3 popular(best seller) product to recommend for our customers. So if nothing in order details, this website will 

Search button:  type the full name of product, then click search; this search bar does not support vague search.

Launch modal to add item button:  this function will be activated when administrator signs in, in order to add new product to this website. The inconvenient part is administrator need to add images to our database first,  then he can add new products, database got extra 2 images(imagecode 5, imagecode 6), so Administrator can only add 2 products with pictures.

Add button: the add button below each product is the button to add this product to cart, we try to keep the homepage simple, if customers regret their decision, they can amend products information in cart page.   Unlogged customers are not allowed to use Add button.

Cartpage functionalities:
+/-/delete button:  use these 3 button to change the amount of products.
Checkout button: for user who decides to checkout(buy all the product in cart). When checkout button is clicked, all product in cart will be added to orders and orderdetails, The cart will be emptied.

Order page functionalities:
Administrator can see all orders owned by different customers, customer can see his own orders.
View button: click view button to see details of certain order.

Orderdetails functionalities: 
Administrator can amend products amount and delete the products , customers can only browse it.

register functionlities:

the user have to insert username, email, password and agreed the privacy provisions to summit the reset from. There are several rules for fill in the application. 1. the user name can not be empty 2. the password must be at less 6 decit 3. the if the email have been use for registered, you can not use the same email to register again. If meet the above request, it should be Registered successfully.   

login functionlities:

the user have to insert the Registered emaill and correct password

Password reset functionalities:
there are two keen of reset functions, frist one is design for who knows his old password and the second one is design for who forgot his old password. In the frist function the user have to insert his email, old password and the new password to complete the reset function. if the old password do not match the password in database, will reject reset the from, otherwise will be reset successfully.

In the second function, the user have to provide his registered email account, if the account is exist the server will automaticly send an email to the users email address. That is, contains a reset from link with token(to identify the user), it allows user click on the link to reset his password. the token have a expair time (5 min). if the user do not reset the password in 5 min or the user try to hack the tokens. the server will respond "use Invaild token or over expair time" and reject the reset from. If the user done every thing currently, reset password should be successful.

Once the password reseted, it will jump back to login page you have to login again.


b. What the REST interface is
All the back end stuff is in index.js file, server.js is for testing. 
Database schemas are in db.sql file.


API TYPE
API URL
EXPLANATION


LOGIN, RESET, SIGN UP, FORGOT PASSWORD=====>
Get 
/forgot/:email
Reset detail

post
/login
login

post
/register
register

put
/reset
Password reset


ORDERS=====>
Get 
/currentorderid
Get current order id in order to insert cart information into orderdetails

get
/getOrder/:email
Get customer’s orders in order page

get
/getOrderDetails/:orderID
To show the details of certain order

post
/addtoorders
Add customer email to orders then get a order id.

post
/addtoorderdetails
insert cart information into orderdetails



ADMINISTRATOR=====>
put
/modifyOrder
Administrator can modify order infomation

delete
/deleteOrderDetails
Adiministrator can delete records in orderdetails

post
/addtoproduct
Administrator add product to homepage


HOMEPAGE=====>
get
/db
Products for homepage 

Get 
/recommandation
Recommand 3 top sellers

Get 
/search/:name
Find the product accoring to name


CART PAGE=====>
Get 
/cartdb/:email
Get customer’s cart infomation

post
/addtocart 
Add certain product to cart 

Put 
/cartadd1
Amount+1 in cart page

Put 
/carminus1
Amount-1 in cart page

Put 
/emptycart
Click checkoutbutton empty cart 

put
/cartdelete
Delete one record instantly




c. What error handling has been implemented in your system
We use post man and curl to test our api.
We use try catch in server side to test database.

d. Database design
We have five tables, users, products, cart, orders, orderdetails. 
We use users table’s primary key email to track user, products table’s primary key id to  track product.
In cart table, we use productname + email to track cart. This is not the best option, because I should use id + email. Product name is not likely to be same between products, so I did not change it.

Orders table ‘s primary key is orderid, this oderid is used to track orders in orderdetails table.

Orderdetails has 3 foreign keys, email, productid, orderid. We combine 3 foreign key together as primary key to track each records in orderdetails table.

for implement the forgot password reset function I did added resetpasswordtoken and resetpasswordexpair those two colums to user, for store token and expair time.

				
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
		


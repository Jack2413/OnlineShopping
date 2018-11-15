# OnlineShopping

		 	 	 		
			
				
					
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
Administrator can amend products amount, customers can only browse it.


b. What the REST interface is
All the back end stuff is in index.js file, server.js is for testing. 
Database schemas are in db.sql file.


API TYPE
API URL
EXPLANATION

post
/login
login

post
/register
register

put
/reset
Password reset

get
/getOrder/:email
Get customer’s orders in order page

get
/getOrderDetails/:orderID
To show the details of certain order

put
/modifyOrder
Administrator can modify order infomation

delete
/deleteOrderDetails
Adiministrator can delete records in orderdetails

Get 
/forgot/:email
Reset detail

get
/db
Products for homepage 

Get 
/recommandation
Recommand 3 top sellers

Get 
/cartdb/:email
Get customer’s cart infomation

Get 
/search/:name
Find the product accoring to name

post
/addtoproduct
Administrator add product to homepage

Get 
/currentorderid
Get current order id in order to insert cart information into orderdetails

post
/addtoorders
Add customer email to orders then get a order id.

post
/addtoorderdetails
insert cart information into orderdetails

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


				
CREATE TABLE users (
  username varchar(32) NOT NULL,
  email varchar(32) NOT NULL,
  encrypted_password varchar(256) NOT NULL,
  salt varchar(128) NOT NULL,
  permission INTEGER NOT NULL DEFAULT 1,
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
		


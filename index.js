var express = require("express");
var app = express();
var port = process.env.PORT || 8080;
var bodyParser = require("body-parser");
var crypto = require("crypto");
crypto.DEFAULT_ENCODING = "hex";
const path = require("path");
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

var confige = {
  // size of the generated hash
  hashBytes: 64,
  // larger salt means hashed passwords are more resistant to rainbow table, but
  // you get diminishing returns pretty fast
  saltBytes: 32,
  // more iterations means an attacker has to take longer to brute force an
  // individual password, so larger is better. however, larger also means longer
  // to hash the password. tune so that hashing the password takes about a
  // second
  iterations: 872791,
  encryptBytes: 128
};

app
  .use(express.static(path.join(__dirname + "/front-end")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs");
//invoke functions on a service hosted in a different location
// Add headers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  // Website you wish to allow to connect res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow ,
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow- Headers"
  );
  // Pass to next layer of middleware
  next();
});

//Get function
//to get all the tasks from Heroku database, and return the result to front-end
app.post("/login", async (req, res) => {
  try {
    console.log("get in login function");
    const client = await pool.connect();
    console.log(req.body);
    var email = req.body.email;
    var password = req.body.password;
    console.log("email " + email + "password: " + password);

    var result = await client.query("SELECT * FROM USERS where email = $1", [
      email
    ]);
    console.log("result " + result.rows);

    if (result === undefined) {
      return res.json({feedback : "Invalid Username or Password", status : 400});
    }
    var db_username = result.rows[0].username;
    console.log("db_username :" + db_username);

    var db_permission = result.rows[0].permission;
    console.log("db_permission :" + db_permission);

    var database_password = result.rows[0].encrypted_password;
    console.log("database_password :" + database_password);

    var salt = result.rows[0].salt;
    console.log("salt :" + salt);

    var encrypt_password = crypto.pbkdf2Sync(
      password,
      salt,
      confige.iterations,
      confige.encryptBytes,
      "sha512"
    );
    console.log("encrypt_password :" + encrypt_password);

    var result = database_password === encrypt_password;

    if (!result) {
      console.log("invalid username or password");
      return res.json({feedback : "Invalid Username or Password", status : 400});
    } else {
      console.log("login success");
      return res.json({feedback : "login Success", status : 200, username : db_username, permission : db_permission});
    }
    client.release();
  } catch (err) {
    console.error(err);
    return res.json({feedback : err, status : 400});
  }
});

//Post function
//to create a new task to Heroku database, and return the task just created
app.post("/register", async (req, res) => {
  try {
    console.log("get in register function");
    const client = await pool.connect();
    console.log(req.body);
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    console.log(
      "username: " + username + "email: " + email + "password: " + password
    );

    const salt = crypto.randomBytes(confige.saltBytes).toString("hex");
    const encrypt_password = crypto.pbkdf2Sync(
      password,
      salt,
      confige.iterations,
      confige.encryptBytes,
      "sha512"
    );
    console.log("salt: " + salt + "encrypt_password: " + encrypt_password);

    var result = await client.query(
      "INSERT INTO USERS (USERNAME,EMAIL,ENCRYPTED_PASSWORD,SALT) VALUES ($1,$2,$3,$4)",
      [username, email, encrypt_password, salt]
    );

    if(!result){
    	console.log("email already been used.");
    	return res.json({feedback : "email already been used", status : 400});
	}else{
    	return res.json({feedback : "register success", status : 200});
	}
    
    client.release();

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.put("/reset", async (req, res) => {
  try {
    console.log("get in reset function");
    const client = await pool.connect();
    console.log(req.body);
    var email = req.body.email;
    var oldpassword = req.body.oldpassword;
    var newpassword = req.body.newpassword;
    console.log(
      "email: " +
        email +
        "oldpassword: " +
        oldpassword +
        "newpassword: " +
        newpassword
    );
    var result = await client.query("SELECT * FROM USERS where email = $1", [
      email
    ]);
    console.log("result " + result.rows);

    if (result === undefined) {
      return res.json({feedback : "Invalid Username or Password", status : 400});
    }

    var database_password = result.rows[0].encrypted_password;
    console.log("database_password :" + database_password);
    var salt = result.rows[0].salt;
    console.log("salt :" + salt);
    var encrypt_password = crypto.pbkdf2Sync(
      oldpassword,
      salt,
      confige.iterations,
      confige.encryptBytes,
      "sha512"
    );
    console.log("encrypt_password :" + encrypt_password);
    var result = database_password === encrypt_password;

    if (!result) {
      console.log("invalid username or password");
      return res.json({feedback : "Invalid Username or Password", status : 400});
    }

    salt = crypto.randomBytes(confige.saltBytes).toString("hex");
    encrypt_password = crypto.pbkdf2Sync(
      newpassword,
      salt,
      confige.iterations,
      confige.encryptBytes,
      "sha512"
    );
    console.log("salt: " + salt + "encrypt_password: " + encrypt_password);

    var result = await client.query(
      "UPDATE USERS SET ENCRYPTED_PASSWORD = $1, SALT = $2 WHERE EMAIL = $3",
      [encrypt_password, salt, email]
    );

    console.log("reset success");
    return res.json({feedback : "reset success", status : 200});

    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }

});

app.put("/getOrder", async (req, res) => {
	try {
		console.log("get in Order function");
		const client = await pool.connect();

		console.log(req.body);
		var email = req.body.email;
		console.log("email: "+email);
		var db_permission = await client.query('SELECT permission FROM users WHERE EMAIL = $1',[email]);
    	var permission = db_permission.rows[0].permission;
    	console.log("permission: "+permission);
    	var result;

    	if(permission==0){
    		result = await client.query('SELECT * FROM orders');
    	}else{
    		result = await client.query('SELECT * FROM orders WHERE EMAIL = $1',[email]);
    	}

		if (!result) {
			return res.send('No data found'); 
		}else{ 
			return res.send(result.rows);
		}
		client.release();
	} catch (err) { 
		console.error(err); 
		res.send("Error " + err);
	} 
});

app.put("/getOrderDetails", async (req, res) => {
	try {
		console.log("get in OrderDetails function");
		const client = await pool.connect();

		console.log(req.body);
		var orderID = req.body.orderID;
		console.log("orderID: "+orderID);
		var result = await client.query('select amount, id, name, price,description,imagecode from orderdetails NATURAL JOIN products where productid = id and orderid = $1',[orderID]);

		if (!result) {
			return res.send('No data found'); 
		}else{ 
			return res.send(result.rows);
		}
		client.release();
	} catch (err) { 
		console.error(err); 
		res.send("Error " + err);
	} 
});

app.put("/modifyOrder", async (req, res) => {
	try {
		console.log("get in modifyOrder function");
		const client = await pool.connect();

		console.log(req.body);
		var orderID = req.body.orderID;
		var productID = req.body.productID;
		console.log("orderID: "+orderID "productID "+productID);

		var result = await client.query('UPDATE OrderDetails SET amount = $1 WHERE orderID = $2 and productID = $3',[amount,orderID,productID]);

		if (!result) {
			return res.send('No data found'); 
		}else{ 
			return res.send("success");
		}
		client.release();
	} catch (err) { 
		console.error(err); 
		res.send("Error " + err);
	} 
});

app.delete("/deleteOrderDetails", async (req, res) => {
	try {
		console.log("get in deleteOrderDetails function");
		const client = await pool.connect();

		console.log(req.body);
		var orderID = req.body.orderID;
		var productID = req.body.productID;

		console.log("orderID: "+orderID+"productID: "+productID);

		var result = await client.query('DELETE FROM OrderDetails WHERE orderID=$1 and productid=$2',[orderID,productID]);

		if (!result) {
			return res.send('No data found'); 
		}else{ 
			return res.send(result.rows);
		}
		client.release();
	} catch (err) { 
		console.error(err); 
		res.send("Error " + err);
	} 
});



app.listen(port, () => console.log("Listening on Heroku Server"));

var express = require("express");
var app = express();
var port = process.env.PORT || 8080;
var bodyParser = require("body-parser");
var crypto = require("crypto");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
crypto.DEFAULT_ENCODING = "hex";
var nodemailer = require("nodemailer");
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

//cache control headers
// app.use(
//   cacheControl({
//     noCache: false
//   })
// );
// app.use(
//   cacheControl({
//     maxAge: 5
//   })
// );

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

    if (result.rows[0] === undefined) {
      console.log("invalid username or password");
      return res.json({
        feedback: "Invalid Username or Password",
        status: 400
      });
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
      return res.json({
        feedback: "Invalid Username or Password",
        status: 400
      });
    } else {
      console.log("login success");
      return res.json({
        feedback: "login Success",
        status: 200,
        username: db_username,
        permission: db_permission
      });
    }
    client.release();
  } catch (err) {
    console.error(err);
    return res.json({ feedback: "Invalid Username or Password", status: 400 });
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

    if (!result) {
      console.log("email already been used.");
      return res.json({ feedback: "email already been used", status: 400 });
    } else {
      return res.json({ feedback: "register success", status: 200 });
    }

    client.release();
  } catch (err) {
    console.error(err);
    return res.json({ feedback: "email already been used", status: 400 });
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
      return res.json({
        feedback: "Invalid Username or Password",
        status: 400
      });
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
      return res.json({
        feedback: "Invalid Username or Password",
        status: 400
      });
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
    return res.json({ feedback: "reset success", status: 200 });

    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get("/getOrder/:email", async (req, res) => {
  try {
    console.log("get in Order function");
    const client = await pool.connect();

    var email = req.params.email;
    console.log("email: " + email);
    var db_permission = await client.query(
      "SELECT permission FROM users WHERE EMAIL = $1",
      [email]
    );
    var permission = db_permission.rows[0].permission;
    console.log("permission: " + permission);
    var result;

    if (permission == 0) {
      result = await client.query("SELECT * FROM orders");
    } else {
      result = await client.query("SELECT * FROM orders WHERE EMAIL = $1", [
        email
      ]);
    }

    if (!result) {
      return res.send("No data found");
    } else {
      return res.send(result.rows);
    }
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});
//

app.get("/getOrderDetails/:orderID", async (req, res) => {
  try {
    console.log("get in OrderDetails function");
    const client = await pool.connect();

    var orderID = req.params.orderID;
    console.log("orderID: " + orderID);
    var result = await client.query(
      "select amount, id, name, price,description,imagecode from orderdetails NATURAL JOIN products where productid = id and orderid = $1",
      [orderID]
    );

    if (!result) {
      return res.send("No data found");
    } else {
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
    var amount = req.body.amount;
    console.log("orderID: " + orderID + "productID " + productID);

    var result = await client.query(
      "UPDATE OrderDetails SET amount = $1 WHERE orderID = $2 and productID = $3",
      [amount, orderID, productID]
    );

    if (!result) {
      return res.send("No data found");
    } else {
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

    console.log("orderID: " + orderID + "productID: " + productID);

    var result = await client.query(
      "DELETE FROM OrderDetails WHERE orderID=$1 and productid=$2",
      [orderID, productID]
    );

    if (!result) {
      return res.send("No data found");
    } else {
      return res.send(result.rows);
    }
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});
//test
app.get("/forgot/:email", async (req, res) => {
  try {
    console.log("get in forgot function");
    const client = await pool.connect();

    var email = req.params.email;
    var result = await client.query(
      "select email from users where email = $1",
      [email]
    );
    console.log("result " + result.rows[0]);
    if (result.rows[0] === undefined) {
      return res.json({ feedback: "The account is not exist", status: 400 });
    } else {
      var resetPasswordToken = crypto
        .randomBytes(confige.saltBytes)
        .toString("hex");
      var resetPasswordExpires = new Date(); // 5min
      await client.query(
        "UPDATE users SET resetPasswordToken = $1,resetPasswordExpires = $2 where email = $3",
        [resetPasswordToken, resetPasswordExpires, email]
      );

      sendAnResetEmail(email, resetPasswordToken);
      return res.json({
        feedback:
          "An email has been send to " + email + " for further informations",
        status: 200,
        token: resetPasswordToken
      });
    }
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get('/ForgotReset/:token', function(req, res) {


  res.sendfile(__dirname + '/front-end/ForgotReset.html');
  //res.render('pages/ForgotReset');
});

app.put("/ForgotReset/:token", async (req, res) => {
  try{
    console.log("get in ForgotReset function");
    const client = await pool.connect();
    console.log(req.body);

    var newpassword = req.body.newpassword;
    var token = req.params.token;
    var result = await client.query("select resetPasswordExpires from users where resetpasswordtoken = $1",[token]); 
    var currentTime = new Date();

    if(result.rows[0]===undefined){
      return res.json({
          feedback: "Invalid token or over expires time",
          status: 400
        });
    }
    var ExpiresTime = result.rows[0].resetpasswordexpires;
    console.log("timebetween: "+(currentTime-ExpiresTime));

    if (currentTime-ExpiresTime>300000) {
      return res.json({
          feedback: "Invalid token or over expires time",
          status: 400
        });
    }

    var salt = crypto.randomBytes(confige.saltBytes).toString("hex");
    var encrypt_password = crypto.pbkdf2Sync(
      newpassword,
      salt,
      confige.iterations,
      confige.encryptBytes,
      "sha512"
    );

    console.log("salt: " + salt + "encrypt_password: " + encrypt_password);

    var result = await client.query(
      "UPDATE USERS SET ENCRYPTED_PASSWORD = $1, SALT = $2 WHERE resetpasswordtoken = $3",
      [encrypt_password, salt, token]
    );
    console.log("reset success");

    await client.query(
      "UPDATE USERS SET resetpasswordtoken = '' WHERE resetpasswordtoken = $1",
      [token]
    );
    console.log("delete token");

    
    return res.json({ feedback: "reset success", status: 200 });

    client.release();
  }catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
  //var result = await (select )
});

function sendAnResetEmail(email, token) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nwen304onlingshoping@gmail.com",
      pass: "OnlingShoping"
    }
  });

  var mailOptions = {
    from: "nwen304onlingshoping@gmail.com",
    to: "888jack219@gmail.com",
    subject: "Reset Your Password",
    text:
      "click the link below to reset the password" +
      "\n\n" +
      "https://nwen304onlineshoping.herokuapp.com/ForgotReset/" +
      token
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

app.get("/db", async (req, res) => {
  try {
    const client = await pool.connect();
    var result = await client.query("SELECT * FROM products");
    if (!result) {
      return res.send("No data found");
    } else {
      console.log("connected to db get/db");
      // result.rows.forEach(row => {
      //   console.log(row);
      // });
    }
    res.send(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get("/recommandation", async (req, res) => {
  try {
    const client = await pool.connect();
    var result = await client.query(
      "SELECT imagecode,COUNT(imagecode)  FROM products NATURAL JOIN orderdetails GROUP BY imagecode LIMIT 3"
    );
    if (!result) {
      return res.send("No data found");
    } else {
    }
    res.send(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

//
app.get("/cartdb/:email", async (req, res) => {
  try {
    const client = await pool.connect();
    //console.log(req.params.email);
    var result = await client.query(
      "SELECT * FROM cart WHERE email = '" + req.params.email + "'"
    );
    if (!result) {
      return res.send("No data found");
    } else {
      console.log("connected to cartdb get/cartdb");
      // result.rows.forEach(row => {
      //   console.log(row);
      // });
    }
    res.send(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get("/search/:name", async (req, res) => {
  try {
    const client = await pool.connect();
    console.log(req.params.name);
    var result = await client.query(
      "SELECT * FROM products WHERE name = '" + req.params.name + "'"
    );
    if (!result) {
      return res.send("No data found");
    } else {
      console.log("connected to db get/search");
    }
    res.send(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.post("/addtoproduct", urlencodedParser, async (req, res) => {
  try {
    const client = await pool.connect();
    var result = await client.query(
      "INSERT INTO products (name, price, description, imagecode) VALUES ('" +
        req.body.name +
        "'," +
        req.body.price +
        ",'" +
        req.body.description +
        "'," +
        req.body.imagecode +
        ")"
    );
    if (!result) {
      return res.send("No data found");
    } else {
      console.log("post/db succesful");
    }
    res.send(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get("/currentorderid", async (req, res) => {
  try {
    const client = await pool.connect();
    //console.log(req.params.email);
    var orderid = await client.query(
      "SELECT orderid FROM orders ORDER BY thedate DESC LIMIT 1;"
    );

    if (!orderid) {
      return res.send("No data found");
    } else {
      // orderid.rows.forEach(row => {
      //   res.json(row.orderid);
      // });
    }
    res.send(orderid.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.post("/addtoorders", urlencodedParser, async (req, res) => {
  try {
    const client = await pool.connect();
    var result = await client.query(
      "INSERT INTO orders (email, thedate) VALUES ('" +
        req.body.email +
        "',CURRENT_TIMESTAMP)"
    );
    if (!result) {
      return res.send("No data found");
    } else {
    }
    res.send(result.rows);
    console.log("add to order success");
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.post("/addtoorderdetails", urlencodedParser, async (req, res) => {
  try {
    const client = await pool.connect();
    var result = await client.query(
      "INSERT INTO orderdetails (orderid, email, productid, amount, totalprice) VALUES (" +
        req.body.orderid +
        ",'" +
        req.body.email +
        "'," +
        req.body.productid +
        "," +
        req.body.amount +
        ",'" +
        req.body.totalprice +
        "')"
    );

    if (!result) {
      return res.send("No data found");
    } else {
    }
    res.send(res.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// user add one product to his cart
app.post("/addtocart", urlencodedParser, async (req, res) => {
  try {
    const client = await pool.connect();
    console.log(req.body);
    var result = await client.query(
      "INSERT INTO cart (email, id, name, price, amount) VALUES ('" +
        req.body.email +
        "'," +
        req.body.productid +
        ",'" +
        req.body.name +
        "','" +
        req.body.price +
        "'," +
        1 +
        ")"
    );
    if (!result) {
      return res.send("No data found");
    } else {
      console.log("post/cartdb succesful");
    }
    res.send(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// amount of product increse 1 in cart page
app.put("/cartadd1", urlencodedParser, async (req, res) => {
  try {
    const client = await pool.connect();
    var result = await client.query(
      "UPDATE cart SET amount = amount + 1 WHERE email = '" +
        req.body.email +
        "' AND name = '" +
        req.body.name +
        "';"
    );
    if (!result) {
      return res.send("No data found");
    } else {
      console.log("post/db succesful");
    }
    res.send(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.put("/cartminus1", urlencodedParser, async (req, res) => {
  try {
    const client = await pool.connect();
    var result = await client.query(
      "UPDATE cart SET amount = amount - 1 WHERE email = '" +
        req.body.email +
        "' AND name = '" +
        req.body.name +
        "';"
    );
    if (!result) {
      return res.send("No data found");
    } else {
      console.log("post/db succesful");
    }
    res.send(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.put("/cartdelete", urlencodedParser, async (req, res) => {
  try {
    const client = await pool.connect();
    var result = await client.query(
      "DELETE FROM cart WHERE email = '" +
        req.body.email +
        "' AND name = '" +
        req.body.name +
        "';"
    );
    if (!result) {
      return res.send("No data found");
    } else {
      console.log("post/db succesful");
    }
    res.send(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});
app.put("/emptycart", urlencodedParser, async (req, res) => {
  try {
    const client = await pool.connect();
    var result = await client.query(
      "DELETE FROM cart WHERE email = '" + req.body.email + "';"
    );
    if (!result) {
      return res.send("No data found");
    } else {
      console.log("PUT/emptycart succesful");
    }
    res.send(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.listen(port, () => console.log("Listening on Heroku Server"));

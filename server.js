var express = require("express");
var {google} = require("googleapis");
var app = express();
var port = process.env.PORT || 8080;
var bodyParser = require("body-parser");
var crypto = require("crypto");
crypto.DEFAULT_ENCODING = "hex";
const path = require("path");
const { Pool } = require("pg");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var connectionURL =
  "postgres://jfmozbapyuirid:41744a1b0c40bbe1b0cdda91b7b9a7f7a93d04569ea38308eaf4d91d518d5fe9@ec2-54-235-90-0.compute-1.amazonaws.com:5432/dfikpgnoar8965";
const pool = new Pool({
  connectionString: connectionURL,
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

//==============
// Google OAuth
//==============

// Create an oAuth2 client to authorize the API call
const client = new google.auth.OAuth2(
  '14808020967-md5hcmqvm7agttppg31gslldf4uhjcig.apps.googleusercontent.com', 
  'ZNaha4XvCAhtxAhRtPT8wM7y', 
  'http://localhost:8080/oauthCallback/'
);

// Generate url that will be used for authorization
const scopes = ['https://www.googleapis.com/auth/plus.me'];
this.authorizeUrl = client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

app.use("/login-with-google.html", (req, res) => {
  const url = this.authorizeUrl;
  res.send('<h1>Authentication using google oAuth</h1><a href=' + url + '>Login</a>');
});

app.use("/oauthCallback", (req, res) => {
  const code = req.query.code;
  client.getToken(code, (err, tokens) => {
    if (err) {
      console.error('Error getting oAuth tokens:');
      throw err;
    }
    client.credentials = tokens;
    const home = 'http://localhost:8080'
    res.send('<h3>Authentication successful!</h3><a href=' + home + '>Home</a>');
  });
}); // Google OAuth end.

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

//get updated data from /db
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
      "INSERT INTO products (name, price, description) VALUES ('" +
        req.body.name +
        "'," +
        req.body.price +
        ",'" +
        req.body.description +
        "')"
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
      return res.send("Invalid username or password");
    }

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
      return res.send("invalid username or password");
    } else {
      console.log("login success");
      return res.send("login success");
    }
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
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
      return res.send("email already been used.");
    } else {
      console.log("register success");
      return res.send("register success");
    }
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.post("/reset", async (req, res) => {
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
      return res.send("Invalid username or password");
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
      return res.send("invalid username or password");
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
    return res.send("reset success");

    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app
  .get("/", (req, res) => res.render("pages/index"))
  .listen(port, () => console.log("Listening on Heroku Server"));

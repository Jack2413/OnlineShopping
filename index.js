var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var bodyParser = require ('body-parser');
var crypto = require('crypto');
const path = require('path');
const { Pool } = require('pg'); 
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: true 
});

var config = {
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

app.use (express.static(path.join(__dirname + '/front-end')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
//invoke functions on a service hosted in a different location
// Add headers
app.use (bodyParser.json());
app.use (bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
// Website you wish to allow to connect res.setHeader('Access-Control-Allow-Origin', '*')
res.setHeader('Access-Control-Allow-Origin', '*');
// Request methods you wish to allow
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
// Request headers you wish to allow ,
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow- Headers');
// Pass to next layer of middleware
next(); 
});

//Get function
//to get all the tasks from Heroku database, and return the result to front-end
app.get('/login', async (req, res) => { 
	try {
		console.log("get in get function");
		const client = await pool.connect();
		var result = await client.query('SELECT * FROM USERS');

		var email = req.body.email;
		var password = req.body.password;

		const salt = await client.query('SELECT SALT FROM USERS where email = $1',[email]);
		const database_password = await client.query('SELECT ENCRYPTED_PASSWORD FROM USERS where email = $1'+[email]);
		const encrypt_password = crypto.pbkdf2Sync(password, salt, confige.iterations, confige.encryptBytes, 'sha512');

		var result = database_password===encrypt_password;

		if (!result) {
			return res.send('Invalid username or password'); 
		}else{ 
			return res.send('Login success');
		}
		client.release();

	} catch (err) { 
		console.error(err); 
		res.send("Error " + err);
	} 
});

//Post function
//to create a new task to Heroku database, and return the task just created
app.post('/register', async (req, res) => { 
	try {
		console.log("get in register function");
		const client = await pool.connect();
		console.log(req.body);
		var username = req.body.username;
		var email = req.body.email;
		var password = req.body.password;
		console.log('username: ' + username + 'email: ' + email + 'password: '+ password);

		const salt = crypto.randomBytes(config.saltBytes);
		const encrypt_password = crypto.pbkdf2Sync(password, salt, confige.iterations, confige.encryptBytes, 'sha512');
		console.log('salt: ' + salt + 'encrypt_password: '+ encrypt_password);

		var result = await client.query('INSERT INTO USERS (USERNAME,EMAIL,ENCRYPT_PASSWORD,SALT) VALUES ($1,$2,$3,$4)',[username,email,encrypt_password,salt]);

		if (!result) {
			//console.log('not insert success');
			return res.send('Email already been used.'); 
		}else{
			return res.send('Register success');
		}
		client.release();
	} catch (err) { 
		console.error(err); 
		res.send("Error " + err);
	} 
});

app.get('/', (req, res) => res.render('pages/index'))
	.listen(port, () => console.log('Listening on Heroku Server'))



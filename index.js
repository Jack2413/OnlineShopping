var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var bodyParser = require ('body-parser');
const path = require('path');
const { Pool } = require('pg'); 
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: true 
});

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
		var result = await client.query('SELECT * FROM todo');
		if (!result) {
			return res.send('Invalid username or password'); 
		}else{ 
			return res.send(result.rows);
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
		const client = await pool.connect();
		console.log(req.body);
		var task = req.body.task;
		var name = req.body.task_name;
		var state = req.body.state;
		console.log(task+' '+name+' '+state);
		var result = await client.query('INSERT INTO todo (TASK,NAME,STATE) VALUES ($1,$2,$3)',[task,name,state]);
		var result2 = await client.query('SELECT * FROM todo where id = (SELECT MAX(id) FROM todo)');
		if (!result) {
			console.log('not insert success');
			return res.send('not insert success'); 
		}else if(!result2){
			console.log('insert success'); 
			console.log('select fail'); 
			return res.send('insert success, select fail'); 
		}else{
			console.log('insert success'); 
			console.log('select success'); 
			return res.send(result2.rows);
		}
		client.release();
	} catch (err) { 
		console.error(err); 
		res.send("Error " + err);
	} 
});

app.get('/', (req, res) => res.render('pages/index'))
	.listen(port, () => console.log('Listening on Heroku Server'))



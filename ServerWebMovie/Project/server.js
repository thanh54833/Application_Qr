
var express 	= require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model


var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));


app.get('/setup', function(req, res) {
	// create a sample user
	var nick = new User({ 

		name: 'test', 
		password: 'test',
		admin: true 

	});

	nick.save(function(err) {
		if (err) throw err;
		console.log('user saved successfully');
		res.json({ success: true });
	});
});

app.get('/', function(req, res) {
	res.send('welcome to web !');
});

var apiRoutes = express.Router(); 

apiRoutes.post('/authenticate', function(req, res) {
	// find user...
	User.findOne({name: req.body.name}, function(err, user) {

		if (err) throw err;
		if (!user) {

			res.json({ success: false, message: ' user not found !' });

		} else if (user) {


			if (user.password != req.body.password) {
				res.json({ success: false, message: 'wrong password !' });
			} else {

				var payload = {
					admin: user.admin	
				}
				var token = jwt.sign(payload, app.get('superSecret !'), {
					expiresIn: 86400 
				});

				res.json({
					success: true,
					message: 'show token !',
					token: token
				});


			}		

		}

	});
});


apiRoutes.use(function(req, res, next) {

	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	if (token) {
	
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
			if (err) {

				return res.json({ success: false, message: 'Failed token !' });		

			} else {

				req.decoded = decoded;	
				next();
			}
		});

	} else {

		return res.status(403).send({ 

			success: false, 
			message: 'no token !'
			
		});
		
	}
	
});

apiRoutes.get('/', function(req, res) {
	res.json({ message: 'Welcome to api!' });
});

apiRoutes.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});

apiRoutes.get('/check', function(req, res) {
	res.json(req.decoded);
});

app.use('/api', apiRoutes);

app.listen(port);

console.log('listening port :' + port);

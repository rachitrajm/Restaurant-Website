var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser =require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose= require('mongoose');
var session = require('express-session');
var indexRouter = require('./routes/index');
require('./models/user');
var MongoStore = require('connect-mongo')(session);
var app = express();
// connect MongoDB
mongoose.connect('mongodb://database/pindB', function(err,db){
    if (!err){
        console.log('Connected to /pindB!');
    } else{
        console.dir(err); //failed to connect
    }
});
//Passport
var passport = require('passport');
require('./config/pass')(passport); // pass passport for configuration

var Prod = require('./models/product');

var Products= [new Prod({
	imgurl: './public/images/shahipaneer.jpg',
	title: 'Shahi Paneer',
	type: 'Veg Main Course',
	price: 220
}),
new Prod({
	imgurl: './public/images/chickenmughlai.jpg',
	title: 'Chicken Mughlai',
	type: 'Non-veg Main Course',
	price: 380
}),
new Prod({
	imgurl: './public/images/chickentikka.jpg',
	title: 'Chicken Tikka',
	type: 'Non-veg Snacks',
	price: 260
}),
new Prod({
	imgurl: './public/images/paneertikka.jpg',
	title: 'Paneer Tikka',
	type: 'Veg Snacks',
	price: 200
}),
new Prod({
	imgurl: './public/images/afghanichicken.jpg',
	title: 'Afghani Chicken',
	type: 'Non-veg Snacks',
	price: 280
}),
new Prod({
	imgurl: './public/images/tandoriroti.jpg',
	title: 'Tandori Roti',
	type: 'Breads',
	price: 8
}),
new Prod({
	imgurl: './public/images/gulabjamun.jpg',
	title: 'Gulab Jamun',
	type: 'Dessert',
	price: 20
}),
new Prod({
	imgurl: './public/images/pappad.jpg',
	title: 'Pappad',
	type: 'Veg Snacks',
	price: 5
})];
var done=0;
for(var i=0;i<Products.length;i++)
{
	console.log(Products[i]);
	Products[i].save(function(err,result){
		console.log(result);
	});
}


// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'')));

// express session
app.use(session({
    secret:'secret',
    saveUninitialized : true,
    resave: true,
    store: new MongoStore({mongooseConnection: mongoose.connection}), 
    cookie: {maxAge: 180 * 60 * 1000}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	req.locals.session=req.session;
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

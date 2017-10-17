var express          = require('express');
var app              = express();
var morgan           = require('morgan');
var mongoose         = require('mongoose');
var PORT             = process.env.PORT || 3000;
var router           = express.Router();
var bodyParser       = require('body-parser');
var path             = require('path');
var appRoutes        = require('./app/routes/api')(router);
var Promise          = require('mpromise');
var util             = require('util');
var expressValidator = require('express-validator');
var engines = require('consolidate');
var server = require('http').createServer(app);
var cron   = require('node-cron');
var logger = require('express-logger');




app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, sid");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE,PUT");
  next();
});

app.use(morgan('dev'));
app.use(bodyParser.json());// parse application/json
app.use(bodyParser.urlencoded({ extended: false }));// parse application/x-www-form-urlencoded
app.use(expressValidator());
app.use(express.static(__dirname+'/public'));
app.set('views', path.join(__dirname, '/public/app/views'));
app.set('view engine', 'html');
app.use('/api',appRoutes);// e.g : http://localhost:3000/api/users // to be diffrent from angular routes
app.use(logger({path: "logs.log"}));

// mongoose.connect('mongodb://localhost:27017/awsOrders',function(err){
//   if(err){
//     console.log('not connected to database'+ err);
//   }
//   else {
//     console.log('connected to mongodb');
//   }
//
// });


 app.get('*',function(req,res){
   res.sendFile(path.join(__dirname+'/public/app/views/index.html'));
 });


server = app.listen(PORT,function(){
console.log('server running on '+ PORT);
});

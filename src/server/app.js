var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var mysql      = require('mysql');
var async = require("async");


// Bases de données


// const db = require('./db');


/*const mongo = require('./mongodb').mongodbClient;

console.log(mongo); 
// La référence MongoDB
let mongobdd;

// Obtenez une connexion DB quand le module est chargé
(function getDbConnection() {
    mongo.mongobddConnect().then((database) => {
        mongobdd = database;
    }).catch((err) => {
        logger.error('Erreur pendant l’initialisation de la BD : ' + err.message, 'lists-dao-mongogb.getDbConnection()');
    });
})();
*/


let mongoose = require('mongoose');



/*
  MongoClient.collection('test').findOne({}, function (findErr, result) {
    if (findErr) throw findErr;
    console.log(result);
    client.close();
  });
*/


/*
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/MyDb", function (err, client) {
    
    var db = client.db('test'); 

  db.collection('test').findOne({}, function (findErr, result) {
    if (findErr) throw findErr;
    console.log(result);
    client.close();
  });
            
});
  */              

/***********************************************************************************************
     Configuration, APP, Express, Headers, etc... 
************************************************************************************************/


var app = express();
// var io = require('socket.io')(http);
/**
 * Get port from environment and store in Express.
 */


    
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


mongoose.connect('mongodb://localhost/pujiapp', { useNewUrlParser: true});
var db = mongoose.connection;

// Added check for DB connection
if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Expose the node_modules folder as static resources (to access socket.io.js in the browser)
app.use('/static', express.static('node_modules'));


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, GET, PATCH, DELETE, OPTIONS');
    next();
});



/***********************************************************************************************
     ROUTER EXPRESS
************************************************************************************************/

 var router = express.Router();

// Use Api routes in the App
let apiRoutes = require("./api/routes/api-routes");
app.use('/api', apiRoutes);
app.use('/', router)

module.exports = router;
module.exports = app;



var server = app.listen(3000, function(){
    console.log('Server démarré sur le port 3000...');
    console.log(Date.now() + ' Chemin : ' + __dirname);
});




/**
 * Socket events
 */

 var io = require('socket.io').listen(server);

/*io.sockets.on('connection', function(socket){
  console.log('Le Socket connected');
});
*/
io.sockets.on('connection', function(socket)
{
   var total=io.engine.clientsCount;
   socket.emit('getNbUsers',total); 

  	console.log('user connected', socket.id);
  
  	socket.emit('message_success', 'Vous êtes bien connecté !');
  
  	socket.broadcast.emit('message_info', 'Un autre client vient de se connecter !');
  	socket.broadcast.emit('getNbUsers',total);


    /****************************************
    *                 POSTS
    *****************************************/
    socket.on('message_new_post', function (message) {
        console.log('Nouveau post créé : '); 
        console.log(message);
        socket.broadcast.emit('message_add_post', message);
  	});	

  socket.on('message_delete_post', function (message) {
      socket.broadcast.emit('message_delete_post', message);
  }); 

  // Quand le serveur reçoit un signal de type "message" du client    
  socket.on('message_edit_post', function (message) {
      console.log('Post édité : '); 
      console.log(message);
      socket.broadcast.emit('message_edit_post', message);
  }); 


    /****************************************
    *                 TAGS
    *****************************************/
    socket.on('message_new_tag', function (message) {
        console.log('Nouveau tag créé : '); 
        console.log(message);
        socket.broadcast.emit('message_add_tag', message);
    }); 

  socket.on('message_delete_tag', function (message) {
      socket.broadcast.emit('message_delete_tag', message);
  }); 

  // Quand le serveur reçoit un signal de type "message" du client    
  socket.on('message_edit_tag', function (message) {
      console.log('Post édité : '); 
      console.log(message);
      socket.broadcast.emit('message_edit_tag', message);
  }); 



    /****************************************
    *                 CATEGORIES 
    *****************************************/

  // Quand le serveur reçoit un signal de type "message" du client    
  socket.on('message_new_category', function (message) {
      console.log('Nouvelle Catégorie créée : '); 
      console.log(message);
      socket.broadcast.emit('message_new_category', message);
  }); 





  // Quand le serveur reçoit un signal de type "message" du client    
  socket.on('message', function (message) {
      console.log('Un client me parle ! Il me dit : '); 
      console.log(message);
      socket.broadcast.emit('message', message);
  }); 
  

    /****************************************
    *                 USERS
    *****************************************/

   // Quand le serveur reçoit un signal de type "message" du client    
  socket.on('user_login', function (user) {
      console.log(user + ' vient de se connecter');
      socket.broadcast.emit('message_user_login', user);
      var total = io.engine.clientsCount;
      socket.broadcast.emit('getNbUsers',total);
      socket.emit('getNbUsers',total);      
  });  

  // Quand le serveur reçoit un signal de type "message" du client    
  socket.on('user_logout', function (user) {
      console.log('Le user : ' + user + ' se déconnecte');
      socket.broadcast.emit('message_user_logout', user);

      // Le user peut se délogger - mais on veut qd meme savoir le nombre de personnes connectées 
      var total=io.engine.clientsCount - 1; // on supprime 1 car on a shooté l'utilisatuer en cours
      socket.broadcast.emit('getNbUsers',total);      
      socket.emit('getNbUsers',total);      
  });  


	socket.on('disconnect', function(){
	    console.log('user disconnected', socket.id);
	    socket.broadcast.emit('message_warning', 'Un client vient de se déconnecter !');
	    var total=io.engine.clientsCount;
	    socket.broadcast.emit('getNbUsers',total);
	});
});
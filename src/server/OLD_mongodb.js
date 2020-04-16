/***********************************************************************************************
     Connexion mongodb 
************************************************************************************************/

console.log('mongoDB.js'); 


const mongodb = require('mongodb');


let mongodbClient;
let mongobdd;


function mongobddConnect() {
    return new Promise((resolve, reject) => {
        if (mongobdd) {
            resolve(mongobdd);
        } else {
            mongodb.MongoClient.connect("mongodb://localhost:27017/test", function(err, client) {
                if (err) {
                    logger.error('Erreur de connexion à l’URL de mongodb URL: ' + appSettings.mongodb_url);
                    reject(err);
                }
                mongodbClient = client;
                mongobdd = mongodbClient.db('test');
                // testing(); 

                // Soyez sûr que la connection est fermée à la sortie de Node
                process.on('exit', (code) => {
                    mongobddClose();
                })
                resolve(mongobdd);
            });
        }
    });
}



function mongobddClose() {
    if (mongodbClient && mongodbClient.isConnected()) {
        mongodbClient.close();
    }
}


function testing(){
  console.log('testing !'); 
  if (mongodbClient && mongodbClient.isConnected()) {
    console.log('connected :-)'); 
    mongodbClient.db('test').collection('test').findOne({}, function (findErr, result) {

      if (findErr) throw findErr;
      
      console.log(result);
      // client.close();
    });
  } else {
    console.log('not connected'); 
  }
}

// mongobddConnect(); 


module.exports = mongodbClient;
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
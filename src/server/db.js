/***********************************************************************************************
     Connexion MySQL 
************************************************************************************************/


var mysql      = require('mysql');


// EN DEV 


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'pujiapp'
});


// EN PROD 

/*
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'smsenvoi',
  password : 'FAeRUOKfWAXVz4kC',
  database : 'smsenvoi'
});
*/



function mysql_real_escape_string (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}




connection.connect(function(err){
if(!err) {
    console.log("Connexion à la BDD... OK !");    
} else {
    console.log("Erreur de connection à la BDD ... Error");    
    console.log(err); 
}
});


module.exports = connection;
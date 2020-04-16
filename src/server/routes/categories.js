/***********************************************************************************************
|    
|  GESTION DES CATEGORIES
|    
|-----------------------------------------------------------------------------------------------       
|  Description :
|
|    - Ici on va gérere les catégories d'éléments  
|    - chaque catégories contiendra un ou plusieurs tags 
|
************************************************************************************************/

var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var db = require('../db');


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

/***********************************************************************************************
  Fonction pour récupérer toutes les catégories
************************************************************************************************/

router.get("/",function(req,res) {
  db.query('SELECT * FROM categories', function(err, rows, fields) {
  if (!err)  {
    //  console.log('The solution is: ', rows);
    res.setHeader('Content-Type', 'application/json');    
    res.send(JSON.stringify(rows));
  }
  else
    console.log('Error while performing Query.');
  });
});



/***********************************************************************************************
  Fonction pour récupérer les infos d'une catégorie
    param : :id (req.params.id) => renvoie toutes les informations de la catégorie avec id :id
************************************************************************************************/

router.get("/:id",function(req,res) {
  db.query('SELECT * from categories WHERE id = "' + req.params.id + '"', function(err, rows, fields) {
  if (!err)  {
    console.log('>> The solution is: ', rows);
    res.setHeader('Content-Type', 'application/json');    
    res.send(JSON.stringify(rows));
  }
  else
    console.log('Error while performing Query.');
  });
});


/***********************************************************************************************
  Fonction pour mettre à jour une catégorie
    param : :id (req.body) => met à jour toutes les infos de la catégorie passée en paramètre
************************************************************************************************/

router.put('/', function(req, res) {
    res.set('Content-Type', 'application/json');

    if (req.body.category) {
        res.status(201);
        res.json(req.body);

        var sql = 'UPDATE categories SET `name` = \'' + mysql_real_escape_string(req.body.category.name) + '\', `color` = \'' + mysql_real_escape_string(req.body.category.color) + '\'  WHERE id = ' + req.body.category.id;
        var query = db.query(sql, function(err, result) {
        if (err) {
           console.error(err);
           return res.send(err);
         } else {
           console.error('UPDATE OK');
         }
        });
      }
      else {
        console.error('ERROR CATGE.');
      }
});


/***********************************************************************************************
  Fonction pour ajouter une catégorie
    param : :id (req.body) => met à jour toutes les infos de la catégorie passée en paramètre
************************************************************************************************/

router.post('/', function(req, res) {
  res.set('Content-Type', 'application/json');
  res.status(201);
  res.json(req.body);
  
  var query = db.query('INSERT INTO categories (`name`, `color`) VALUES (\'' + mysql_real_escape_string(req.body.name) + '\', \'' + mysql_real_escape_string(req.body.color) + '\')', function(err, result) {
    if (err) {
      console.error(err);
      return res.send(err);
    } else {
      console.error('INSERT OK');
    }
  });
});


/***********************************************************************************************
  Fonction pour suppriemr une catégorie
    param : :id (req.params.id) => supprime la catégorie avec l'id :id
************************************************************************************************/

router.delete('/:id', function(req, res) {

  console.log('Server.js delete category'); 
  console.log(req.params);

  res.set('Content-Type', 'application/json');
  console.log('ID : ' + req.params.id); 

  res.status(201);
  res.json(req.params);
  //return res; 
      
  db.query('UPDATE tags SET category_id = \'-1\' WHERE category_id = \'' + req.params.id + '\'' , function(err, result) {
    if (err) {
      console.error(err);
      return res.send(err);
    } else {
      db.query('DELETE FROM categories WHERE id = \'' + req.params.id + '\'', function(err2, result2) {
        if (err2) {
          console.error(err2);
          return res.send(err2);
        } 
      });        
    }
  });
});


// Export du router
module.exports = router;
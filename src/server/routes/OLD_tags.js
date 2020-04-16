/***********************************************************************************************
|    
|  GESTION DES CATEGORIES
|    
|-----------------------------------------------------------------------------------------------       
|  Description :
|
|    - Ici on va gérere les tags
|    - chaque tag est associé à une catégorie
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


// POSTS

/***********************************************************************************************
  Fonction pour récupérer tous les tags
************************************************************************************************/

router.get('/',function(req,res, next) {
  console.log('On récupère les tags !'); 
  
  db.query('SELECT ta.id AS tag_id, ta.name AS tag_name, ta.category_id AS tag_category_id, cat.id AS cat_id, cat.name AS cat_name, cat.color AS cat_color FROM tags ta INNER JOIN `categories` cat ON ta.category_id = cat.id ORDER BY cat_name ASC', function(err, rows, fields) {
  if (!err)
  {
    var resultatFinal = []; 
    // On va formatter les données en JSON qui va bien
    for(var i=0; i<rows.length; i++) {
      // console.log('>> The solution is: ', rows);
      // console.log('Row : ' + i); 
      // console.log(rows[i]);

      var tagEnCours = {
        id: rows[i].tag_id,
        name: rows[i].tag_name,
        ref: 'tag',
        category: {
            id: rows[i].cat_id,
            name: rows[i].cat_name,
            color: rows[i].cat_color
        }}; 

      resultatFinal.push(tagEnCours);       
    }

    // console.log("resultatFinal"); 
    // console.log(resultatFinal); 

    // console.log('The solution is: ', rows);
    res.setHeader('Content-Type', 'application/json');    
    res.send(JSON.stringify(resultatFinal));
  }
  else
    console.log('Error while performing Query.');
  });
});




// Ajouter un post
router.post('/', function(req, res)
{
  console.log('Server.js add tag'); 

  res.set('Content-Type', 'application/json');
  res.status(201);
  res.json(req.body);

  console.log(req.body); 

    var actif = 0; 
    if (req.body.actif)
        actif = 1; 

  var sql = 'INSERT INTO tags (`name`, `category_id`) VALUES (\'' + mysql_real_escape_string(req.body.name) + '\',\'' + req.body.category.id + '\')';
  var query = db.query(sql, function(err, result) {
     if (err) {
       console.error(err);
       return res.send(err);
     } else {
             console.error('INSERT OK');
     }
  });
});


router.delete('/:id', function(req, res)
{
  console.log('Server.js delete tag'); 
  console.log(req.params);

      res.set('Content-Type', 'application/json');
      console.log('ID : ' + req.params.id); 

      res.status(201);
      res.json(req.params);
      //return res; 
      
   
    db.query('DELETE FROM tags WHERE id = \'' + req.params.id + '\'', function(err, result) {
    if (err) {
      console.error(err);
      return res.send(err);
    } else {
        if (req.params.id > 0) {
          var sql = 'DELETE FROM posts_a_tags WHERE `tag_id` = ' + req.params.id;
          console.log('Suppression du tag ' + req.params.id); 
          var query = db.query(sql, function(err, result) {
              if (err) {
               console.error(err);
               return res.send(err);
              } else {
                console.error('DELETE FROM POSTS OK');    
              }
          });
        }      
    }  
  });
});


router.get("/:id",function(req,res)
{  
  resultatFinal : {}; 
  db.query('SELECT ta.id AS tag_id, ta.name AS tag_name, ta.category_id AS tag_category_id, cat.id AS cat_id, cat.name AS cat_name, cat.color AS cat_color FROM tags ta INNER JOIN `categories` cat ON ta.category_id = cat.id WHERE ta.id = \'' + req.params.id + '\' ORDER BY ta.id ASC', function(err, rows, fields) {  if (!err)
  {
    console.log('>> The solution is: ', rows);
    resultatFinal = {
      id: rows[0].tag_id,
      name: rows[0].tag_name,
      ref: 'tag',
      category: {
          id: rows[0].cat_id,
          name: rows[0].cat_name,
          color: rows[0].cat_color
      }
    }; 

      console.log(resultatFinal); 
    // Maintenant, on va récupérer la catégorie pour la mettre dans le json 
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(resultatFinal));
  }
  else
    console.log('Error while performing Query.');
  });
});



router.put('/', function(req, res)
{
    res.set('Content-Type', 'application/json');


    if (req.body.tag)

    res.status(201);
    res.json(req.body);

   var sql = 'UPDATE tags SET `name` = \'' + mysql_real_escape_string(req.body.tag.name) + '\', `category_id` = ' + req.body.tag.category.id + '  WHERE id = ' + req.body.tag.id;
   var query = db.query(sql, function(err, result) {
     if (err) {
       console.error(err);
       return res.send(err);
     } else {

             console.error('UPDATE OK');
     }
    });

});



module.exports = router;

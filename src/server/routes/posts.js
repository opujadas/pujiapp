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
            case "\x1a":ccdddddd
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

// récupérer les contacts
/*router.get('/',function(req,res, next)
{
  console.log('On récupère les posts !'); 
  db.query('SELECT * FROM elementposts ORDER BY id ASC', function(err, rows, fields) {
  if (!err)
  {
    // console.log('The solution is: ', rows);
    res.setHeader('Content-Type', 'application/json');    
    res.send(JSON.stringify(rows));
  }
  else
    console.log('Error while performing Query.');
  });
});
*/

// Nouvelle version récupérer les contacts
router.get('/',function(req,res, next)
{
  console.log('On récupère les posts !'); 
  db.query('SELECT * FROM elementposts ORDER BY id ASC', function(err, rows, fields) {
  if (!err)
  {
    // console.log('The solution is: ', rows);
    res.setHeader('Content-Type', 'application/json');    
    res.send(JSON.stringify(rows));
  }
  else
    console.log('Error while performing Query.');
  });
});




// Ajouter un post
/*
router.post('/', function(req, res) {
  console.log('Server.js add contact'); 
  console.log(req.body); 

  res.set('Content-Type', 'application/json');
  res.status(201);
  res.json(req.body);

  // 1 - On créée un nouvel élément  // la value 1 correspond au typeelement pour les posts
  var sqlInsertElement = 'INSERT INTO elements (`typeelement_id`, `user_id`) VALUES (1, \'' + req.body.user_id + '\')';
  var query = db.query(sqlInsertElement, function(err, result) {
     if (err) {
       console.error(err);
       return res.send(err);
     } 
     else {        
        console.log('Nouvel élément inséré - On récupère son ID'); 

        // On va maintenant regarder le dernier id inséré, et faire les bons inserts pour les tags
        var sqlPostId = "SELECT LAST_INSERT_ID() AS LASTID;";
        db.query(sqlPostId, function(err, rows, fields) {
        if (!err)
        {
          var lastid = rows[0]['LASTID']; 
          console.log('Id : element inséré :  ' + lastid); 

          // On insère dans la table posts, en incluant le element_id 
          var sqlElementPost = 'INSERT INTO elementposts (`element_id`, `title`, `content`) VALUES (\'' + lastid + '\',\'' + mysql_real_escape_string(req.body.title) + '\',\'' + mysql_real_escape_string(req.body.content) + '\')';
          var query = db.query(sqlElementPost, function(err, result) {
             if (err) {
               console.error(err);
               return res.send(err);
             } else {
                console.error('INSERT INTO POSTS OK');

                // On va maintenant faire les bons inserts pour les tags
                for (var i=0; i<req.body.tags.length; i++) {
                  var insert = "INSERT INTO elements_a_tags (element_id, tag_id) VALUES (" + lastid + "," + req.body.tags[i].id + ")"; 
                  var query = db.query(insert, function(err2, result2) {
                     if (err2) {
                       console.error(err2);
                       return res.send(err2);
                      } else {
                        console.error('INSERT INTO POSTS A TAG OK');
                      }
                  }); 
                }
              }         
          });
        }
        else {
           console.error(err);
           return res.send(err);          
        }
    });
  }    
  });  
});  
*/



/*
router.delete('/:id', function(req, res)
{
  console.log('Server.js delete contact'); 
  console.log(req.params);

      res.set('Content-Type', 'application/json');
      console.log('ID : ' + req.params.id); 

      res.status(201);
      res.json(req.params);
      //return res;       
   
    db.query('DELETE FROM elementposts WHERE id = \'' + req.params.id + '\'', function(err, result) {
      if (err) {
        console.error(err);
        return res.send(err);
      } else {
        console.log('Suppression des tags pour post_id ' + req.params.id); 
        // On supprime également les éventuels tags associés 
        db.query('DELETE FROM elements_a_tags WHERE post_id = \'' + req.params.id + '\'', function(err2, result) {
          if (err2) {
            console.err2or(err2);
            return res.send(err2);
          } else {
            console.log(' OK'); 
          }
        });
      }
    });
});

*/



// Nouvelle version 

router.get("/:id",function(req,res)
{
  // resultatFinal : {}; 

//   db.query('SELECT po.id AS post_id, po.title AS post_title, po.content AS post_content, ta.id AS tag_id, ta.name AS tag_name, cat.id AS cat_id, cat.name AS cat_name, cat.color AS cat_color from elementposts po LEFT JOIN elements_a_tags pota ON pota.post_id = po.id LEFT JOIN tags ta ON pota.tag_id = ta.id LEFT JOIN categories cat ON ta.category_id = cat.id WHERE po.id = "' + req.params.id + '"', function(err, rows, fields) {
db.query('SELECT * FROM elementposts WHERE id = "' + req.params.id + '"', function(err, rows, fields) {

  if (!err) {
    console.log('>> The solution is: ', rows);

    // Si on a des résultats (ce qu'on devrait avoir puisqu'on est en mode edit)
    if(rows.length > 0) {
      res.setHeader('Content-Type', 'application/json');    
      res.send(JSON.stringify(rows[0]));      
    }
   }
        else
    console.log('Error while performing Query.');      

    }); 
  
});


/* Ancienne version : 

router.get("/:id",function(req,res)
{
  resultatFinal : {}; 

  db.query('SELECT po.id AS post_id, po.title AS post_title, po.content AS post_content, ta.id AS tag_id, ta.name AS tag_name, cat.id AS cat_id, cat.name AS cat_name, cat.color AS cat_color from elementposts po LEFT JOIN elements_a_tags pota ON pota.post_id = po.id LEFT JOIN tags ta ON pota.tag_id = ta.id LEFT JOIN categories cat ON ta.category_id = cat.id WHERE po.id = "' + req.params.id + '"', function(err, rows, fields) {
  if (!err) {
    console.log('>> The solution is: ', rows);

    // Si on a des résultats (ce qu'on devrait avoir puisqu'on est en mode edit)
    if(rows.length > 0) {
      console.log('On a des resultats');

      resultatFinal = {
        id: req.params.id,
        title: rows[0].post_title,
        content: rows[0].post_content,
        tags : []
      };

      // On regarde si on a des tags / Comme on fait une mega jointure, faut juste regarder si le tag de la premiere ligne est NULL (si elle l'est, on a pas de tags associés)
      if (rows[0].tag_id != null){
        // On parcourt les tags pour les ajouter au résultat final
        for(var i=0; i<rows.length; i++) {
          resultatFinal['tags'][i] = {
            id : rows[i].tag_id,
            name : rows[i].tag_name,
            category: {
                id: rows[i].cat_id,
                name: rows[i].cat_name,
                color: rows[i].cat_color
            }}; 
        };         
      }      
    }

    res.setHeader('Content-Type', 'application/json');    
    res.send(JSON.stringify(resultatFinal));
  }
  else
    console.log('Error while performing Query.');
  });
});
*/

/*
router.put('/', function(req, res) {
    res.set('Content-Type', 'application/json');

    if (req.body.post)

    res.status(201);
    res.json(req.body);

   var sql = 'UPDATE elementposts SET `title` = \'' + mysql_real_escape_string(req.body.post.title) + '\', `content` = \'' + mysql_real_escape_string(req.body.post.content) + '\'  WHERE id = ' + req.body.post.id;
   var query = db.query(sql, function(err, result) {
     if (err) {
       console.error(err);
       return res.send(err);
     } else {
        console.error('UPDATE POST OK');
     }
    });
});

*/







module.exports = router;

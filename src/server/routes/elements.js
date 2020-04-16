var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var db = require('../db');
var async = require("async");



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


router.put('/update', function(req, res) {

  res.set('Content-Type', 'application/json');
  console.log('update element'); 
  console.log(req.body);

  switch(req.body.typeelement_id){
    case 1: // post    
      if (req.body.data.title && req.body.data.content){
        var sql = "UPDATE elementposts SET title = \'" + mysql_real_escape_string(req.body.data.title) + "\', content = \'" + mysql_real_escape_string(req.body.data.content) + "\' WHERE id=" + req.body.data.id; 
           var query = db.query(sql, function(err, result) {
             if (err) {
               console.error(err);
               return res.send(err);
             } else {
                console.log('UPDATE element to trash OK');
                  res.send(JSON.stringify(req.body)); 

             }
            });          
      }
    break; 

  }
  /*var sql = "UPDATE elements SET trash = 1 WHERE id=" + req.body.id; 
   var query = db.query(sql, function(err, result) {
     if (err) {
       console.error(err);
       return res.send(err);
     } else {
        console.log('UPDATE element to trash OK');
          res.send(JSON.stringify(req.body)); 

     }
    });  
  */
});

router.put('/recycle', function(req, res) {

  res.set('Content-Type', 'application/json');
  console.log('sup element'); 
  console.log(req.body);


  // Restera à faire la mise à jour mettre le trash à 1 pour l'élément

  var sql = "UPDATE elements SET trash = 1 WHERE id=" + req.body.id; 
   var query = db.query(sql, function(err, result) {
     if (err) {
       console.error(err);
       return res.send(err);
     } else {
        console.log('UPDATE element to trash OK');
          res.send(JSON.stringify(req.body)); 

     }
    });  
  
});


// NEW Récupération de tous les éléments sync !

router.get('/',function(req,res, next) {
  console.log('NEW On récupère les elements !');
  
  var resultatFinal = [];
  var indiceResultatFinalActuel = -1;


    // Or, with named functions:
    async.waterfall([
        getElements,
        getData
    ], function (err, result) {
        // result now equals 'done'
    /*    console.log('tout est terminé'); 

    console.log('resultatFinal'); 
    console.log(resultatFinal); */
    res.setHeader('Content-Type', 'application/json');    
    res.send(JSON.stringify(resultatFinal));        
    });

    function getElements(callback) {
        console.log('on récupère les éléments'); 

// NEW

  // On va regarder dans quelle table on doit aller chercher les infos
  db.query('SELECT el.id AS el_id, el.trash AS el_trash, el.created AS el_created, el.typeelement_id AS el_typeelementid, eat.tag_id AS tag_id, ta.name AS tag_name, ta.category_id AS tag_categoryid, cat.name AS cat_name, cat.color AS cat_color FROM `elements` el LEFT JOIN elements_a_tags eat ON el.id = eat.element_id LEFT JOIN tags ta ON eat.tag_id = ta.id LEFT JOIN categories cat ON ta.category_id = cat.id WHERE el.trash = 0 ORDER BY el.id DESC', function(err, rows, fields) {
  if (!err) {
    var pending = rows.length; 

    // console.log('The solution is: ', rows);
    // res.setHeader('Content-Type', 'application/json');    
    // res.send(JSON.stringify(rows));

    var idElementActuel = -1;
    var indiceResultatFinalActuel = -1; 
    var indiceTagActuel = 0; 

    for(var i=0; i<rows.length; i++){
      // console.log(rows[i]['el_id']);       

      if(idElementActuel != rows[i]['el_id']){
        
        indiceResultatFinalActuel++; 
        indiceTagActuel = 0; 
        resultatFinal[indiceResultatFinalActuel] = {}; 
        resultatFinal[indiceResultatFinalActuel]['ref'] = 'element';
        resultatFinal[indiceResultatFinalActuel]['id'] = rows[i]['el_id'];
        resultatFinal[indiceResultatFinalActuel]['typeelement_id'] = rows[i]['el_typeelementid'];
        resultatFinal[indiceResultatFinalActuel]['created'] = rows[i]['el_created'];
        resultatFinal[indiceResultatFinalActuel]['tags'] = [];        
        
        idElementActuel = rows[i]['el_id']; 
      }

      // console.log('Tag en cours : ' + rows[i]['tag_id']); 
      if(rows[i]['tag_id'] != null){
        resultatFinal[indiceResultatFinalActuel]['tags'][indiceTagActuel] = { id : rows[i]['tag_id'], name : rows[i]['tag_name'], category_id : rows[i]['tag_categoryid'], category : { id: rows[i]['tag_categoryid'], name: rows[i]['cat_name'], color : rows[i]['cat_color'] } };
        indiceTagActuel++;         
      }

      if( 0 === --pending ){
        console.log('tout est traité => CB'); 
        callback(null);
      }      
    }    




    }
  }); 
}

    function getData(callback) {
        // arg1 now equals 'one' and arg2 now equals 'two'
       /* console.log('on récupère la data'); 
        console.log('resultatFinal actuel : ');
        console.log(resultatFinal);
*/
        var pending = resultatFinal.length; 

        // on parcourt les elements et on sous requete selon le type d'élément
        resultatFinal.forEach(function(element){

/*
          console.log('> element  : ' + element); 
          console.log('> Requete pour element id : ' + element['id']); 
          console.log('>> Type element id : ' + element['typeelement_id']); 
*/
          switch(element['typeelement_id']){

            case 1:
              console.log('>>> Elément post - on récupère les infos');

                   db.query('SELECT * FROM `elementposts` WHERE element_id=' + element['id'], function(errPost, rowsPost, fieldsPost) {
                    if(!errPost){
                      if (rowsPost.length > 0){

//        console.log('>> IN SQL >> resultatFinal actuel : indice : ');
 //       console.log(resultatFinal);


                          // console.log('>>>> On claque pour id ' + rowsPost[i]['id']) ;
   //                       console.log(rowsPost); 
                          element['data'] = rowsPost[0];   
    
                          if( 0 === --pending ){
                            console.log('tout est traité => CB'); 
                            callback(null);
                          }                      
                      }
                    }
                   });               

              // resultatFinal[i]['data'] = { name: 'post !' }; 
            break; 

          }


        });  
    }
});  







// ELEMENTS

router.post('/addtag', function(req, res) {

  console.log('On fait un post add tag !'); 
  console.log(req.body); 
  console.log(req.body.tag_id); 
  console.log(req.body.post_id); 
  console.log(req.body.element_id); 
  console.log('Bien ajouter le element_id et pas le post_id !'); 

  res.set('Content-Type', 'application/json');

  if ( (req.body.tag_id) && (req.body.element_id)) {

    // On va checker si l'élément est déjà lié au tag ou pas ? 
      // Maintenant on va récupérer le nom des colonnes pour construire la requete finale (et pouvoir différencier les ID lors de la jointure)
      sqlCount = 'SELECT COUNT(*) as total FROM `elements_a_tags` WHERE element_id = ' + req.body.element_id + ' AND tag_id = ' + req.body.tag_id ;
      console.log('Requete SQL : ' + sqlCount);  
      db.query(sqlCount, function(err, rows, fields) {
        if (!err) {
          if (rows[0]['total'] == 0){
            var sql = 'INSERT INTO elements_a_tags (`element_id`, `tag_id`) VALUES (' + req.body.element_id + ',' + req.body.tag_id + ')';
            var query = db.query(sql, function(err2, result) {
                if (err2) {
                 console.error(err2);
                 return res.send(err2);
                } else {
                  console.error('INSERT INTO elements_a_tags OK');    
                }
            });          
          } else {
            console.log('Element est taggé par ce tag !'); 
          }
        }
      }); 
  }
}); 


router.get("/getTags/:id",function(req,res)
{
  console.log('On est dans le getTags ! pour id : ');
  console.log(req.params.id); 

  // resultatFinal : {}; 

//   db.query('SELECT po.id AS post_id, po.title AS post_title, po.content AS post_content, ta.id AS tag_id, ta.name AS tag_name, cat.id AS cat_id, cat.name AS cat_name, cat.color AS cat_color from elementposts po LEFT JOIN elements_a_tags pota ON pota.post_id = po.id LEFT JOIN tags ta ON pota.tag_id = ta.id LEFT JOIN categories cat ON ta.category_id = cat.id WHERE po.id = "' + req.params.id + '"', function(err, rows, fields) {
db.query('SELECT ta.id AS tag_id, ta.name AS tag_name, cat.id AS cat_id, cat.name AS cat_name, cat.color AS cat_color  FROM `elements_a_tags` eat INNER JOIN tags ta ON eat.tag_id = ta.id LEFT JOIN categories cat ON ta.category_id = cat.id WHERE element_id = ' + req.params.id + ' ORDER BY cat_name ASC',  function(err, rows, fields) {

  if (!err) {
    // console.log('>> The solution is: ', rows);

    // Si on a des résultats (ce qu'on devrait avoir puisqu'on est en mode edit)
    if(rows.length > 0) {
      console.log('On a des resultats');

      /*resultatFinal = {
        tags : []
      };*/
      resultatFinal = []; 

      // On regarde si on a des tags / Comme on fait une mega jointure, faut juste regarder si le tag de la premiere ligne est NULL (si elle l'est, on a pas de tags associés)
      if (rows[0].tag_id != null){
        // On parcourt les tags pour les ajouter au résultat final
        for(var i=0; i<rows.length; i++) {
          resultatFinal[i] = {
            id : rows[i].tag_id,
            name : rows[i].tag_name,
            category: {
                id: rows[i].cat_id,
                name: rows[i].cat_name,
                color: rows[i].cat_color
            }}; 
        };         
      }      
    res.setHeader('Content-Type', 'application/json');    
    res.send(JSON.stringify(resultatFinal));
    }
  }
  else
    console.log('Error while performing Query.');
  });
});



// Nouvelle version récupérer les elements par type
router.get('/elementsByType/:elementtype_id',function(req,res, next) {
  console.log('On récupère les elements par type !');
  console.log('Type element : ' + req.params.elementtype_id);  

  var sql='';
  
  if ((req.params.elementtype_id) && (req.params.elementtype_id > 0)) {

    var tableQuery = '';  
    var resultatFinal = []; 

    // On va regarder dans quelle table on doit aller chercher les infos
    db.query('SELECT db_table AS dbtable FROM typeelements WHERE id=' + req.params.elementtype_id, function(err, rows, fields) {
    if (!err) {
      // console.log('The solution is: ', rows);
      // res.setHeader('Content-Type', 'application/json');    
      // res.send(JSON.stringify(rows));
      var tableQuery = rows[0]['dbtable'];  

      // Maintenant on va récupérer le nom des colonnes pour construire la requete finale (et pouvoir différencier les ID lors de la jointure)
      sql = 'SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = \'' + tableQuery + '\'';
      console.log('Requete SQL : ' + sql);  
      db.query(sql, function(err2, rows2, fields) {
      if (!err2) {
        /*res.setHeader('Content-Type', 'application/json');    
        res.send(JSON.stringify(rows2));*/
        console.log('Resultats colonnes: '); 
        console.log(rows2);

        var sqlFinal = 'SELECT ';

        for(var i=0; i<rows2.length; i++){
          console.log(rows2[i]['COLUMN_NAME']);
          sqlFinal += 't1.' + rows2[i]['COLUMN_NAME'] + ', ';
        } 

        sqlFinal += 't2.id AS elt_id, t2.user_id, t2.created FROM ' + tableQuery + ' t1 INNER JOIN elements t2 ON t1.element_id = t2.id ORDER BY t1.id ASC'; 
        console.log('SQL FINAL : ' + sqlFinal); 

        // Mainetnant on exécute la requete pour avoir du resultat !
        db.query(sqlFinal, function(err3, rows3, fields) {
        if (!err3) {

/*          for(var i=0; i<rows3.length; i++){
            resultatFinal[i] = { donnees : rows3[i], tags : []}; 
            console.log(resultatFinal[i]); 
            console.log(resultatFinal[i].tags); 
            // resultatFinal[i] = rows3[i];

            db.query('SELECT ta.id AS tag_id, ta.name AS tag_name, cat.id, cat.name, cat.color FROM `elements_a_tags` eat INNER JOIN tags ta ON eat.tag_id = ta.id LEFT JOIN categories cat ON ta.category_id = cat.id WHERE element_id = ' + rows3[i]['element_id'], function(err4, rows4, fields4) {

              if (!err4) {
                console.log('On a du tag !'); 
                console.log(rows4); 
                console.log(resultatFinal[i]);
                console.log(resultatFinal[i].tags = rows4 );
                // resultatFinal[i].tags = {};

                // resultatFinal[i].tags = { toto : 'mescouilles' };
                // resultatFinal[i]['tags'] = rows4; 
              }

            }); 
          }

          console.log('resultatFinal'); 
          console.log(resultatFinal); 
*/
          res.setHeader('Content-Type', 'application/json');    
          res.send(JSON.stringify(rows3));
        }
        else
          console.log('Err 3 - Error while performing Query.');
        });
      }
      else
        console.log('Err 2 - Error while performing Query.');
      });       



/*
      // sql = 'SELECT * FROM ' + tableQuery + ' t1 INNER JOIN elements t2 ON t1.element_id = t2.id ORDER BY t1.id ASC';
      sql = 'SELECT * FROM ' + tableQuery + ' t2 INNER JOIN elementposts t1  ON t1.element_id = t2.id ORDER BY t2.id ASC'; 
      db.query(sql, function(err2, rows2, fields) {
      if (!err2) {
        res.setHeader('Content-Type', 'application/json');    
        res.send(JSON.stringify(rows2));
      }
      else
        console.log('Error while performing Query.');
      });  */    
    }
    else
      console.log('Err 1 - Error while performing Query.');
    });    


  }

});






router.put('/deletetag', function(req, res) {

  res.set('Content-Type', 'application/json');

  if ( (req.body.tag_id) && (req.body.element_id)) {
    var sql = 'DELETE FROM elements_a_tags WHERE `element_id` = ' + req.body.element_id + ' AND `tag_id` = ' + req.body.tag_id;
    var query = db.query(sql, function(err, result) {
        if (err) {
         console.error(err);
         return res.send(err);
        } else {
          console.error('DELETE FROM elements_a_tags OK');    
        }
    });
  }
});




router.post('/addtag', function(req, res) {

  console.log('On fait un post add tag !'); 
  console.log(req.body); 
  console.log(req.body.tag_id); 
  console.log(req.body.post_id); 
  console.log(req.body.element_id); 
  console.log('Bien ajouter le element_id et pas le post_id !'); 

  res.set('Content-Type', 'application/json');

  if ( (req.body.tag_id) && (req.body.post_id)) {
    var sql = 'INSERT INTO elements_a_tags (`element_id`, `tag_id`) VALUES (' + req.body.element_id + ',' + req.body.tag_id + ')';
    var query = db.query(sql, function(err, result) {
        if (err) {
         console.error(err);
         return res.send(err);
        } else {
          console.error('INSERT INTO POSTS OK');    
        }
    });
  }
});



/*
router.put('/deletetag', function(req, res) {

  console.log('On fait un post delete tag !'); 
  console.log(req.body); 
  console.log(req.body.tag_id); 
  console.log(req.body.post_id); 
  console.log(req.body.element_id); 
  console.log('Bien supprimer le element_id et pas le post_id !'); 

  res.set('Content-Type', 'application/json');

  if ( (req.body.tag_id) && (req.body.post_id)) {
    var sql = 'DELETE FROM elements_a_tags WHERE `element_id` = ' + req.body.element_id + ' AND `tag_id` = ' + req.body.tag_id;
    var query = db.query(sql, function(err, result) {
        if (err) {
         console.error(err);
         return res.send(err);
        } else {
          console.log('DELETE FROM POSTS OK');    
        }
    });
  }
});
*/




// Ajouter un élément
  // But du jeu : renvoyer un json avec l'élément insérer (avec le last id et tout le tralala)

router.post('/', function(req, res) {
  console.log('Server.js add contact'); 
  console.log(req.body); 

  var resultatFinal = req.body;




  // Identifier quel type d'élément on est censé insérer ? 

  if (req.body.elementtype_id > 0) {
    let elementtype = req.body.elementtype_id; 
    console.log('Element type : '); 
    console.log(req.body.elementtype_id); 

    // 1 - On créée un nouvel élément  // la value 1 correspond au typeelement pour les posts
    var sqlInsertElement = 'INSERT INTO elements (`typeelement_id`, `user_id`) VALUES (' + elementtype + ', \'' + req.body.user_id + '\')';
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
            if (!err) {

              var lastid = rows[0]['LASTID']; 

              // On met à jour le résultat final avec le ID inséré !
              resultatFinal.id = lastid; 
              resultatFinal.ref = 'element'; 
              resultatFinal.data.element_id = lastid; 
              resultatFinal.typeelement_id = elementtype; 
              var sqlElement = ''; 

              // On va checker quel type d'élement on est censé insérer 
              switch(elementtype){

                case 1: // posts
                  sqlElement = 'INSERT INTO elementposts (`element_id`, `title`, `content`) VALUES (' + lastid + ',\'' + mysql_real_escape_string(req.body.data.title) + '\',\'' + mysql_real_escape_string(req.body.data.content) + '\')';
                break; 

                default: 
                  console.log('Cas non défini');
              }

              // Exécution de la requete 
              // On insère dans la table posts, en incluant le element_id 
              if (sqlElement.length > 0){ // On a une requete à exécuter

                var query = db.query(sqlElement, function(err, result) {
                   if (!err) {
                      // Finalement, il va rester à insérer les tags éventuels !
                      if ( (req.body.tags) && (req.body.tags.length > 0)) {
                        console.log('On a des tags à insérer'); 
  
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
                      else {
                        console.log('Pas de tags à insérer !');                       
                      }
                    // A la fin on renvoie le résultat final :
                      res.set('Content-Type', 'application/json');
                      res.status(201);
                      res.json(resultatFinal);
                   } else {
                     console.error(err);
                     return res.send(err);
                }}); 
              }
              else {
                console.log('Requete non valide'); 
              }
            }
          });     
      }
    }); 
  }
  else {
    console.error('On ne sait pas quel type d\'élément on est censé insérer !'); 
    return res.send('On ne sait pas quel type d\'élément on est censé insérer !');
  }
}); 






router.delete('/:id', function(req, res) {
  console.log('Server.js delete element'); 
  console.log(req.params);

  res.set('Content-Type', 'application/json');
  console.log('ID : ' + req.params.id); 

  res.status(201);
  res.json(req.params);

  // 1 - On va regarder quel type d'élément on doit suppprimer (post, etc.)
  db.query('SELECT * FROM elements WHERE id =' + req.params.id , function(err, rows, fields) {
  if (!err)  {
    console.log('The solution is: ', rows);
    console.log('On recupere le elementtype'); 
    console.log(rows[0]['typeelement_id']); 

    if(rows[0]['typeelement_id'] > 0){
      var sqlDeleteElementType = ''; 
      switch(rows[0]['typeelement_id']){
        case 1: 
          sqlDeleteElementType = 'DELETE FROM elementposts WHERE element_id = \'' + req.params.id + '\''; 
        break; 

        default:
          console.log('other'); 
      }
      console.log(sqlDeleteElementType); 

      if(sqlDeleteElementType.length > 0){
        // On exécute la requête :
        db.query(sqlDeleteElementType, function(err2, result) {
          if (err2) {
            console.err2or(err2);
            return res.send(err2);
          } else {
            console.log('OK - Elementtype supprimé'); 

            // 2 - On va supprimer les tags liés 
            console.log('Suppression des tags pour element_id ' + req.params.id); 
            db.query('DELETE FROM elements_a_tags WHERE element_id = \'' + req.params.id + '\'', function(err, result) {
              if (err) {
                console.error(err);
                return res.send(err);
              } else {
                console.log('OK - Tags / Element supprimés'); 
                // On supprime maintenant l'élément en lui meme 
                db.query('DELETE FROM elements WHERE id = \'' + req.params.id + '\'', function(err2, result) {
                  if (err2) {
                    console.err2or(err2);
                    return res.send(err2);
                  } else {
                    console.log('OK - Element supprimé'); 
                  }
                });
              }
            });            
          }
        });        
      }
    }

    // res.setHeader('Content-Type', 'application/json');    
    // res.send(JSON.stringify(rows));
  }
  else
    console.log('Error while performing Query.');
  });






});




// Get element (id : number = id de l'élément) 
// => charge l'élément id 

router.get("/:id",function(req,res)
{
  resultatFinal : {}; 

//   db.query('SELECT po.id AS post_id, po.title AS post_title, po.content AS post_content, ta.id AS tag_id, ta.name AS tag_name, cat.id AS cat_id, cat.name AS cat_name, cat.color AS cat_color from elementposts po LEFT JOIN elements_a_tags pota ON pota.post_id = po.id LEFT JOIN tags ta ON pota.tag_id = ta.id LEFT JOIN categories cat ON ta.category_id = cat.id WHERE po.id = "' + req.params.id + '"', function(err, rows, fields) {
db.query('SELECT po.id AS post_id, po.title AS post_title, po.content AS post_content, po.element_id AS element_id, ta.id AS tag_id, ta.name AS tag_name, cat.id AS cat_id, cat.name AS cat_name, cat.color AS cat_color from elementposts po LEFT JOIN elements_a_tags eat ON eat.element_id = po.element_id LEFT JOIN tags ta ON eat.tag_id = ta.id LEFT JOIN categories cat ON ta.category_id = cat.id WHERE po.id = "' + req.params.id + '"', function(err, rows, fields) {

  if (!err) {
    // console.log('>> The solution is: ', rows);

    // Si on a des résultats (ce qu'on devrait avoir puisqu'on est en mode edit)
    if(rows.length > 0) {
      // console.log('On a des resultats');

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




// Nouvelle version 
/*
router.get("/:id",function(req,res)
{
  resultatFinal : {}; 

//   db.query('SELECT po.id AS post_id, po.title AS post_title, po.content AS post_content, ta.id AS tag_id, ta.name AS tag_name, cat.id AS cat_id, cat.name AS cat_name, cat.color AS cat_color from elementposts po LEFT JOIN elements_a_tags pota ON pota.post_id = po.id LEFT JOIN tags ta ON pota.tag_id = ta.id LEFT JOIN categories cat ON ta.category_id = cat.id WHERE po.id = "' + req.params.id + '"', function(err, rows, fields) {
db.query('SELECT po.id AS post_id, po.title AS post_title, po.content AS post_content, po.element_id AS element_id, ta.id AS tag_id, ta.name AS tag_name, cat.id AS cat_id, cat.name AS cat_name, cat.color AS cat_color from elementposts po LEFT JOIN elements_a_tags eat ON eat.element_id = po.element_id LEFT JOIN tags ta ON eat.tag_id = ta.id LEFT JOIN categories cat ON ta.category_id = cat.id WHERE po.id = "' + req.params.id + '"', function(err, rows, fields) {

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










router.put('/', function(req, res) {
    res.set('Content-Type', 'application/json');
    res.status(201);
    res.json(req.body);

    // On teste ce qu'on a à mettre à jour selon le type d'élément
    if(req.body.element.elementtype_id > 0){

      var sql = ''; 

      switch(req.body.element.elementtype_id){
        case 1:
           sql = 'UPDATE elementposts SET `title` = \'' + mysql_real_escape_string(req.body.element.data.title) + '\', `content` = \'' + mysql_real_escape_string(req.body.element.data.content) + '\'  WHERE id = ' + req.body.element.data.id + ' AND element_id = '+ req.body.element.data.element_id ;
        break; 

        default:
          console.log('Autre type'); 
      }

      if (sql.length > 0){
        // On a une requete à exécuter dans la table correspondant au type d'element : 
         var query = db.query(sql, function(err, result) {
           if (err) {
             console.error(err);
             return res.send(err);
           } else {
              console.log('UPDATE ELEMENT TYPE TABLE OK');
           }
          });        
      }      
    }



/*
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
    */
    

});









module.exports = router;

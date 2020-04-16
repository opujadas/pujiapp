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



function getNodeId(id){

  console.log('[getNodeId] On est sur le noeud ID : ' + id); 

  db.query('SELECT * FROM views WHERE id = ' + id, function(err, rows, fields) {

  if (!err) {    
    // res.setHeader('Content-Type', 'application/json');    
    // res.send(JSON.stringify(rows));
    if (rows.length == 0) {
        // console.log('=> pas enfant');        
        return null;
    }      
    else {
        console.log('On a un nom pour le ' + id); 
        console.log(rows); 

        // console.log(rows[0]); 
        return rows;
      }
  }
  else
    console.log('Error while performing Query.');
}); 
}
  



function getChildren(id){

  res = {}; 
  // res['view'] = {}; 

  console.log('[getChildren] On est sur le noeud ID : ' + id); 
  console.log('[getChildren] On affiches les infos du noeud ' + id); 
  // console.log(getNodeId(id)); 
  var toto = getNodeId(id); 
  
  console.log('toto'); 
  console.log(toto); 

  res['view'] = {}; 
  res['view'] = toto; 
  console.log('view');
   console.log(res);

  db.query('SELECT * FROM views WHERE parent_id = ' + id, function(err, rows, fields) {

  if (!err) {    
    // res.setHeader('Content-Type', 'application/json');    
    // res.send(JSON.stringify(rows));
    if (rows.length == 0) {
        // console.log('=> pas enfant');        
    }
      
    else {
      console.log('On a des enfants, on rappelle la fonction pour les enfants de ' + id); 
      for(i=0; i<rows.length; i++){

        // console.log('<Noeud : ' + rows[i]['name'] + '>'); 

        // On rappelle la fonction pours les enfants 
        getChildren(rows[i]['id']);
      }
    }
  }
  else
    console.log('Error while performing Query.');
  });
}


/**
  -------------------------------  ZONE DE TEST / RECURSIVE ------------------------------------------ 
**/

router.get('/test',function(req,res, next) {
  console.log('TEST !'); 

  return getChildren(0);

  /*
  db.query('SELECT * FROM views ORDER BY id ASC', function(err, rows, fields) {
  if (!err) {    
    res.setHeader('Content-Type', 'application/json');    
    res.send(JSON.stringify(rows));
  }
  else
    console.log('Error while performing Query.');
  });*/
});

/**
    ------------------------------ FIN ZONE DE TEST / RECURSIVE -------------------------------------
**/









/**
    Route pour récupérer les vues    
    GET => renvoie toute les vues triées par id ASC
**/

router.get('/',function(req,res, next) {
  console.log('On récupère les vues !'); 
  db.query('SELECT * FROM views ORDER BY id ASC', function(err, rows, fields) {
  if (!err) {    
    res.setHeader('Content-Type', 'application/json');    
    res.send(JSON.stringify(rows));
  }
  else
    console.log('Error while performing Query.');
  });
});


/**
    Route pour ajouter une vue
    Params :            req.body
    Méthode POST :      Permet de créer la vue avec 
                            - Nom :                   req.body.name
                            - ID du parent :          req.body.parent_id
**/

router.post('/', function(req, res) {
//   console.log('Server.js add view'); 
//   console.log(req.body); 

  res.set('Content-Type', 'application/json');

  // 1 - On créée un nouvel élément  // la value 1 correspond au typeelement pour les posts
  var sqlInsertElement = 'INSERT INTO views (`name`, `parent_id`) VALUES (\'' + mysql_real_escape_string(req.body.name) + '\',' + req.body.parent_id + ')';
  var query = db.query(sqlInsertElement, function(err, result) {
     if (err) {
       console.error(err);
       return res.send(err);
     } 
     else {        
        console.log('Nouvel élément inséré - On récupère son ID'); 
        // On va maintenant regarder le dernier id inséré, et faire les bons inserts pour les tags
        var sqlViewId = "SELECT LAST_INSERT_ID() AS LASTID;";
        db.query(sqlViewId, function(err, rows, fields) {
        if (!err)  {
          var lastid = rows[0]['LASTID']; 
          // console.log('Id : element inséré :  ' + lastid); 
          // On met le dernier id pour renvoyer l'objet fini
          req.body.id = lastid;           
          res.status(201);
          res.json(req.body);

          // On va maintenant faire les bons inserts pour les tags
          for (var i=0; i<req.body.tags.length; i++) {
            var insert = "INSERT INTO views_a_tags (view_id, tag_id) VALUES (" + lastid + "," + req.body.tags[i].id + ")"; 
            var query = db.query(insert, function(err2, result2) {
               if (err2) {
                 console.error(err2);
                 return res.send(err2);
                } else {
                  console.error('INSERT INTO views_a_tags OK');
                }
            }); 
          }
        }         
      });
    }
  });  
});  


/**
    Route pour mettre à jour une vue
    Params :            req.body
    Méthode PUT :       Permet de mettre à jour la vue avec ID req.body.id avec : 
                            - Nom :req.body.name

**/

router.put('/', function(req, res) {
    res.set('Content-Type', 'application/json');

    console.log('update view'); 
    console.log(req.body); 
    console.log(req.body); 
    console.log(req.body.id); 
    console.log(req.body.name); 

    res.status(201);
    res.json(req.body);

   var sql = 'UPDATE views SET `name` = \'' + mysql_real_escape_string(req.body.name) + '\'  WHERE id = ' + req.body.id;
   var query = db.query(sql, function(err, result) {
     if (err) {
       console.error(err);
       return res.send(err);
     } else {
        console.error('UPDATE VIEW OK');
     }
    });
});


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
   
    db.query('DELETE FROM views WHERE id = \'' + req.params.id + '\'', function(err, result) {
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




// Recursive Nouvelle version 

function getChildrenViews(parent_id) {

  console.log('===> GET CHILDREN ' + parent_id); 
  var res = {};   
  res['id'] = parent_id;
  res['children'] = []; 
  // res['name'] = rows[i]['name'];

  //   db.query('SELECT po.id AS post_id, po.title AS post_title, po.content AS post_content, ta.id AS tag_id, ta.name AS tag_name, cat.id AS cat_id, cat.name AS cat_name, cat.color AS cat_color from views po LEFT JOIN elements_a_tags pota ON pota.post_id = po.id LEFT JOIN tags ta ON pota.tag_id = ta.id LEFT JOIN categories cat ON ta.category_id = cat.id WHERE po.id = "' + req.params.id + '"', function(err, rows, fields) {
  db.query('SELECT * FROM views WHERE parent_id = "' + parent_id + '"', function(err, rows, fields) {

    if (!err) {
      console.log('>> The solution is: ', rows);

      // Condition d'arrêt
      if (rows.length == 0){
        return res; 
      }
      else {
        for(var i=0; i<rows.length; i++){
          console.log('ROW de ' + i); 
          console.log(rows[i]); 
          res['children'][i] = getChildrenViews(rows[i]['id']);
        }
        console.log('>> Res actuel : ')
        console.log(res); 
        return res; 
      }
     }
     else
      console.log('Error while performing Query.');      
      }); 
  
}

router.get("/childrenformenu/:id",function(req,res){

      //   db.query('SELECT po.id AS post_id, po.title AS post_title, po.content AS post_content, ta.id AS tag_id, ta.name AS tag_name, cat.id AS cat_id, cat.name AS cat_name, cat.color AS cat_color from views po LEFT JOIN elements_a_tags pota ON pota.post_id = po.id LEFT JOIN tags ta ON pota.tag_id = ta.id LEFT JOIN categories cat ON ta.category_id = cat.id WHERE po.id = "' + req.params.id + '"', function(err, rows, fields) {
      db.query('SELECT id, name FROM views WHERE parent_id = "' + req.params.id + '"', function(err, rows, fields) {

        if (!err) {
          // console.log('>> The solution is: ', rows);
        res.setHeader('Content-Type', 'application/json');    
        res.send(JSON.stringify(rows));
         }
         else
          console.log('Error while performing Query.');      
          }); 

});



router.get("/children/:id",function(req,res){

      //   db.query('SELECT po.id AS post_id, po.title AS post_title, po.content AS post_content, ta.id AS tag_id, ta.name AS tag_name, cat.id AS cat_id, cat.name AS cat_name, cat.color AS cat_color from views po LEFT JOIN elements_a_tags pota ON pota.post_id = po.id LEFT JOIN tags ta ON pota.tag_id = ta.id LEFT JOIN categories cat ON ta.category_id = cat.id WHERE po.id = "' + req.params.id + '"', function(err, rows, fields) {
     
/*
      db.query('SELECT * FROM views WHERE parent_id = "' + req.params.id + '"', function(err, rows, fields) {

        if (!err) {
          console.log('>> The solution is: ', rows);
        res.setHeader('Content-Type', 'application/json');    
        res.send(JSON.stringify(rows));
         }
         else
          console.log('Error while performing Query.');      
          }); 

*/
console.log('----------XXXXXXXXXXXXXXXX----------------'); 



  db.query('SELECT id, name, user_id, created, parent_id   FROM views WHERE parent_id = "' + req.params.id + '"', function(err, rows, fields) {
  if (!err)
  {
    var resultatFinal = []; 
    // On va formatter les données en JSON qui va bien
    for(var i=0; i<rows.length; i++) {
      // console.log('>> The solution is: ', rows);
      console.log('Row : ' + i); 
      console.log(rows[i]);
      /*
      var vueEnCours = {
        id: rows[i].tag_id,
        name: rows[i].tag_name,
        ref: 'tag',
        category: {
            id: rows[i].cat_id,
            name: rows[i].cat_name,
            color: rows[i].cat_color
        }}; 

      resultatFinal.push(tagEnCours);*/
      rows[i].ref = 'view';
    }

//    console.log("resultatFinal"); 
 //   console.log(resultatFinal); 
  console.log(rows); 
    // console.log('The solution is: ', rows);
    res.setHeader('Content-Type', 'application/json');    
    res.send(JSON.stringify(rows));
  }
  else
    console.log('Error while performing Query.');
  });






});




// Ancienne foncion marche 
/* 

router.get("/children/:id",function(req,res){
  db.query('SELECT * FROM views WHERE parent_id = "' + req.params.id + '"', function(err, rows, fields) {
    if (!err) {
      console.log('>> The solution is: ', rows);
      res.setHeader('Content-Type', 'application/json');    
      res.send(JSON.stringify(rows));
     }
    else
      console.log('Error while performing Query.');      
  });   
});
*/







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
        console.log('tout est terminé'); 

    console.log('resultatFinal'); 
    console.log(resultatFinal); 
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

    console.log('The solution is: ', rows);
    // res.setHeader('Content-Type', 'application/json');    
    // res.send(JSON.stringify(rows));

    var idElementActuel = -1;
    var indiceResultatFinalActuel = -1; 
    var indiceTagActuel = 0; 

    for(var i=0; i<rows.length; i++){
      console.log(rows[i]['el_id']);       

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

      console.log('Tag en cours : ' + rows[i]['tag_id']); 
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
        console.log('on récupère la data'); 
        //console.log('resultatFinal actuel : ');
        //console.log(resultatFinal);

        var pending = resultatFinal.length; 

        // on parcourt les elements et on sous requete selon le type d'élément
        resultatFinal.forEach(function(element){

          /*console.log('> element  : ' + element); 
          console.log('> Requete pour element id : ' + element['id']); 
          console.log('>> Type element id : ' + element['typeelement_id']); 
*/
          switch(element['typeelement_id']){

            case 1:
              // console.log('>>> Elément post - on récupère les infos');

                   db.query('SELECT * FROM `elementposts` WHERE element_id=' + element['id'], function(errPost, rowsPost, fieldsPost) {
                    if(!errPost){
                      if (rowsPost.length > 0){
/*
        console.log('>> IN SQL >> resultatFinal actuel : indice : ');
        console.log(resultatFinal);


                          // console.log('>>>> On claque pour id ' + rowsPost[i]['id']) ;
                          console.log(rowsPost); 
                          */
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



router.get("/:id",function(req,res)
{
  console.log('OONEW On récupère les elements !');
  
  var resultatFinal = {};

  var indiceResultatFinalActuel = -1;


    // Or, with named functions:
    async.waterfall([
        getView,
        getViewElement,
        getViewElementTags,
        getViewElementData
        /*, getData */
    ], function (err, result) {
        // result now equals 'done'
        console.log('Tout est terminé'); 
/*
    console.log('resultatFinal'); 
    console.log(resultatFinal); */
    res.setHeader('Content-Type', 'application/json');    
    res.send(JSON.stringify(resultatFinal));        
    });




    function getView(callback){
        console.log('======= GET VIEW INFO'); 

        if (req.params.id > 0){
          db.query('SELECT vu.id AS vu_id, vu.name AS vu_name, vu.user_id AS vu_userid, vu.created AS vu_created, vu.parent_id AS vu_parentid, ta.id AS tag_id, ta.name AS tag_name, cat.id AS cat_id, cat.name AS cat_name, cat.color AS cat_color from views vu LEFT JOIN views_a_tags vat ON vat.view_id = vu.id LEFT JOIN tags ta ON vat.tag_id = ta.id LEFT JOIN categories cat ON ta.category_id = cat.id WHERE vu.id = "' + req.params.id + '"', function(err, rows, fields) {
          if (!err) {
            console.log('>> The solution is: ', rows);

            // Si on a des résultats (ce qu'on devrait avoir puisqu'on est en mode edit)
            if(rows.length > 0) {
              console.log('>On a des resultats');

              resultatFinal = {
                id: req.params.id,
                name: rows[0].vu_name,
                user_id: rows[0].vu_userid,
                parent_id: rows[0].vu_parentid,
                created: rows[0].vu_created,
                tags : [],
                elements : []

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

            callback(null);
          }
          else
            console.log('Error while performing Query.');
          });
        }
        else {
              resultatFinal = {
                id: 0,
                name: 'Vue root (tous les éléments)',
                user_id: 0,
                parent_id: 0,
                created: '99/99/9999',
                tags : [],
                elements : []
              };          

            callback(null);
        }

    }




    function getViewElement(callback) {
        console.log('====== GET VIEW ELEMENTS'); 

        console.log('on récupère les éléments de la vue'); 

        // NEW
        var sql = 'SELECT el.id, el.created, el.trash, el.typeelement_id FROM elements el JOIN elements_a_tags eat ON eat.element_id = el.id AND eat.tag_id IN ( SELECT DISTINCT tag_id FROM views_a_tags ta WHERE ta.view_id = ' + req.params.id + ' ) GROUP BY el.id HAVING COUNT( DISTINCT eat.tag_id ) = (SELECT COUNT(tag_id) as total FROM views_a_tags WHERE view_id = ' + req.params.id + ') AND el.trash=0 ORDER BY el.id DESC';
        if(resultatFinal['tags'].length == 0)
          sql = 'SELECT el.id, el.created, el.trash, el.typeelement_id FROM elements el WHERE el.trash=0 ORDER BY el.id DESC';
        
        console.log('Requete SQL : '); 
        console.log(sql);

          // On va regarder dans quelle table on doit aller chercher les infos
          db.query(sql, function(err, rows, fields) {
          if (!err) {
            var pending = rows.length; 

            console.log('The solution is: ', rows);
            // res.setHeader('Content-Type', 'application/json');    
            // res.send(JSON.stringify(rows));

            if(rows.length > 0){

              for(var i=0; i<rows.length; i++){
                console.log(rows[i]['el_id']);       

                resultatFinal['elements'][i] = {}; 
                resultatFinal['elements'][i]['ref'] = 'element';
                resultatFinal['elements'][i]['id'] = rows[i]['id'];
                resultatFinal['elements'][i]['typeelement_id'] = rows[i]['typeelement_id'];
                resultatFinal['elements'][i]['created'] = rows[i]['created'];
                resultatFinal['elements'][i]['tags'] = [];                      

                if( 0 === --pending ){
                  console.log('==> On passe à la fcontion suivante !'); 
                  callback(null);
                }      
              }
            } else {
                  console.log('Pas element...'); 
                  console.log('==> On passe à la fcontion suivante !'); 
                  callback(null);
                                    
            }    
        }
      }); 
    }


    function getViewElementTags(callback) {
        console.log('====== GET ELEMENTS TAGS'); 
        var pending = resultatFinal['elements'].length;  
        console.log('On a ' + pending + ' éléments'); 

        if(pending == 0){
          console.log('Pas element, on sort !'); 
          callback(null); //callback if all queries are processed
        } else {

          var RES = resultatFinal;


          var nbIndiceTraites = 0; //  = resultatFinal['elements'].length; 

          resultatFinal['elements'].forEach(function(element){

            console.log('Nombre indices traités : ' + nbIndiceTraites); 
            // recuperation tags de l'element : 
            console.log("recuperation tags de l'element : " + element.id);  
            // Requete pour récupérer les infos des tags 

            var sql = 'SELECT ta.id AS tag_id, ta.name AS tag_name, cat.id AS cat_id, cat.name AS cat_name, cat.color AS cat_color  FROM `elements_a_tags` eat INNER JOIN tags ta ON eat.tag_id = ta.id LEFT JOIN categories cat ON ta.category_id = cat.id WHERE element_id = ' + element.id + ' ORDER BY cat_name ASC'; 

            db.query(sql, function(err, rows, fields) {
              if (!err) {
                console.log('-> je fais la requete pour chopper du tags elemnet ' + element.id); 


           //     resultatFinal['elements'][nbIndiceTraites]['tags'] = rows; // 'tags de element : ' + element.id;

                  for(var j=0; j<rows.length; j++) {
                    resultatFinal['elements'][nbIndiceTraites]['tags'][j] = {
                    // var toto = {
                      id : rows[j].tag_id,
                      name : rows[j].tag_name,
                      category: {
                          id: rows[j].cat_id,
                          name: rows[j].cat_name,
                          color: rows[j].cat_color
                      }
                    };
                  }


                // fin requete
                if( resultatFinal['elements'].length === ++nbIndiceTraites ) {
                    console.log('SORTIE DE BOUCLE +> FIN'); 
                    callback(null); //callback if all queries are processed
                }  
              };
            });  
          }); 
        }
    }


    function getViewElementData(callback){

      console.log('====== GET ELEMENTS DATA'); 
      console.log();
        console.log('on récupère la data'); 
        console.log('resultatFinal actuel : ');
        console.log(resultatFinal);

        var pending = resultatFinal['elements'].length; 

        if (pending == 0){
          console.log('no elements, on quitte la fonction');
          callback(null); 
        }
        else{


        // on parcourt les elements et on sous requete selon le type d'élément
        resultatFinal['elements'].forEach(function(element){

          console.log('> element  : ' + element); 
          console.log('> Requete pour element id : ' + element['id']); 
          console.log('>> Type element id : ' + element['typeelement_id']); 

          switch(element['typeelement_id']){

            case 1:
              console.log('>>> Elément post - on récupère les infos');

                   db.query('SELECT * FROM `elementposts` WHERE element_id=' + element['id'], function(errPost, rowsPost, fieldsPost) {
                    if(!errPost){
                      if (rowsPost.length > 0){

        console.log('>> IN SQL >> resultatFinal actuel : indice : ');
        console.log(resultatFinal);


                          // console.log('>>>> On claque pour id ' + rowsPost[i]['id']) ;
                          console.log(rowsPost); 
                          element['data'] = rowsPost[0];   
    
                      }
                      if( 0 === --pending ){
                        console.log('tout est traité => CB'); 
                        callback(null);
                      }                      
                    }
                   });               

              // resultatFinal[i]['data'] = { name: 'post !' }; 
            break; 

          }


        });  


      }

   //   callback(null); //callback if all queries are processed 
    }
/*

function getViewElement(callback){
  console.log('On récupère les éléments de la vue'); 
  console.log(resultatFinal['id']); 
  callback(null);
// SELECT el.id FROM elements el JOIN elements_a_tags eat ON eat.element_id = el.id AND eat.tag_id IN ( SELECT DISTINCT tag_id FROM views_a_tags ta WHERE ta.view_id = '27' ) GROUP BY el.id HAVING COUNT( DISTINCT eat.tag_id ) = (SELECT COUNT(tag_id) as total FROM views_a_tags WHERE view_id = '27')
}*/

});


router.put('/deletetag', function(req, res) {

  res.set('Content-Type', 'application/json');

  if ( (req.body.tag_id) && (req.body.view_id)) {
    var sql = 'DELETE FROM views_a_tags WHERE `view_id` = ' + req.body.view_id + ' AND `tag_id` = ' + req.body.tag_id;
    var query = db.query(sql, function(err, result) {
        if (err) {
         console.error(err);
         return res.send(err);
        } else {
          console.error('DELETE FROM views_a_tags OK');    
        }
    });
  }
});




router.post('/addtag', function(req, res) {

  console.log('On fait un post add tag !'); 
  console.log(req.body); 
  console.log(req.body.tag_id); 
  console.log(req.body.view_id); 

  res.set('Content-Type', 'application/json');

  if ( (req.body.tag_id) && (req.body.view_id)) {
    var sql = 'INSERT INTO views_a_tags (`view_id`, `tag_id`) VALUES (' + req.body.view_id + ',' + req.body.tag_id + ')';
    var query = db.query(sql, function(err, result) {
        if (err) {
         console.error(err);
         return res.send(err);
        } else {
          console.error('INSERT INTO views_a_tags OK');    
        }
    });
  }
});
/* Fonction pour récupérer les infos d'une vue : */



/*

router.get("/:id",function(req,res)
{
  resultatFinal : {}; 

  db.query('SELECT vu.id AS vu_id, vu.name AS vu_name, vu.user_id AS vu_userid, vu.created AS vu_created, vu.parent_id AS vu_parentid, ta.id AS tag_id, ta.name AS tag_name, cat.id AS cat_id, cat.name AS cat_name, cat.color AS cat_color from views vu LEFT JOIN views_a_tags vat ON vat.view_id = vu.id LEFT JOIN tags ta ON vat.tag_id = ta.id LEFT JOIN categories cat ON ta.category_id = cat.id WHERE vu.id = "' + req.params.id + '"', function(err, rows, fields) {
  if (!err) {
    console.log('>> The solution is: ', rows);

    // Si on a des résultats (ce qu'on devrait avoir puisqu'on est en mode edit)
    if(rows.length > 0) {
      console.log('On a des resultats');

      resultatFinal = {
        id: req.params.id,
        name: rows[0].vu_name,
        user_id: rows[0].vu_userid,
        parent_id: rows[0].vu_parentid,
        created: rows[0].vu_created,
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

   var sql = 'UPDATE views SET `title` = \'' + mysql_real_escape_string(req.body.post.title) + '\', `content` = \'' + mysql_real_escape_string(req.body.post.content) + '\'  WHERE id = ' + req.body.post.id;
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

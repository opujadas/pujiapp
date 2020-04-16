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


// CONTACTS

/***********************************************************************************************
     SITES
************************************************************************************************/

router.get("/",function(req,res)
{
  db.query('SELECT si.id, si.code_site, si.ville, si.adresse, si.region_id, re.name AS region FROM sites si LEFT JOIN regions re ON si.region_id = re.id ORDER BY si.code_site ASC', function(err, rows, fields) {
  if (!err)
  {
//    console.log('The solution is: ', rows);
    res.setHeader('Content-Type', 'application/json');    
    res.send(JSON.stringify(rows));
  }
  else
    console.log('Error while performing Query.');
  });
});



router.post('/', function(req, res)
{
      res.set('Content-Type', 'application/json');
      res.status(201);
      res.json(req.body);
      
   var query = db.query('INSERT INTO sites (`code_site`, `ville`, `adresse`, `adresse2`, `cp`, `telephone`, `region_id`) VALUES (\'' + mysql_real_escape_string(req.body.code_site) + '\', \'' + mysql_real_escape_string(req.body.ville) + '\', \'' + mysql_real_escape_string(req.body.adresse) + '\', \'' + mysql_real_escape_string(req.body.adresse2) + '\', \'' + mysql_real_escape_string(req.body.cp) + '\', \'' + mysql_real_escape_string(req.body.telephone) + '\', \'' + req.body.region_id + '\')', function(err, result) {
     if (err) {
       console.error(err);
       return res.send(err);
     } else {
             console.error('INSERT OK');
     }

  });
});


/***********************************************************************************************
     REGIONS (à laisser au dessus de la route router.get("/:id") - ordre de priorité
************************************************************************************************/

router.get("/regions",function(req,res)
{
  console.log('On select les regions !');
  db.query('SELECT * FROM regions', function(err, rows, fields) {
  if (!err)
  {
    res.setHeader('Content-Type', 'application/json');    
    res.send(JSON.stringify(rows));
  }
  else
    console.log('Error while performing Query.');
  });
});

// 

router.get("/:id",function(req,res)
{
  db.query('SELECT * from sites WHERE id = "' + req.params.id + '"', function(err, rows, fields) {
  if (!err)
  {
    console.log('>> The solution is: ', rows);
    res.setHeader('Content-Type', 'application/json');    
    // res.send(JSON.stringify({ a: rows }));
    res.send(JSON.stringify(rows));
  }
  else
    console.log('Error while performing Query.');
  });
});



router.put('/', function(req, res)
{
    res.set('Content-Type', 'application/json');
    res.status(201);
    res.json(req.body);
      
   var query = db.query('UPDATE sites SET `code_site` = \'' +  mysql_real_escape_string(req.body.Site.code_site) + '\', `ville` = \'' + mysql_real_escape_string(req.body.Site.ville) + '\', `adresse` = \'' + mysql_real_escape_string(req.body.Site.adresse) + '\', `adresse2` = \'' + mysql_real_escape_string(req.body.Site.adresse2) + '\', `cp` = \'' + mysql_real_escape_string(req.body.Site.cp) + '\', `telephone` = \'' + mysql_real_escape_string(req.body.Site.telephone) + '\', `region_id` = \'' + req.body.Site.region_id + '\'   WHERE id = ' + req.body.Id, function(err, result) {
     if (err) {
       console.error(err);
       return res.send(err);
     } else {
             console.error('UPDATE OK');
     }
    });

});



router.delete('/:id', function(req, res)
{
  console.log('Server.js delete site'); 
      res.set('Content-Type', 'application/json');
      res.status(201);
      res.json(req.body);

    // 1 - mettre à jour l'affectation du contact à un site id -1 par ex. 

    db.query('UPDATE contacts SET site_id = \'-1\' WHERE site_id = \'' + req.params.id + '\'', function(err, result) {
    if (err) 
    {
      console.error(err);
      return res.send(err);
    } 
    else 
    {
        // 2 - supprimer le site de la table sites
        db.query('DELETE FROM sites WHERE id = \'' + req.params.id + '\'', function(err, result) {
        if (err) 
        {
          console.error(err);
          return res.send(err);
        } 
        else 
        {
           console.error('DELETE SITE OK');
        }
        }); 
    }
  }); 
});





module.exports = router;

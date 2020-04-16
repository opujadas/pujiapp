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

// récupérer les contacts
router.get('/',function(req,res, next)
{
  console.log('On récupère les contacts !'); 
  db.query('SELECT co.id, co.nom, co.prenom, co.telephone, co.actif, si.code_site, si.ville, ro.name AS role, re.name AS region FROM contacts co LEFT JOIN role ro ON co.role_id = ro.id LEFT JOIN sites si ON co.site_id = si.id LEFT JOIN regions re ON si.region_id = re.id ORDER BY co.nom ASC', function(err, rows, fields) {
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


// récupérer les roles
router.get("/roles",function(req,res)
{
  db.query('SELECT * FROM role', function(err, rows, fields) {
  if (!err)
  {
    console.log('getContactRoles - The solution is: ', rows);
    res.setHeader('Content-Type', 'application/json');    
    res.send(JSON.stringify(rows));
  }
  else
    console.log('Error while performing Query.');
  });
});


// Ajouter un contact
router.post('/', function(req, res)
{
  console.log('Server.js add contact'); 

  res.set('Content-Type', 'application/json');
  res.status(201);
  res.json(req.body);

    var actif = 0; 
    if (req.body.actif)
        actif = 1; 

  var sql = 'INSERT INTO contacts (`nom`, `prenom`, `telephone`, `actif`, `role_id`, `site_id`) VALUES (\'' + mysql_real_escape_string(req.body.nom) + '\',\'' + mysql_real_escape_string(req.body.prenom) + '\',\'' + mysql_real_escape_string(req.body.telephone) + '\',' + req.body.actif + ',' + req.body.role_id + ',' + req.body.site_id + ')';
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
  console.log('Server.js delete contact'); 
  console.log(req.params);

      res.set('Content-Type', 'application/json');
      console.log('ID : ' + req.params.id); 

      res.status(201);
      res.json(req.params);
      //return res; 
      
   
    db.query('DELETE FROM contactlist_a_contact WHERE contact = \'' + req.params.id + '\'', function(err, result) {
    if (err) 
    {
      console.error(err);
      return res.send(err);
    } 
    else 
    {
        db.query('DELETE FROM contacts WHERE id = \'' + req.params.id + '\'', function(err, result) {
        if (err) 
        {
          console.error(err);
          return res.send(err);
        } 
        else 
        {
           console.error('DELETE CONTACT OK');
        }
        }); 
    }
  });
});


router.get("/:id",function(req,res)
{
  db.query('SELECT * from contacts WHERE id = "' + req.params.id + '"', function(err, rows, fields) {
  if (!err)
  {
    console.log('>> The solution is: ', rows);
    res.setHeader('Content-Type', 'application/json');    
    res.send(JSON.stringify(rows));
  }
  else
    console.log('Error while performing Query.');
  });
});



router.put('/', function(req, res)
{
    res.set('Content-Type', 'application/json');

    var actif = 0; 
    if (req.body.Contact.actif)
        actif = 1; 

    res.status(201);
    res.json(req.body);

   var sql = 'UPDATE contacts SET `nom` = \'' + mysql_real_escape_string(req.body.Contact.nom) + '\', `prenom` = \'' + mysql_real_escape_string(req.body.Contact.prenom) + '\', `telephone` = \'' + mysql_real_escape_string(req.body.Contact.telephone) + '\', `role_id` = \'' + req.body.Contact.role_id + '\', `site_id` = \'' + req.body.Contact.site_id + '\', `actif` = \'' + actif + '\'   WHERE id = ' + req.body.Id;
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

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


// CONTACT LISTS


router.get("/",function(req,res)
{
  db.query('SELECT * FROM contactlists', function(err, rows, fields) {
  if (!err)
  {
    //console.log('The solution is: ', rows);
    res.setHeader('Content-Type', 'application/json');    
    res.send(JSON.stringify(rows));
  }
  else
    console.log('Error while performing Query.');
  });
});


 
router.put('/', function(req, res)
{
  console.log('Server.js update contact'); 
  console.log(req.body);

      res.set('Content-Type', 'application/json');
      res.status(201);
      res.json(req.body);
      //return res; 
   var sql = 'UPDATE contactlists SET `nom` = \'' + mysql_real_escape_string(req.body.nom) + '\'   WHERE id = ' + req.body.id;
   console.log(sql); 
   var query = db.query(sql, function(err, result) {
     if (err) {
       console.error(err);
       return res.send(err);
     } else {

             console.error('UPDATE OK');
     }
    });

});

router.post('/', function(req, res)
{
  console.log('Server.js add contact list'); 
  console.log(req.body);

      // res.set('Content-Type', 'application/json');
      console.log('NAME : ' + req.body.name); 

      //res.status(201);
      // res.json(req.body);
      //return res; 
      
   var query = db.query('INSERT INTO contactlists (`nom`) VALUES (\'' + mysql_real_escape_string(req.body.name) + '\')', function(err, result) {
     if (err) 
     {
       console.error(err);
       return res.send(err);
     } 
     else 
     {

          db.query('SELECT id FROM contactlists ORDER BY id DESC LIMIT 1', function(err2, rows, fields) {
          if (!err2)
          {
            console.log('addContactList - The solution is: ', rows);
            console.error('INSERT OK');

            res.setHeader('Content-Type', 'application/json');    
            res.send(JSON.stringify(rows));
          }
          else
            console.log('Error while performing Query.');
          });
     }
  });

});



router.get("/getContacts/:id",function(req,res)
{
   console.log('On appelle getContactsInContactlist ');
      //res.set('Content-Type', 'application/json');
     //  console.log('NAME : '); 
     //  console.log(req.body.ville); 
      //res.status(201);
      //res.json(req.body);
console.log(req.params.id); 


  db.query('SELECT co.id, co.nom, co.prenom, co.telephone, co.actif, si.code_site, si.ville, ro.name,  re.name as region FROM `contactlist_a_contact` cac INNER JOIN contacts co ON cac.contact = co.id LEFT JOIN sites si ON co.site_id = si.id  LEFT JOIN regions re ON si.region_id = re.id LEFT JOIN role ro ON co.role_id = ro.id WHERE contactlist = "' + req.params.id + '" ORDER BY co.nom ASC', function(err, rows, fields) {
  if (!err)
  {
    // console.log('>> The solution is: ', rows);
    res.setHeader('Content-Type', 'application/json');    
    // res.send(JSON.stringify({ a: rows }));
    res.send(JSON.stringify(rows));
  }
  else
    console.log('Error while performing Query.');
  });
});


router.get("/getContactsNotIn/:id",function(req,res)
{
   console.log('On appelle getContactsNotInContactlist ');
      //res.set('Content-Type', 'application/json');
     //  console.log('NAME : '); 
     //  console.log(req.body.ville); 
      //res.status(201);
      //res.json(req.body);
console.log(req.params.id); 


  db.query('SELECT co.id, co.nom, co.prenom, co.telephone, co.actif, si.code_site, si.ville, ro.name, re.name as region FROM contacts co LEFT JOIN sites si ON co.site_id = si.id LEFT JOIN regions re ON si.region_id = re.id  LEFT JOIN role ro ON co.role_id = ro.id  WHERE co.id NOT IN (SELECT contact FROM `contactlist_a_contact` WHERE contactlist = "' + req.params.id + '")  ORDER BY co.nom ASC', function(err, rows, fields) {
  if (!err)
  {
    // console.log('>> The solution is: ', rows);
    res.setHeader('Content-Type', 'application/json');    
    // res.send(JSON.stringify({ a: rows }));
    res.send(JSON.stringify(rows));
  }
  else
    console.log('Error while performing Query.');
  });
});




router.get("/add/:contactid/:listid",function(req,res)
{
   var query = db.query('INSERT INTO contactlist_a_contact (`contact`, `contactlist`) VALUES (\'' + req.params.contactid + '\',\'' + req.params.listid + '\')', function(err, result) {
     if (err) {
       console.error(err);
       return res.send(err);
     } 
     else
     {
      res.status(200).send(JSON.stringify('INSERT OK'));
     }
  });
});


router.get("/delete/:contactid/:listid",function(req,res)
{
    var sql = 'DELETE FROM contactlist_a_contact WHERE `contact` = \'' + req.params.contactid + '\' AND `contactlist` = \'' + req.params.listid + '\''; 
    // console.log(sql); 

   var query = db.query(sql, function(err, result) {
     if (err) {
       console.error(err);
       return res.send(err);
     } 
     else
     {
      res.status(200).send(JSON.stringify('DELETE OK'));
     }
  });
});


router.delete('/:id', function(req, res)
{
      res.set('Content-Type', 'application/json');
      res.status(201);
      res.json(req.params);
  
    db.query('DELETE FROM contactlist_a_contact WHERE contactlist = \'' + req.params.id + '\'', function(err, result) {
    if (err) 
    {
      console.error(err);
      return res.send(err);
    } 
    else 
    {
        db.query('DELETE FROM contactlists WHERE id = \'' + req.params.id + '\'', function(err, result) {
        if (err) 
        {
          console.error(err);
          return res.send(err);
        } 
        else 
        {
           console.error('DELETE CONTACT LIST OK');
        }
        }); 
    }
  }); 
});


router.get("/:id",function(req,res)
{
  db.query('SELECT * from contactlists WHERE id = "' + req.params.id + '"', function(err, rows, fields) {
  if (!err)
  {
    res.setHeader('Content-Type', 'application/json');    
    res.send(JSON.stringify(rows));
  }
  else
    console.log('Error while performing Query.');
  });
});



module.exports = router;

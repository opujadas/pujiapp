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


// MESSAGES

router.get("/",function(req,res)
{
    db.query('SELECT * FROM messages', function(err, rows, fields) {
    if (!err)
    {
      res.setHeader('Content-Type', 'application/json');    
      res.send(JSON.stringify(rows));
    }
    else
      console.log('Error while performing Query.');
    });
});


router.post('/', function(req, res)
{
  console.log('Server.js add message'); 

      res.set('Content-Type', 'application/json');
      res.status(201);
      res.json(req.body);
      
   var query = db.query('INSERT INTO messages (`reftitle`, `title`, `content`) VALUES (\'' + mysql_real_escape_string(req.body.reftitle) + '\',\'' + mysql_real_escape_string(req.body.title) + '\',\'' + mysql_real_escape_string(req.body.content) + '\')', function(err, result) {
     if (err) {
       console.error(err);
       return res.send(err);
     } else {
             console.error('INSERT OK');
     }

  });
});


router.get("/:id",function(req,res)
{

  db.query('SELECT * from messages WHERE id = "' + req.params.id + '"', function(err, rows, fields) {
  if (!err)
  {
    //console.log('>> The solution is: ', rows);
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
  console.log(req.body);

  res.set('Content-Type', 'application/json');
  res.status(201);
  res.json(req.body);
  var sql = 'UPDATE messages SET `reftitle` = \'' + mysql_real_escape_string(req.body.message.reftitle) + '\', `title` = \'' + mysql_real_escape_string(req.body.message.title) + '\', `content` = \'' + mysql_real_escape_string(req.body.message.content) + '\'   WHERE id = ' + req.body.id;
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

router.delete('/:id', function(req, res)
{
      res.set('Content-Type', 'application/json');
      res.status(201);
      res.json(req.body);

    // 1 - mettre à jour l'affectation du contact à un site id -1 par ex. 

        db.query('DELETE FROM messages WHERE id = \'' + req.params.id + '\'', function(err, result) {
        if (err) 
        {
          console.error(err);
          return res.send(err);
        } 
        else 
        {
           console.error('DELETE MESSAGE OK');
        }
        }); 
});






module.exports = router;

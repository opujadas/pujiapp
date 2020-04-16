/**********************************************
                 userController.js
***********************************************/

var bcrypt = require('bcryptjs');
var email = require('emailjs');
var jwt = require('jsonwebtoken');

// Import user model
User = require('../../models/userModel');


// Handle index actions
exports.index = function (req, res) {

    User.get(function (err, users) {    
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        else {
            res.json({
                status: "success",
                message: "users retrieved successfully",
                data: users
            });            
        }
    });
};


// Handle create user actions
exports.login = function (req, res) {
    console.log('login fct'); 
    console.log(req.body); 
    console.log(req.params); 


    User.find({ $or:[ {'login':req.body.login}, {'email':req.body.login} ], 'active': true} , function (err, user) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        else {
            console.log('OK, pas erreur : resultats ?');
            console.log(user); 
            if (user.length == 0){
                console.log('User existe pas');
                res.status(401).json({
                    status: "error",
                    message: "Aucun utilisateur trouvé avec le couple mail/activationKey",
                });                
            }
            else {
                user = user[0]; 
                console.log(user); 

                  if (!bcrypt.compareSync(req.body.password, user.password)) {
                      res.status(401).json({
                          status: "error",
                          title: 'Login failed',
                          message: 'Invalid login credentials'
                      });
                  }
                  else
                  {            
                      var token = jwt.sign({user: user}, '$2a$10$iP2XpIMll4pJKJsxS.430li.lreX8YW8wlMBYFpPHStO6XGvuscF2AS', {expiresIn: 10});
                      res.status(200).json({
                          status: "success",
                          message: 'Successfully logged in',
                          token: token,
                          userid: user._id,
                          username: user.login,
                          user: user                           
                      });
                    
                  }                
            }
        }
    });




/**

  console.log('Login user'); 
//      res.set('Content-Type', 'application/json');
  //    res.status(201);
    //  res.json(req.body);
      console.log(req.body);

      db.query('SELECT * FROM users WHERE user = "' + req.body.login + '" AND active = 1' , function(err, rows, fields) {
      if (!err)
      {
        if (rows.length > 0)
        {
          console.log(rows[0]); 
          user = rows[0];
          console.log(user.password); 

          if (!bcrypt.compareSync(req.body.password, user.password)) {
              return res.status(401).json({
                  title: 'Login failed',
                  error: {message: 'Invalid login credentials'}
              });
          }
          else
          {            
              var token = jwt.sign({user: user}, '$2a$10$iP2XpIMll4pJKJsxS.430li.lreX8YW8wlMBYFpPHStO6XGvuscF2AS', {expiresIn: 10});
              res.status(200).json({
                  message: 'Successfully logged in',
                  token: token,
                  userid: user.id,
                  username: user.user,
                  user: user
                   
              });
            
          }
          
        }
        else
        {
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid login credentials'}
            });          
        }
      }
      else
        console.log('Error while performing Query.');
      });

*/

};




// Handle create user actions
exports.signup = function (req, res) {
    console.log('signup fct'); 
    
    // On doit aussi vérifier que l'adresse mail ou qyue le pseudo n'existe pas en BDD
    console.log('Check existance dans BDD ?');     
    User.find({ $or:[ {'login':req.body.login}, {'email':req.body.email} ]}, function (err, user) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        else {
            console.log('OK, pas erreur : resultats ?');
            console.log(user); 
            if (user.length == 0){
                console.log('OK, user existe pas');

                // Création d'une clé d'activation
                var activationKey = Math.random().toString(36).slice(2); 
                console.log(activationKey);

                // var sql = 'INSERT INTO users (`user`, `password`, `email`, `active`, `activationKey`) VALUES (\'' + mysql_real_escape_string(req.body.login) + '\', \'' + mysql_real_escape_string(bcrypt.hashSync(req.body.password, 10)) + '\',\'' + mysql_real_escape_string(req.body.email) + '\',0, \'' + mysql_real_escape_string(activationKey) + '\')'; 
                // console.log(sql); 
                console.log('Enregistrement nouvel user en base'); 
                var user = new User();
                user.login = req.body.login ? req.body.login : user.login;
                user.password = req.body.password ? bcrypt.hashSync(req.body.password, 10) : user.password;
                user.email = req.body.email ? req.body.email : user.email;
                user.active = false;
                user.activationKey = activationKey;
                // user.color = req.body.color;
                console.log(user); 

                // save the user and check for errors
                user.save(function (err) {
                    if (err) {

                        console.log('Savegarde Pas OK'); 
                        console.log(err); 
                        res.json({
                            status: "error",
                            message: err,
                        });
                    } 
                    else {

                        console.log('Savegarde OK'); 

                        // Envoi du mail activation
                        var server  = email.server.connect({
                           user:  "", 
                           password:"", 
                           host:  "smtp.free.fr", 
                           ssl:   true
                        });

                        var message = {
                           text:  "i hope this works", 
                           from:  "Pujiapp <no-reply@pujiapp.com>", 
                           to:    req.body.login + " <" + req.body.email + ">",
                           subject: "Pujiapp - Activation",
                           attachment: 
                           [
                              {data:`<html>
                                        Bonjour,<br><br>
                                        Merci pour votre inscription, vous êtes à 2 doigts de profiter de la magie du service pujiapp ! <br><br>
                                        
                                        http://localhost:4200/user/activate?user=` + req.body.email + `&authKey=` + activationKey + `<br><br>
                                        Activer mon compte sur Pujiapp
                                        </html>`, alternative:true}
                           ]
                        };

                        // send the message and get a callback with an error or details of the message that was sent
                        server.send(message, function(err, message) { 
                            if (err){
                                console.log('User créé, mais erreur envoi de mail');                             
                            }
                            else {
                                console.log('Message bien envoyé'); 
                            }
                        });            

                        console.log('On renvoie le user ok !'); 

                        res.json({
                        status: "success",
                        message: 'New user created!',
                        data: user
                        });
                    }
                });
            }

            else {
                console.log('Erreur, user existe déjà dans la base');
                res.json({
                    status: "error",
                    message: 'Pseudo ou email déjà utilisé'
                });                
            }
            //          

        }
    });
};




// Handle create user actions
exports.activate = function (req, res) {
    console.log('activate fct'); 

    User.find({ 'email':req.body.user, 'activationKey':req.body.key} , function (err, user) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        else {
            console.log('OK, pas erreur : resultats ?');
            console.log(user); 
            if (user.length == 0){
                console.log('OK, user existe pas');
                res.json({
                    status: "error",
                    message: "Aucun utilisateur trouvé avec le couple mail/activationKey",
                });                
            }
            else {
                // On a un user qui correspond bien !
                console.log('On a un user !');
                user = user[0]; 
                user.active = true; 
                // On va créer la vue Root du user
                var rootView = new View();
                rootView.name = "ROOT VIEW";
                rootView.user = user;
                rootView.is_rootview = true;

                // save the contact and check for errors
                rootView.save(function (errview) {
                    if (errview){
                            res.json({
                                status: "error",
                                message: errview
                            });                      
                    }
                    else {
                      console.log(rootView); 
                      user.rootview = rootView._id; 
                      console.log(user); 
                      // save the contact and check for errors
                      user.save(function (err) {
                          if (err){
                            res.json({
                                status: "error",
                                message: err
                            });                             
                          }
                          else {
                            console.log('Save OK'); 
                            console.log(user); 
                            // Renvoi OK                    
                            res.json({
                                status: "success",
                                message: 'Utilisateur bien activé',
                                data: user
                            });
                          }
                      });
                    }
                  }); 
            }
        }
    }); 
  };
// Handle view users by type 

/*

// Handle view user info

exports.view = function (req, res) {
    if (req.params.user_id){
        User.findById(req.params.user_id, function (err, user) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            else {
                res.json({
                    status: "success",
                    message: 'User details loading..',
                    data: user
                });            
            }
        }).populate({
        path : 'tags', 
        model: Tag, 
        populate: {
            path: 'category', 
            model : Categorie
        }
    }); //.populate('category');
    }
};








// Handle update user info
exports.update = function (req, res) {  
    
    if (req.body && req.body.user && req.body.user.id){
        User.findById(req.body.user.id, function (err, user) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            else {
                user.data = req.body.user.data ? req.body.user.data : user.data;
                // save the user and check for errors
                user.save(function (err) {
                    if (err)
                        res.json(err);
                    res.json({
                        status: "success",
                        message: 'User Info updated',
                        data: user
                    });
                });
            }
        });
    }
};

// Handle delete user
exports.delete = function (req, res) {
    
    console.log('delete !!');
    console.log(req.body);
    console.log(req.params);
    console.log(req.params.user_id);
    

    if (req.params && req.params.user_id){
        User.deleteOne({ _id: req.params.user_id }, function (err, user) {

            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            } else {
                res.json({
                    status: "success",
                    message: 'user deleted'
                });
            }
        }).exec();
    }
};
*/
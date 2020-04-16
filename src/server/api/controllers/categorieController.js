/**********************************************
                 categorieController.js
***********************************************/


// Import contact model
Categorie = require('../../models/categorieModel');

// Handle index actions
exports.index = function (req, res) {

    /* Categorie.get(function (err, categories) {   */
        Categorie.find({user: req.params.user_id}, function (err, categories) {    
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        else {
            res.json({
                status: "success",
                message: "categories retrieved successfully",
                data: categories
            });            
        }
    });
};

// Handle create contact actions
exports.new = function (req, res) {

    var categorie = new Categorie();
    categorie.name = req.body.name ? req.body.name : categorie.name;
    categorie.color = req.body.color;
    
    console.log(req.body.user_id); 
    categorie.user = req.body.user_id ? req.body.user_id : categorie.user;
    console.log(categorie); 

    // save the categorie and check for errors
    categorie.save(function (err) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
    res.json({
            status: "success",
            message: 'New categorie created!',
            data: categorie
        });
    });
};

// Handle view contact info

exports.view = function (req, res) {
    Categorie.findById(req.params.category_id, function (err, categorie) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }

        res.json({
            status: "success",
            message: 'Categorie details loading..',
            data: categorie
        });
    });
};

// Handle update contact info
exports.update = function (req, res) {  
    
    if (req.body && req.body.category){
        
        params = req.body.category; 
        
        Categorie.findById(params.id, function (err, categorie) {
            
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            else {
                categorie.name = params.name ? params.name : categorie.name;
                categorie.color = params.color;
                
                // save the contact and check for errors
                categorie.save(function (err) {
                    if (err)
                        res.json(err);
                    res.json({
                        status: "success",
                        message: 'Categorie Info updated',
                        data: categorie
                    });
                });
            }
        });
    }
};

// Handle delete contact
exports.delete = function (req, res) {
    
    if (req.params && req.params.category_id){
        Categorie.deleteOne({ _id: req.params.category_id }, function (err, categorie) {

            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            } else {
                res.json({
                    status: "success",
                    message: 'categorie deleted'
                });
            }
        }).exec();
    }
};

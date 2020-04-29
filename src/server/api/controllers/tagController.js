/**********************************************
                 tagController.js
***********************************************/


// Import contact model
Tag = require('../../models/tagModel');

// Handle index actions
exports.index = function (req, res) {

    // Tag.get(function (err, tags) { 
//         .sort({ 'category.name' : 'descending' })
    Tag.find({user: req.params.user_id})
        .populate({path : 'category'})
        .sort({ 'category.name' : 'ascending' })
        .exec(function(err, elements) {
           if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            else {
                console.log('Pas erreur : CHOPPAGE DE TAGS !!!!!!!!'); 
                res.json({
                    status: "success",
                    message: 'View details loading..',
                    data: elements
                });                  
            }   
        });  
};



// Handle create contact actions
exports.new = function (req, res) {

    var tag = new Tag();
    tag.name        = req.body.name ? req.body.name : tag.name;
    tag.color       = req.body.color;
    tag.category    = req.body.category;
    tag.user        = req.body.user_id ? req.body.user_id : tag.user;

    // save the tag and check for errors
    tag.save(function (err) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        } else {
            res.json({
                status: "success",
                message: 'New tag created!',
                data: tag
            });
        }
    });
};

// Handle view contact info

exports.view = function (req, res) {
    Tag.findById(req.params.tag_id, function (err, tag) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        else {
            res.json({
                status: "success",
                message: 'Tag details loading..',
                data: tag
            });
        }
    });
};

// Handle update contact info
exports.update = function (req, res) {  

    if (req.body && req.body.tag){
        
        params = req.body.tag; 
        
        Tag.findById(params.id, function (err, tag) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            else {
                tag.name = params.name ? params.name : tag.name;
                tag.category = params.category.id;
                
                // save the contact and check for errors
                tag.save(function (err) {
                    if (err)
                        res.json(err);
                    res.json({
                        status: "success",
                        message: 'Tag Info updated',
                        data: tag
                    });
                });

            }
        });
    }
};

// Handle delete contact
exports.delete = function (req, res) {

    if (req.params && req.params.tag_id){
        Tag.deleteOne({
            _id: req.params.tag_id
            }, function (err, tag) {
                if (err) {
                    res.json({
                        status: "error",
                        message: err,
                    });
                }
                res.json({
                    status: "success",
                    message: 'tag deleted'
                });
        });
    }
};

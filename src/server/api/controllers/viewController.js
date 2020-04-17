/**********************************************
                 viewController.js
***********************************************/


// Import view model
View = require('../../models/viewModel');

// Handle index actions
exports.index = function (req, res) {

    View.get(function (err, views) {    
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        else {
            res.json({
                status: "success",
                message: "views retrieved successfully",
                data: views
            });            
        }
    });
};


// Handle create view actions
exports.new = function (req, res) {

/*
var viewSchema = mongoose.Schema({
    name:       { type: String, required: true },
    parent:     { type: mongoose.Schema.Types.ObjectId, ref: 'View', required: false },
    user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    create_date: { type: Date, default: Date.now },
    update_date: { type: Date, default: Date.now },
    is_rootview: { type: Boolean, required: true, default: false }
*/

    console.log('New view'); 
    console.log(req.body);     

    var view = new View();
    view.name = req.body.name ? req.body.name : view.name;
    view.user = req.body.user_id ? req.body.user_id : view.user;
    view.parent = req.body.parent_id ? req.body.parent_id : view.parent;
    view.tags = req.body.tags ? req.body.tags : view.tags;
    view.data = req.body.data ? req.body.data : view.data;
    // view.color = req.body.color;

    // save the view and check for errors
    view.save(function (err) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        } 
        else {
            res.json({
            status: "success",
            message: 'New view created!',
            data: view
            });
        }
    });
};


// Handle view views by type 

exports.viewbytype = function (req, res) {
    if(req.params.type){
        View.find({type: req.params.type}, function (err, view) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            else {
            res.json({
                status: "success",
                message: 'View details loading..',
                data: view
            });
        /* }}).populate({path: 'tags', model : Tags, populate: {path: category, model : Category}}); */
    }}).populate({
        path : 'tags', 
        model: Tag, 
        populate: {
            path: 'category', 
            model : Categorie
        }
    });
    }
};

exports.viewchildren = function (req, res) {
    console.log('viewchildren'); 
    console.log(req.params); 
    console.log(req.params.parent_id); 


    if(req.params.parent_id){
        View.find({parent: req.params.parent_id}, function (err, views) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            else {
            res.json({
                status: "success",
                message: 'View details loading..',
                data: views
            });
        /* }}).populate({path: 'tags', model : Tags, populate: {path: category, model : Category}}); */
    }});
    }
};




// Handle view view info

exports.view = function (req, res) {
    if (req.params.view_id){
        View.findById(req.params.view_id, function (err, view) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            else {
                res.json({
                    status: "success",
                    message: 'View details loading..',
                    data: view
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


// Handle update view info
exports.addtag = function (req, res) {  
    if (req.body && req.body.tag_id && req.body.view_id){       
        View.findById(req.body.view_id, function (err, view) {            
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            else {
                if((view.tags).indexOf(req.body.tag_id) == -1){
                    view.tags.push(req.body.tag_id);

                    // save the view and check for errors
                    view.save(function (err) {
                        if (err)
                            res.json(err);
                        res.json({
                            status: "success",
                            message: 'View Info updated',
                            data: view
                        });
                    });                    
                }
            }
        });
    }
};


// Handle update view info
exports.deletetag = function (req, res) {  
    if (req.body && req.body.tag_id && req.body.view_id){
        View.findById(req.body.view_id, function (err, view) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            else {
                var index = (view.tags).indexOf(req.body.tag_id);
                if (index >= 0){
                    (view.tags).splice(index, 1);
                    
                    // Vérification et sauvegarde
                    if((view.tags).indexOf(req.body.tag_id) == -1){ // On s'assure qu'il n'est plus dans la liste !                        

                        // save the view and check for errors
                        view.save(function (err) {
                            if (err)
                                res.json(err);
                            res.json({
                                status: "success",
                                message: 'View Info updated',
                                data: view
                            });
                        });                    
                    }
                }                
            }
        });
    }
};


// Handle update view info
exports.update = function (req, res) {  
    
    if (req.body && req.body.view && req.body.view.id){
        View.findById(req.body.view.id, function (err, view) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            else {
                view.data = req.body.view.data ? req.body.view.data : view.data;
                // save the view and check for errors
                view.save(function (err) {
                    if (err)
                        res.json(err);
                    res.json({
                        status: "success",
                        message: 'View Info updated',
                        data: view
                    });
                });
            }
        });
    }
};

// Handle delete view
exports.delete = function (req, res) {
    
    console.log('delete !!');
    console.log(req.body);
    console.log(req.params);
    console.log(req.params.view_id);
    

    if (req.params && req.params.view_id){
        View.deleteOne({ _id: req.params.view_id }, function (err, view) {

            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            } else {
                res.json({
                    status: "success",
                    message: 'view deleted'
                });
            }
        }).exec();
    }
};

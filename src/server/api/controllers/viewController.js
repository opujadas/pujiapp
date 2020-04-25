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
            console.log('On va enregistrer la vue dan les children de la vue parente'); 
                console.log('parent ID : ');
            console.log(req.body.parent_id);

            View.findById(req.body.parent_id, function (parenterr, parentview) {
                if (parenterr) {
                    res.json({
                        status: "error",
                        message: parenterr,
                    });
                }
                else {
                    console.log('parentview'); 
                    console.log(parentview); 
                    console.log('nouvelleview'); 
                    console.log(view); 

                    console.log('PUSH IN parentview'); 
                    parentview.children.push(view);
                    console.log(parentview); 
                    parentview.save(function (errsave) {
                        if (errsave) {
                            res.json({
                                status: "error",
                                message: errsave,
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
                }
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
        console.log('On a une vue parente, on choppe tous les enfants '); 
        View.find({parent: req.params.parent_id}).populate({
            path: 'tags', 
            model : Tag, 
            populate: { 
                path: 'category', 
                model : Categorie 
            }
        }).populate({
            path : 'children', 
            model: View
        }).exec(function(err, views) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            } 
            else {
                    console.log('Vue récupérées ');
                    console.log(views);  

                    res.json({
                        status: "success",
                        message: 'View details loading..',
                        data: views
                    });                                      
            } 
        });  
    }
    else {
        console.log('Paramétrage POK');
    }
};

/*
.exec(function(err, fullElement) {
                  console.log('Elements with tags ?');
                  console.log(fullElement);  

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
*/

/*
.populate({
                path: 'tags', 
                model : Tag, 
                populate: ({
                    path: 'category', 
                    model : Categorie
                })
            })
*/


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
                console.log('OK, on recup les elements de la vue ' + req.params.view_id); 
                console.log('Vue : '); 
                // console.log(view); 
                // console.log(view.tags); 
                view.elements = []; 

                var vuetagsID = []; 
                for(i=0; i<view.tags.length; i++){
                    vuetagsID[i] = view.tags[i]._id;
                }

                console.log('view.tags : '); 
                console.log(vuetagsID); 
/*
        var sql = 'SELECT el.id, el.created, el.trash, el.typeelement_id FROM elements el 
        JOIN elements_a_tags eat ON eat.element_id = el.id 
        AND eat.tag_id IN ( SELECT DISTINCT tag_id FROM views_a_tags ta WHERE ta.view_id = ' + req.params.id + ' ) 
        GROUP BY el.id 
        HAVING COUNT( DISTINCT eat.tag_id ) = (SELECT COUNT(tag_id) as total FROM views_a_tags WHERE view_id = ' + req.params.id + ') 
        AND el.trash=0 
        ORDER BY el.id DESC';
*/
                /* Element.find({'tags._id' : { $in: ['5e9b4d46f4ab6549c0ec2cf0'] } }, function (errelements, elements) { */
                    Element.find({tags : { $all: vuetagsID }}, function (errelements, elements) { 
                        console.log('Found elements : '); 
                        console.log(elements); 
                        view.elements = elements; 
                        console.log('VUE A RENVOYER : ');  
                        console.log(view); 

                        res.json({
                            status: "success",
                            message: 'View details loading..',
                            data: view
                        });            
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
    
        console.log('UPDATE View'); 
        console.log(req.body); 


//         view.name = req.body.name ? req.body.name : view.name;


    if (req.body && req.body._id){

        View.findById(req.body._id, function (err, view) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            else {
                view.name = req.body.name ? req.body.name : view.name;
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

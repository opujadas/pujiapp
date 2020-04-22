/**********************************************
                 elementController.js
***********************************************/


// Import element model
Element = require('../../models/elementModel');

// Handle index actions
exports.index = function (req, res) {

    Element.get(function (err, elements) {    
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        else {
            res.json({
                status: "success",
                message: "elements retrieved successfully",
                data: elements
            });            
        }
    });
};


// Handle create element actions
exports.new = function (req, res) {
    var element = new Element();
    element.type = req.body.type ? req.body.type : element.type;
    element.tags = req.body.tags ? req.body.tags : element.tags;
    element.data = req.body.data ? req.body.data : element.data;
    element.user = req.body.user_id ? req.body.user_id : element.user;
    // element.color = req.body.color;
/*    console.log(req.body.user_id); 
    categorie.user = req.body.user_id ? req.body.user_id : categorie.user;
    console.log(categorie); 
*/

    element.save(function (err) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        } 
        else {
            console.log('element._id'); 
            console.log(element._id); 

            Element.findById(element._id).populate({
                path: 'tags', 
                model : Tag, 
                populate: ({
                    path: 'category', 
                    model : Categorie
                })
            }).exec(function(err, fullElement) {
                  console.log('Elements with tags ?');
                  console.log(fullElement);  
                  //elements = elements.filter(function(user) {
                  
                        res.json({
                            status: "success",
                            message: 'View details loading..',
                            data: fullElement
                        });                  
                    //});
                });

        }
    });
};


// Handle view elements by type 

exports.getElementsWithTags = function (req, res) {
    
        console.log('Get getElementsWithTags'); 
        console.log(req.body); 

    if (req.body.tagIdList) {

        console.log('params ok'); 
        console.log(req.body.tagIdList); 

// tagIdList
/*
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
*/

        Element.find({tags: { $all: req.body.tagIdList }}).populate({
            path: 'tags', 
            model : Tag, 
            populate: ({
                path: 'category', 
                model : Categorie
            })
        }).sort({ 'create_date' : 'descending' }).exec(function(err, elements) {
                  console.log('Elements with tags ?');
                  console.log(elements);  
                  //elements = elements.filter(function(user) {
                  
                        res.json({
                            status: "success",
                            message: 'View details loading..',
                            data: elements
                        });                  
                    //});
                });  
/*
Users.find().populate({
  path: 'email',
  match: {
    type: 'Gmail'
  }
}).exec(function(err, users) {
  users = users.filter(function(user) {
    return user.email; // return only users with email matching 'type: "Gmail"' query
  });
});
*/


    }};




// Handle view elements by type 

exports.viewbytype = function (req, res) {
    if ((req.params.type) && (req.params.user_id)) {
        console.log('params ok'); 
        console.log(req.params.type); 
        console.log(req.params.user_id); 

        Element.find({type: req.params.type, user: req.params.user_id}, function (err, element) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            else {
            res.json({
                status: "success",
                message: 'Element details loading..',
                data: element
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



// Handle view element info

exports.view = function (req, res) {
    if (req.params.element_id){
        Element.findById(req.params.element_id, function (err, element) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            else {
                res.json({
                    status: "success",
                    message: 'Element details loading..',
                    data: element
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






// Handle update element info
/*
exports.addtag = function (req, res) {  
    if (req.body && req.body.tag_id && req.body.element_id){       
        Element.findById(req.body.element_id, function (err, element) {            
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            else {
                if((element.tags).indexOf(req.body.tag_id) == -1){
                    element.tags.push(req.body.tag_id);

                    // save the element and check for errors
                    element.save(function (err) {
                        if (err)
                            res.json(err);
                        res.json({
                            status: "success",
                            message: 'Element Info updated',
                            data: element
                        });
                    });                    
                }
            }
        }).populate({
            path: 'tags', 
            model : Tag, 
            populate: ({
                path: 'category', 
                model : Categorie
            })
    });
    }
};
*/

exports.addtag = function (req, res) {  
    if (req.body && req.body.tag_id && req.body.element_id){       

        Element.findById(req.body.element_id).populate({
            path: 'tags', 
            model : Tag, 
            populate: ({
                path: 'category', 
                model : Categorie
            })
        }).exec(function(err, element) {
                  console.log('Elements with tags ?');
                  console.log(element);  
                  //elements = elements.filter(function(user) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            else {
                if((element.tags).indexOf(req.body.tag_id) == -1){
                    element.tags.push(req.body.tag_id);

                    // save the element and check for errors
                    element.save(function (err) {
                        if (err)
                            res.json(err);
                        res.json({
                            status: "success",
                            message: 'Element Info updated',
                            data: element
                        });
                    });                    
                 };                    
                   
            }                  
        });
    }
};                



// Handle update element info
exports.deletetag = function (req, res) {  
    if (req.body && req.body.tag_id && req.body.element_id){
        Element.findById(req.body.element_id, function (err, element) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            else {
                var index = (element.tags).indexOf(req.body.tag_id);
                if (index >= 0){
                    (element.tags).splice(index, 1);
                    
                    // Vérification et sauvegarde
                    if((element.tags).indexOf(req.body.tag_id) == -1){ // On s'assure qu'il n'est plus dans la liste !                        

                        // save the element and check for errors
                        element.save(function (err) {
                            if (err)
                                res.json(err);
                            res.json({
                                status: "success",
                                message: 'Element Info updated',
                                data: element
                            });
                        });                    
                    }
                }                
            }
        });
    }
};


// Handle update element info
exports.update = function (req, res) {  
    console.log('UPDATE Element'); 
    console.log(req.body);

    if (req.body && req.body._id){
        Element.findById(req.body._id, function (err, element) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            else {
                element.data = req.body.data ? req.body.data : element.data;
                // save the element and check for errors
                element.save(function (err) {
                    if (err)
                        res.json(err);
                    res.json({
                        status: "success",
                        message: 'Element Info updated',
                        data: element
                    });
                });
            }
        });
    }
};

// Handle delete element
exports.delete = function (req, res) {
    
    console.log('delete !!');
    console.log(req.body);
    console.log(req.params);
    console.log(req.params.element_id);
    

    if (req.params && req.params.element_id){
        Element.deleteOne({ _id: req.params.element_id }, function (err, element) {

            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            } else {
                res.json({
                    status: "success",
                    message: 'element deleted'
                });
            }
        }).exec();
    }
};

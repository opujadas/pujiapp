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
    element.user_id = req.body.user_id ? req.body.user_id : element.user_id;
    element.type = req.body.type ? req.body.type : element.type;
    element.tags = req.body.tags ? req.body.tags : element.tags;
    element.data = req.body.data ? req.body.data : element.data;
    // element.color = req.body.color;

    // save the element and check for errors
    element.save(function (err) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        } 
        else {
            res.json({
            status: "success",
            message: 'New element created!',
            data: element
            });
        }
    });
};


// Handle view elements by type 

exports.viewbytype = function (req, res) {
    if(req.params.type){
        Element.find({type: req.params.type}, function (err, element) {
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
    
    if (req.body && req.body.element && req.body.element.id){
        Element.findById(req.body.element.id, function (err, element) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            else {
                element.data = req.body.element.data ? req.body.element.data : element.data;
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

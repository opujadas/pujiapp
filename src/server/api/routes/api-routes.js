// api-routes.js
// Initialize express router
let router = require('express').Router();
// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!',
    });
});


/*
// Import contact controller
var contactController = require('../controllers/contactController');

// Contact routes
router.route('/contacts')
    .get(contactController.index)
    .post(contactController.new);
router.route('/contacts/:contact_id')
    .get(contactController.view)
    .patch(contactController.update)
    .put(contactController.update)
    .delete(contactController.delete);
*/



// Import contact controller
var categorieController = require('../controllers/categorieController');
// Categories routes
router.route('/categories/user/:user_id')
    .get(categorieController.index);
router.route('/categories/:category_id')
    .get(categorieController.view)
    .delete(categorieController.delete);
router.route('/categories')    
    .post(categorieController.new)
    .put(categorieController.update);


var tagController = require('../controllers/tagController');
// Categories routes
router.route('/tags/user/:user_id')
    .get(tagController.index);
router.route('/tags/:tag_id')
    .get(tagController.view)
    .delete(tagController.delete);
router.route('/tags')
    .get(tagController.index)
    .post(tagController.new)
    .put(tagController.update);


var elementController = require('../controllers/elementController');
// Categories routes
router.route('/elements/type/:type/user/:user_id')
    .get(elementController.viewbytype);
router.route('/elements/addtag')
    .post(elementController.addtag);
router.route('/elements/deletetag')
    .post(elementController.deletetag);   
router.route('/elements/:element_id')
    .get(elementController.view)
    .delete(elementController.delete);
router.route('/elements')
    .get(elementController.index)
    .post(elementController.new)
    .put(elementController.update);



var viewController = require('../controllers/viewController');
// View routes
router.route('/views/:view_id')
    .get(viewController.view)
    .delete(viewController.delete);
router.route('/views')
    .get(viewController.index)
    .post(viewController.new)
    .put(viewController.update);



var userController = require('../controllers/userController');
// View routes
router.route('/users/signup')
    .post(userController.signup);
router.route('/users/activate')
    .put(userController.activate);
router.route('/users/login')
    .post(userController.login);


    /*.put(userController.update);
router.route('/users/:user_id')
    .get(userController.user)
    .delete(userController.delete);
*/


// Export API routes
module.exports = router;
// contactModel.js
var mongoose = require('mongoose');
// Setup schema
var tagSchema = mongoose.Schema({
    name: 				{ type: String, required: true },
    create_date: 		{ type: Date, default: Date.now },
    category: 			{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false },
    user: 				{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    ref: 				{ type: String, required: true, default: 'tag' }
});
// Export Contact model
var Tag = module.exports = mongoose.model('Tag', tagSchema);
module.exports.get = function (callback, limit) {
    Tag.find(callback).limit(limit);
}
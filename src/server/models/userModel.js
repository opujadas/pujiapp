// userModel.js
var mongoose = require('mongoose');

// Setup schema
var userSchema = mongoose.Schema({
    login:           {	type: String,	required: true },
    email:          {	type : String, required: true },
    password:       { type : String, required: true },
    activationKey:  { type : String, required: false },
    active:         { type : Boolean, required: true, default: false },
    create_date:    { type: Date, default: Date.now },
    update_date:    { type: Date, default: Date.now }
});

/*
userSchema.pre('update', function(next) {
  	this.update({},{ $set: { update_date: new Date() } });
	next();  
});
*/


// Export Contact model
var User = module.exports = mongoose.model('User', userSchema, 'users'); // le dernier paramètre correspond à la collection dans laquelle on va insérer
module.exports.get = function (callback, limit) {
    User.find(callback).limit(limit);
}
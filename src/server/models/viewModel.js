// contactModel.js
var mongoose = require('mongoose');
// Setup schema
var viewSchema = mongoose.Schema({
    name: 		{ type: String, required: true },
    parent: 	{ type: mongoose.Schema.Types.ObjectId, ref: 'View', required: true },
    /* user: { type: String, required: true },*/
    create_date: { type: Date, default: Date.now },
    update_date: { type: Date, default: Date.now },    
    rootview: 	 { type: Boolean, required: true, default: false },
});

/*viewSchema.pre('deleteOne', function(next) {

	console.log('View : pre function'); 
	console.log(this._conditions); 
	
	var idViewEnCours = this._conditions._id;
	console.log(idViewEnCours); 

	Tag.find({category : idViewEnCours}, function(err, tags){
		for (let tag of tags){
			console.log('Tag de la view trouvé : '); 
			console.log(tag); 			
			tag.category = undefined; 
			tag.save(function (err, book) {
		      if (err) return console.error(err);		      		
		      else {
		      	console.log('Tag sauvegardé !'); 
     			console.log(tag); 			
		      }
		    });
		}
	});
	next();  
});
*/
viewSchema.pre('update', function() {
  this.update({},{ $set: { update_date: new Date() } });
});

// Export Contact model
var View = module.exports = mongoose.model('View', viewSchema, 'views'); // le dernier paramètre correspond à la collection dans laquelle on va insérer
module.exports.get = function (callback, limit) {
    View.find(callback).limit(limit);
}
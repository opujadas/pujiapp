// contactModel.js
var mongoose = require('mongoose');
// Setup schema
var categorieSchema = mongoose.Schema({
    name: 	{ type: String, required: true },
    color: 	{ type: String, required: false },
    user: 	{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }
});

categorieSchema.pre('deleteOne', function(next) {

	console.log('Categorie : pre function'); 
	console.log(this._conditions); 
	
	var idCategorieEnCours = this._conditions._id;
	console.log(idCategorieEnCours); 

	Tag.find({category : idCategorieEnCours}, function(err, tags){
		for (let tag of tags){
			console.log('Tag de la categorie trouvé : '); 
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

categorieSchema.pre('update', function() {
  this.update({},{ $set: { updatedAt: new Date() } });
});

// Export Contact model
var Categorie = module.exports = mongoose.model('Category', categorieSchema, 'categories'); // le dernier paramètre correspond à la collection dans laquelle on va insérer
module.exports.get = function (callback, limit) {
    Categorie.find(callback).limit(limit);
}
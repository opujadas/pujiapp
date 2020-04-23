// contactModel.js
var mongoose = require('mongoose');
// Setup schema

/*
import { Tag } from './tagModel'; 
export class Element {

  public id: number;
  public user_id: number;
  public tags: Tag[];
  public elementtype_id: number; 
  public data: {}; // la partie data correspond à du post, img, etc.       

  constructor(id : number = -1, user_id: number = -1, tags : Tag[], elementtype_id : number = -1, data : {}) {
    this.id = id;
    this.user_id = user_id; 
    this.tags = tags; 
    this.data = data; 
    this.elementtype_id = elementtype_id; 
  }
}
*/


var elementSchema = mongoose.Schema({
    type: {	type: String,	required: true },
    data: {	type : mongoose.Schema.Types.Mixed },
    create_date: { type: Date, default: Date.now },
    update_date: { type: Date, default: Date.now },
   	tags: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag', required: false }]},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ref:  { type: String, required: true, default: 'element' },
    recyle: {
      in_recycle_bin : { type: Boolean, required: true, default: false },
      deletion_date : { type: Date, default: Date.now },
    }
});


/*
elementSchema.pre('deleteOne', function(next) {

	console.log('Categorie : pre function'); 
	console.log(this._conditions); 
	
	var idCategorieEnCours = this._conditions._id;
	console.log(idCategorieEnCours); 

	Tag.find({category : idCategorieEnCours}, function(err, tags){
		for (let tag of tags){
			console.log('Tag de la element trouvé : '); 
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

elementSchema.pre('update', function(next) {
  	this.update({},{ $set: { update_date: new Date() } });
	next();  
});



// Export Contact model
var Element = module.exports = mongoose.model('Element', elementSchema, 'elements'); // le dernier paramètre correspond à la collection dans laquelle on va insérer
module.exports.get = function (callback, limit) {
    Element.find(callback).limit(limit);
}
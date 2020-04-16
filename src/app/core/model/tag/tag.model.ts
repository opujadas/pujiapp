import { Category } from '../category/category.model'; 

export class Tag {

  public id: 		string; 
  public name: 		string;
  public category : Category; 
  public user_id: 	string;    
  
  constructor(id: string = "-1", name: string, category: Category, user_id: string = "-1") {
    this.id = id; 
    this.name = name;
    this.category = category; 
    this.user_id = user_id;
  }
}
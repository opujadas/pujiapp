import { Category } from '../category/category.model'; 

export class Tag {

  public id: 		string; 
  public name: 		string;
  public category : Category; 
  
  constructor(id: string = "-1", name: string, category: Category) {
    this.id = id; 
    this.name = name;
    this.category = category; 
  }
}
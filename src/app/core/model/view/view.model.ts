import { Tag } from '../tag/tag.model'; 
import { Element } from '../element/element.model'; 

export class View {

  public id: number; 
  public name: string; 
  public user_id: number;
  public parent_id: number;
  public created: string; 
  public tags: Tag[];
  public elements: Element[];
  public children?: View[];
  //public data: {}; // la partie data correspond à du post, img, etc.       

  constructor(id : number = -1, name: string = "", user_id: number = -1, parent_id : number = 0, tags : Tag[], elements : Element[], children : View[]=[]) {
    this.id = id;
    this.name = name;
    this.user_id = user_id; 
    this.parent_id = parent_id; 
    this.tags = tags; 
    this.elements = elements; 
    this.children = children; 
  }
}
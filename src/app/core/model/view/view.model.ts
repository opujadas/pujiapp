import { Tag } from '../tag/tag.model'; 
import { Element } from '../element/element.model'; 

export class View {

  public _id: string; 
  public name: string; 
  public user_id: string;
  public parent_id: string;
  public created: string; 
  public tags: Tag[];
  public elements: Element[];
  public children?: View[];
  //public data: {}; // la partie data correspond à du post, img, etc.       

  constructor(_id : string = "-1", name: string = "", user_id: string = "-1", parent_id : string = "0", tags : Tag[], elements : Element[], children : View[]=[]) {
    this._id = _id;
    this.name = name;
    this.user_id = user_id; 
    this.parent_id = parent_id; 
    this.tags = tags; 
    this.elements = elements; 
    this.children = children; 
  }
}
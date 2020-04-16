import { Tag } from '../tag/tag.model'; 

export class Element {

  public id: string;
  public user_id: string;
  public tags: Tag[];
  public type: string; 
  public data: {}; // la partie data correspond à du post, img, etc.       

  constructor(id : string = "-1", user_id: string = "-1", tags : Tag[], type : string = "-1", data : {}) {
    this.id = id;
    this.user_id = user_id; 
    this.tags = tags; 
    this.data = data; 
    this.type = type; 
  }
}
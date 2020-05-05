// import { Tag } from '../tag/tag.model'; 
// import { Element } from '../element/element.model'; 

export class Post {

  public id: string; 
  public element_id: string; 
  public title: string;
  public content: string;

  
  // constructor(id : string = -1, title: string, content: string, user_id: string = 1, tags: Tag[], element_id = -1) {
    constructor(id : string = -1, element_id : string = -1, title: string, content: string) {
    this.id = id; 
    this.element_id = element_id; 
    this.title = title;
    this.content = content;
  }
}
// import { Tag } from '../tag/tag.model'; 
// import { Element } from '../element/element.model'; 

export class Post {

  public id: number; 
  public element_id: number; 
  public title: string;
  public content: string;

  
  // constructor(id : number = -1, title: string, content: string, user_id: number = 1, tags: Tag[], element_id = -1) {
    constructor(id : number = -1, element_id : number = -1, title: string, content: string) {
    this.id = id; 
    this.element_id = element_id; 
    this.title = title;
    this.content = content;
  }
}
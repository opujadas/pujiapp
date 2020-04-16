export class Category {

  public id: string;
  public name: string;
  public color: string;
  public user_id: string;    

  constructor(id: string = "-1", name: string, color: string, user_id: string = "-1") {
  	this.id = id; 
    this.name = name;
    this.color = color;
    this.user_id = user_id;
  }
}
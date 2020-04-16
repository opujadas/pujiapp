export class MessageSocket {
  public message: any;
  public data: any;  
  
  constructor(content: string, type: string, data: any, action: string = '') 
  {
  	this.message = {}; 
    this.message.content = content;
    this.message.type = type;
    this.message.action = action;
    this.data = data;
  }
}

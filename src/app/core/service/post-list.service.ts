import { Post } from './../model/post/post.model';
import { Subject } from 'rxjs/Subject';
import { DataService } from './../data/data.service';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable() // <<<=== required if the constructor has parameters 


export class PostListService 
{
  postChanged  = new Subject<string>();
  private posts: Post[]; 
  //private http: Http, private dataService: DataService
  
  constructor(private http: Http, private dataService: DataService) {
    console.log('A la constructor, on choppe la liste des posts'); 
    
   /*    this.dataService.getData()
        .subscribe(data => 
        {
            console.log('CONTACT ? : '); 
            console.log(data);
        });
        */ 
  }


getPosts()
{
    console.log('Posts list service -> On choppe la liste des posts'); 
    return this.dataService.getPosts(); 
}

}
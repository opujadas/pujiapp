import { Category } from './../../core/model/category/category.model';
import { Subject } from 'rxjs/Subject';
import { DataService } from '../../core/data/data.service';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable() // <<<=== required if the constructor has parameters 


export class CategoryListService 
{
  categoryChanged  = new Subject<string>();
  private categories: Category[]; 
  
  constructor(private http: Http, private dataService: DataService) {
    console.log('A la constructor, on choppe la liste des categorys'); 
  }

  getCategories(){
      console.log('Categorys list service -> On choppe la liste des categories'); 
      return this.dataService.getCategories();
  }

}
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import { Category } from './../../core/model/category/category.model';
import { DataService } from './../../core/data/data.service';

import 'rxjs/Rx';

@Injectable()

export class CategoryService {

	currentCategoryChanged  = new Subject<Category>();

  	constructor(private http: Http, private _dataService: DataService) {
    }

    getCategories() {
        console.log('getCategories'); 
        return this._dataService.getCategories(); 
    }

    getCategory(id: string) {
        console.log('getCategory  -> On choppe le post avec id ' + id); 
        return this._dataService.getCategory(id); 
    }

    editCategory(category: Category) {
        console.log('editCategory');
        console.log(category);
        return this._dataService.editCategory(category);
    }

    deleteCategory(id: string)  {
        return this._dataService.deleteCategory(id);          
    }
}
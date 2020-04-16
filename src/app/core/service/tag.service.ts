import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Tag } from './../../core/model/tag/tag.model';

import { DataService } from '../../core/data/data.service';

import 'rxjs/Rx';

@Injectable()

export class TagService 
{
	// currentTagChanged  = new Subject<Tag>();


  	constructor(private http: Http, private _dataService: DataService) {

/*        this._dataService.getTags()
        .subscribe(data => 
        {
            console.log('Data get tags ? : '); 
            console.log(data);
            // this.city = data['a'][0]['city_name']; 
            // this.citynameChanged.next(this.city);
            // console.log(this.city); 
        }); */
    }

  getTags() {
      return this._dataService.getTags(); 
  }

    getTag(id: string) {
        console.log('getTag  -> On choppe le tag avec id ' + id); 
        return this._dataService.getTag(id); 
    }

    editTag(tag: Tag) {
        console.log('editTag');
        console.log(tag);
        return this._dataService.editTag(tag);
    }    
    /*

	setTag(tag: Tag)
	{
	    console.log('setTag');
	    console.log(tag);

        // this.currentTagChanged.next(tag);
        console.log('currentTagChanged2');
	}
*/
    deleteTag(id: string) {
        return this._dataService.deleteTag(id);          
    }
}

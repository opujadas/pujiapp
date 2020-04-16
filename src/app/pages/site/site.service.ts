import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Site } from './../../core/model/site/site.model';

import { DataService } from '../../core/data/data.service';

import 'rxjs/Rx';

@Injectable()

export class SiteService 
{
	currentSiteChanged  = new Subject<Site>();


  	constructor(private http: Http, private dataService: DataService) {

/*        this.dataService.getContacts()
        .subscribe(data => 
        {
            console.log('Data get contacts ? : '); 
            console.log(data);
            // this.city = data['a'][0]['city_name']; 
            // this.citynameChanged.next(this.city);
            // console.log(this.city);
        }); */
    }


    getSite(id: number)
    {
        console.log('getSite  -> On choppe le Site avec id ' + id); 
        const toto = this.dataService.getSite(id).subscribe(data => 
        {
            console.log('Data get Site : '); 
            console.log(data[0]);
            this.currentSiteChanged.next(data[0]);
            console.log('currentSiteChanged');
        });
        console.log(toto); 
    }

	setSite(site: Site)
	{
	    console.log('setSite');
	    console.log(site);

        // this.currentSiteChanged.next(Site);
        console.log('currentSiteChanged2');
	}

    deleteSite(id: number)
    {
        return this.dataService.deleteSite(id); 
    }    

}

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Element } from './../../core/model/element/element.model';

import { DataService } from '../../core/data/data.service';

import 'rxjs/Rx';

@Injectable()

export class ElementListService {

    private listElementChanged = new Subject<Element>();
    private listElementDeleted = new Subject<Element>();


  	constructor(private http: Http, private _dataService: DataService) {

    }

    // Fonctions pour interagir avec les listRootViews
    
    deleteElementListAction(element: Element) {
        console.log('element list service : deleteElementListAction');
        console.log(element);  
        this.listElementDeleted.next(element);
    }

    clearElementListAction() {
        this.listElementChanged.next();
    }

    getElementDeletedAction(): Observable<any> {
        return this.listElementDeleted.asObservable();
    }
}
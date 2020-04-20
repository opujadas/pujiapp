import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Element } from './../../core/model/element/element.model';
import { Tag } from './../../core/model/tag/tag.model';

import { DataService } from '../../core/data/data.service';

import 'rxjs/Rx';

@Injectable()

export class ElementService {
  	constructor(private http: Http, private _dataService: DataService) {

    }

    moveToRecycleBin(element: Element){
        return this._dataService.moveToRecycleBin(element);
    }

    updateElement(element: Element) {
        console.log('Element service : on va updater ');
        return this._dataService.updateElement(element);
    }

    addElement(element: Element)  {
        return this._dataService.addElement(element);
    }  

    getElements() {
        console.log('elements  -> On choppe tous les elements'); 
        return this._dataService.getElements(); 
    }

    // Renvoie le tableau de tags pour l'élément 
    getElementTags(id : number) : any {
        console.log('getElementTags  -> Renvoie le tableau de tags pour l élément  ' + id); 
        return this._dataService.getElementTags(id);         
    }

    getElement(id: string) {
        console.log('getElement  -> On choppe le element avec id ' + id); 
        return this._dataService.getElement(id); 
    }

    getElementsByType(typeelement: string) {
        console.log('elementsByType  -> On choppe les elements pour le type id ' + typeelement); 
        return this._dataService.getElementsByType(typeelement); 
    }

    getElementsWithTags(tagIdList: any[]){
        console.log('getElementsWithTags');
        console.log(tagIdList);
        return this._dataService.getElementsWithTags(tagIdList);     
    }


    addTagToElement(tagid: string, elementid: string) {
        console.log('Post service : on va ajouter le tag ' + tagid + ' au element ' + elementid);
        return this._dataService.addTagToElement(tagid, elementid);
    }

    deleteTagFromElement(tagid: string, elementid: string) {
        console.log('Element service : on va supprimer le tag ' + tagid + ' du element ' + elementid);
        return this._dataService.deleteTagFromElement(tagid, elementid);
    }

    deleteElement(id: string) {
        return this._dataService.deleteElement(id);          
    }

    editElement(element: Element) {
        return this._dataService.editElement(element);
    }    
}
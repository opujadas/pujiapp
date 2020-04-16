import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Rx';
// import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import { Subject } from 'rxjs/Subject';
import { Element } from './../../core/model/element/element.model';
import { View } from './../../core/model/view/view.model';

import { DataService } from '../../core/data/data.service';

import 'rxjs/Rx';

@Injectable()

export class ViewService {


    private listRootViewsChanged = new Subject<View>();
    private viewTagsChanged = new Subject<View>();

    currentViewChanged  = new Subject<View>();

  // Observable string sources
  // private _listRootViews = new BehaviorSubject<View[]>();




    constructor(private http: Http, private _dataService: DataService) {

    }



    getViewsTest() {
        console.log('TEST'); 
        return this._dataService.getViewsTest();
    }


    // Fonctions pour interagir avec les listRootViews
    
    sendViewAction(view: View) {
        console.log('view service : sendViewAction');
        console.log(view);  
        this.listRootViewsChanged.next(view);
    }

    clearViewAction() {
        this.listRootViewsChanged.next();
    }

    getViewAction(): Observable<any> {
        return this.listRootViewsChanged.asObservable();
    }

    getViewTagsChanged(): Observable<any> {
        return this.viewTagsChanged.asObservable();
    }

    getCurrentViewChanged(): Observable<any> {
        return this.currentViewChanged.asObservable();
    }


    // Autres fonctions

    addView(view: View)  {
        return this._dataService.addView(view);
    }  

    updateView(view: View)  {
        // On informe qu'on va devoir reloader les elements, puisque potentiellement des tags ont changé pour cette vue
       this.viewTagsChanged.next(view);
 
        console.log('vue  -> On choppe les vues filles de ' + view.id); 
        return this._dataService.updateView(view);
    }  

    getViews(parent_id: string) {
        console.log('elements  -> On choppe les vues filles de ' + parent_id); 
        return this._dataService.getViews(parent_id);
    }

    getViewsForMenu(parent_id: number) {
        console.log('elements  -> On choppe les vues filles de ' + parent_id); 
        return this._dataService.getViewsForMenu(parent_id);
    }

    getView(id: string) {
        console.log('getView  -> On choppe la vue avec id ' + id); 
        // this.currentViewChanged.next(id);
        return this._dataService.getView(id); 
    }


    setCurrentView(view: View) {
        console.log('setCurrentView  -> On sette la vue'); 
        this.currentViewChanged.next(view);
    }


    addTagToView(tagid: number, viewid: number) {
        console.log('Post service : on va ajouter le tag ' + tagid + ' au View ' + viewid);
        return this._dataService.addTagToView(tagid, viewid);
    }

    deleteTagFromView(tagid: number, viewid: number) {
        console.log('View service : on va supprimer le tag ' + tagid + ' du View ' + viewid);
        return this._dataService.deleteTagFromView(tagid, viewid);
    }
/*
    // Renvoie le tableau de tags pour l'élément 
    getElementTags(id : number) : any {
        console.log('getElementTags  -> Renvoie le tableau de tags pour l élément  ' + id); 
        return this._dataService.getElementTags(id);         
    }


    getElementsByType(typeelement_id: number) {
        console.log('elementsByType  -> On choppe les elements pour le type id ' + typeelement_id); 
        return this._dataService.getElementsByType(typeelement_id); 
    }



    deleteElement(id: number) {
        return this._dataService.deleteElement(id);          
    }

    editElement(element: Element) {
        return this._dataService.editElement(element);
    }    
    */
}
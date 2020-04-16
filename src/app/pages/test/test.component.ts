import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { View } from './../../core/model/view/view.model';
import { ViewService } from './../../core/service/view.service';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */

/*interface View {
  view : View[];
}*/

/*
const TREE_DATA: View[] = [
  {
    name: 'Vue1',
    children: [
      {name: 'sousvue 1.1'},
      {name: 'sousvue 1.2'},
      {name: 'sousvue 1.3'},
    ]
  },   {
    name: 'Vue2',
    children: [
      {name: 'sousvue 1.1'},
      {name: 'sousvue 1.2'},
      {name: 'sousvue 1.3',    
       children: [
	      {name: 'sousvue 1.1'},
	      {name: 'sousvue 1.2'},
	      {name: 'sousvue 1.3'},
    	]},
    ]
  },
];


*/
/*
const TREE_DATA: View[] = [
  {
    name: 'Fruit',
    children: [
      {name: 'Apple'},
      {name: 'Banana'},
      {name: 'Fruit loops'},
    ]
  }, {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [
          {name: 'Broccoli'},
          {name: 'Brussels sprouts'},
        ]
      }, {
        name: 'Orange',
        children: [
          {name: 'Pumpkins'},
          {name: 'Carrots'},
        ]
      },
    ]
  },
];

/**
 * @title Tree with nested nodes
 */
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  treeControl = new NestedTreeControl<View>(node => node.children);
  dataSource = new MatTreeNestedDataSource<View>();
  private subscriptionGetViews: Subscription;


  constructor( private _viewService : ViewService) {

  	// On va loader l'arbre des vues
    this.subscriptionGetViews = this._viewService.getViewsTest().subscribe((data : View[]) =>  {
         //console.log('ICHIIII');  
         //console.log(data); 
        // Dasn la réalité, ça ne renvoie pas une liste de tags (puisque c'est le résultat d'une jointure avec les catégories de tags)
          this.dataSource.data = data;
          //console.log('Views => ');
          //console.log(this.rootViews);
      });  

  }

  hasChild = (_: number, node: View) => !!node.children && node.children.length > 0;
}


import { TestBed, async } from '@angular/core/testing';
import {AppModule} from '../../app.module';
import {APP_BASE_HREF} from '@angular/common';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; 
import { DataService } from '../../data/data.service';

import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core';

import { FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { PostAddComponent } from './post-add.component';
import { Post } from '../post.model';
import { AppRoutingModule } from '../../app-routing.module';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Socket } from 'ng-socket-io';
import { Subscription } from 'rxjs/Subscription';





describe('PostAddComponent', () => 
{
  var component : PostAddComponent; 
      let slimLoadingBarService: SlimLoadingBarService; 
      let toastr: ToastsManager; 
      let vcr: ViewContainerRef; 
      let router: Router; 
      let dataService: DataService;
      let socket: Socket; 

  // BOrdels factorisés
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule
      ],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'}
      ],
    }).compileComponents();
  }));


/*  beforeEach(() => {
    component = new PostAddComponent(null, null, null, null, null, null);
    console.log('form ?'); 
    console.log(component.addPostForm); 
  });
*/

  it('should create PostAddComponent component', (() => {
    console.log('test ici !'); 
    const fixture = TestBed.createComponent(PostAddComponent);
    const component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  }));


  it('should have a form defined', (() => {
    console.log('Form defined ?'); 
    const fixture = TestBed.createComponent(PostAddComponent);
    const component = fixture.debugElement.componentInstance;    
    component.ngOnInit(); 
    expect(component.addPostForm).toBeDefined(); 
  }));


  it('should have a form with a title field', (() => {
    console.log('Form defined ?'); 
    const fixture = TestBed.createComponent(PostAddComponent);
    const component = fixture.debugElement.componentInstance;    
    component.ngOnInit(); 
    expect(component.addPostForm.contains('title')).toBe(true);

  }));

  it('should have a form with a content field', (() => {
    console.log('Form defined ?'); 
    const fixture = TestBed.createComponent(PostAddComponent);
    const component = fixture.debugElement.componentInstance;    
    component.ngOnInit(); 
    expect(component.addPostForm.contains('content')).toBe(true);

  }));  


  it('should make the title control required', (() => {
    console.log('title ?'); 
    const fixture = TestBed.createComponent(PostAddComponent);
    const component = fixture.debugElement.componentInstance;    
    component.ngOnInit(); 
    let control = component.addPostForm.get('title');

    control.setValue(''); 

    expect(control.valid).toBeFalsy(); 
  }));  

    it('should make the content control required', (() => {
    console.log('content ?'); 
    const fixture = TestBed.createComponent(PostAddComponent);
    const component = fixture.debugElement.componentInstance;    
    component.ngOnInit(); 
    let control = component.addPostForm.get('content');

    control.setValue(''); 

    expect(control.valid).toBeFalsy(); 
  }));  
/*
  it('should have a form with 2 fields', (() => {
    console.log('Form ?'); 
    const fixture = TestBed.createComponent(PostAddComponent);
    const component = fixture.debugElement.componentInstance;    
    expect(component.addPostForm.contains('title')).toBe(true);
  }));
*/
});

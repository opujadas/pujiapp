/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HomeComponent } from './home.component';
import {SlimLoadingBarModule} from 'ng2-slim-loading-bar';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';

import { AuthService } from '../user/auth.service';

/*
describe('HomeComponent', () => {
  let component: HomeComponent;
  //let authComponent: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authService : AuthService; 
  let slimLoadingBarService: SlimLoadingBarService; 
  let toastr: ToastsManager; 

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports : [ SlimLoadingBarModule.forRoot()],
      providers : [ AuthService ] 
    })
    .compileComponents();
  }));

  beforeEach(() => {
    authService = new AuthService(null, null); 
    slimLoadingBarService = new SlimLoadingBarService(); 
    component = new HomeComponent(slimLoadingBarService, authService);  
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

*/
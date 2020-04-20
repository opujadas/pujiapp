import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Rx';
import { BaseRequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Element } from './../../core/model/element/element.model';
import { Message } from './../../core/model/message/message.model';
import { Post } from './../../core/model/post/post.model';
import { Tag } from './../../core/model/tag/tag.model';
import { View } from './../../core/model/view/view.model';
import { Site } from './../../core/model/site/site.model';
import { Contact } from './../../core/model/contact/contact.model';
import { Category } from './../../core/model/category/category.model';
import { User } from './../../core/model/user/user.model';

import {ServicesEndPoints} from "../service-end-points";

@Injectable()

export class DataService 
{
  private url_token = '';
  private url_userid = '';



  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
  
  constructor(private http: HttpClient ) {
      if (localStorage.getItem('token'))
        this.url_token = 'token=' + localStorage.getItem('token');
      if (localStorage.getItem('user_id'))
        this.url_userid = 'userid=' + localStorage.getItem('user_id');
  }


  /*********************************************************************** 
  *                         USERS / AUTHENTIFICATION
  ***********************************************************************/

  signup(user: User) {
    console.log('Data signup'); 
    console.log(user); 
    return this.http.post(ServicesEndPoints.USERS + '/signup', user, { headers : new HttpHeaders().set('Content-Type', 'application/json')});
  }

  login(user: User) {
    console.log('Data login'); 
    console.log(user); 
    return this.http.post(ServicesEndPoints.USERS + '/login', user, { headers : new HttpHeaders().set('Content-Type', 'application/json')});
  }

  activate(obj){
    console.log('Data activate'); 
    console.log(obj); 
    return this.http.put(ServicesEndPoints.USERS + '/activate', obj, { headers : new HttpHeaders().set('Content-Type', 'application/json')});    
  }

  /*********************************************************************** 
  *                         CATEGORIES
  ***********************************************************************/

  addCategory(category: Category) {
    return this.http.post(ServicesEndPoints.CATEGORIES, category, { headers : new HttpHeaders().set('Content-Type', 'application/json')});
  }

  getCategories() {
    console.log(ServicesEndPoints.CATEGORIES + '/user/' + localStorage.getItem('user_id')); 
    return this.http.get(ServicesEndPoints.CATEGORIES + '/user/' + localStorage.getItem('user_id'));
  }  

  getCategory(id: string) {
    console.log('Data => ' + id); 
    return this.http.get(ServicesEndPoints.CATEGORIES + '/' + id);
  }  

  editCategory(category: Category)  {
    let params = {};
    params['category'] = category; 
      console.log('Data ! ');
      console.log(params);  
    return this.http.put(ServicesEndPoints.CATEGORIES, params,  { headers : new HttpHeaders().set('Content-Type', 'application/json')});
  }

  deleteCategory(id : string) {
     console.log('Data => ' + id); 
    return this.http.delete(ServicesEndPoints.CATEGORIES + '/' + id);
  }  

  /*********************************************************************** 
  *                         MESSAGES
  ***********************************************************************/
/*
  getMessage(id)
  {
    return this.http.get(ServicesEndPoints.MESSAGES + '/' + id);
  }

  getMessages()
  {
      var token = '';
      if (localStorage.getItem('token'))
        token = '?token=' + localStorage.getItem('token');

      return this.http.get(ServicesEndPoints.MESSAGES + token);
  }


  addMessage(message: Message)
  {
    return this.http.post(ServicesEndPoints.MESSAGES, message, { headers : new HttpHeaders().set('Content-Type', 'application/json')});
  }

  updateMessage(id: number, message: Message)
  {
    let params = {};
    params['message'] = message; 
    params['id'] = id; 

    return this.http.put(ServicesEndPoints.MESSAGES, params,  { headers : new HttpHeaders().set('Content-Type', 'application/json')});
  }

  deleteMessage(message_id : number) {
    return this.http.delete(ServicesEndPoints.MESSAGES + '/' + message_id);
  }  
*/
  /*********************************************************************** 
  *                         VIEWS
  ***********************************************************************/


  getViewsTest(){
      return this.http.get(ServicesEndPoints.VIEWS +  '/test/');    
  }

  addView(view: View)  {
    console.log('Data addview'); 
    console.log(view); 
    return this.http.post(ServicesEndPoints.VIEWS, view, { headers : new HttpHeaders().set('Content-Type', 'application/json')});
  }  

  updateView(view : View){
    console.log('vue  -> update de ' + view._id); 
    return this.http.put(ServicesEndPoints.VIEWS, view,  { headers : new HttpHeaders().set('Content-Type', 'application/json')});
  }

  getViews(parent_id: string){
      return this.http.get(ServicesEndPoints.VIEWS +  '/children/' + parent_id);
  } 

  getViewsForMenu(parent_id: string) {
      return this.http.get(ServicesEndPoints.VIEWS +  '/childrenformenu/' + parent_id);
  }

  getView(id: string) {
      return this.http.get(ServicesEndPoints.VIEWS + '/' + id);         
  }

  addTagToView(tag_id : string, view_id : string) {
    let params = {};
    params['tag_id'] = tag_id;
    params['view_id'] = view_id;
    return this.http.post(ServicesEndPoints.VIEWS + '/addtag', params, { headers : new HttpHeaders().set('Content-Type', 'application/json')});    
  }


  deleteTagFromView(tag_id : string, view_id : string) {
    let params = {};
    params['tag_id'] = tag_id;
    params['view_id'] = view_id;
    return this.http.put(ServicesEndPoints.VIEWS + '/deletetag', params, { headers : new HttpHeaders().set('Content-Type', 'application/json')});    
  }

  /*********************************************************************** 
  *                         ELEMENTS
  ***********************************************************************/

  updateElement(element : Element){
    return this.http.put(ServicesEndPoints.ELEMENTS + '/update', element,  { headers : new HttpHeaders().set('Content-Type', 'application/json')});    
  }

  getElements(){
      return this.http.get(ServicesEndPoints.ELEMENTS);
  } 

  getElementTags(id: number)  : any {
      console.log('On get les element tags pour : ' + id); 
      return this.http.get(ServicesEndPoints.ELEMENTS + '/getTags/' + id);         
  }

  getElementsWithTags (tagIdList: any[])  : any {
      console.log('getElementsWithTags > On get les element tags pour : '); 
      console.log(tagIdList); 
    let params = {};
    params['tagIdList'] = tagIdList;      
      return this.http.post(ServicesEndPoints.ELEMENTS + '/getElementsWithTags/', params, { headers : new HttpHeaders().set('Content-Type', 'application/json')});        
  }


  getElement(id: string) {
      return this.http.get(ServicesEndPoints.ELEMENTS + '/' + id);         
  }

/*
  getTags() {
      console.log('Entré dans la fonction'); 
      return this.http.get(ServicesEndPoints.TAGS+ '/user/' + localStorage.getItem('user_id'));
  }
*/

  getElementsByType(type: string){
      console.log(type); 
      console.log(localStorage.getItem('user_id')); 
      return this.http.get(ServicesEndPoints.ELEMENTS + '/type/' + type + '/user/'  + localStorage.getItem('user_id'));
  } 


  moveToRecycleBin(element: Element)  {
    console.log('data move to recycle bin'); 
    console.log(element); 
    let params = {};
    params['element'] = element;     
    return this.http.put(ServicesEndPoints.ELEMENTS + '/recycle', element, { headers : new HttpHeaders().set('Content-Type', 'application/json')});
  }  


  addElement(element: Element)  {
    return this.http.post(ServicesEndPoints.ELEMENTS, element, { headers : new HttpHeaders().set('Content-Type', 'application/json')});
  }  


  addTagToElement(tag_id : string, element_id : string) {
    let params = {};
    params['tag_id'] = tag_id;
    params['element_id'] = element_id;
    return this.http.post(ServicesEndPoints.ELEMENTS + '/addtag', params, { headers : new HttpHeaders().set('Content-Type', 'application/json')});    
  }



  deleteTagFromElement(tag_id : string, element_id : string) {
    let params = {};
    params['tag_id'] = tag_id;
    params['element_id'] = element_id;
    return this.http.post(ServicesEndPoints.ELEMENTS + '/deletetag', params, { headers : new HttpHeaders().set('Content-Type', 'application/json')});    
  }

  deleteElement(id: string) {
    return this.http.delete(ServicesEndPoints.ELEMENTS + '/' + id);
  }

  editElement(element: Element) {
    console.log('data elem'); 
    let params = {};
    params['element'] = element; 

    return this.http.put(ServicesEndPoints.ELEMENTS, params,  { headers : new HttpHeaders().set('Content-Type', 'application/json')});
  }

  /*********************************************************************** 
  *                         POSTS
  ***********************************************************************/


  getPosts()  {
    console.log('Entré dans la fonction'); 
      return this.http.get(ServicesEndPoints.POSTS);
  }
/*
  addTagToPost(tag_id : number, post_id : number) {
    let params = {};
    params['tag_id'] = tag_id;
    params['post_id'] = post_id;
    return this.http.post(ServicesEndPoints.POSTS + '/addtag', params, { headers : new HttpHeaders().set('Content-Type', 'application/json')});    
  }

  deleteTagFromPost(tag_id : number, post_id : number) {
    let params = {};
    params['tag_id'] = tag_id;
    params['post_id'] = post_id;
    return this.http.put(ServicesEndPoints.POSTS + '/deletetag', params, { headers : new HttpHeaders().set('Content-Type', 'application/json')});    
  }
*/


  addPost(post: Post)  {
    return this.http.post(ServicesEndPoints.POSTS, post, { headers : new HttpHeaders().set('Content-Type', 'application/json')});
  }  

  getPost(id) {
      return this.http.get(ServicesEndPoints.POSTS + '/' + id);         
  }

  deletePost(id: number)  {
    return this.http.delete(ServicesEndPoints.POSTS + '/' + id);         
  }

  editPost(post: Post)  {
    let params = {};
    params['post'] = post; 

    return this.http.put(ServicesEndPoints.POSTS, params,  { headers : new HttpHeaders().set('Content-Type', 'application/json')});
  }


  /*********************************************************************** 
  *                         TAGS
  ***********************************************************************/

/*
  getCategories() {
    console.log(ServicesEndPoints.CATEGORIES + '/user/' + localStorage.getItem('user_id')); 
    return this.http.get(ServicesEndPoints.CATEGORIES + '/user/' + localStorage.getItem('user_id'));
  }  

*/

  getTags() {
      console.log('Entré dans la fonction'); 
      return this.http.get(ServicesEndPoints.TAGS+ '/user/' + localStorage.getItem('user_id'));
  }

  addTag(tag: Tag)  {
    return this.http.post(ServicesEndPoints.TAGS, tag, { headers : new HttpHeaders().set('Content-Type', 'application/json')});
  }  

  getTag(id)   {
      return this.http.get(ServicesEndPoints.TAGS + '/' + id);         
  }

  deleteTag(id: string)  {
         console.log('Data => ' + id); 

    return this.http.delete(ServicesEndPoints.TAGS + '/' + id);         
  }

  editTag(tag: Tag)  {

    let params = {};
    params['tag'] = tag; 
    console.log('data edit tag'); 
    console.log(tag); 
    console.log(params); 
    return this.http.put(ServicesEndPoints.TAGS, params,  { headers : new HttpHeaders().set('Content-Type', 'application/json')});
  }



  /*********************************************************************** 
  *                         CONTACTS
  ***********************************************************************/

/*
  getContacts()
  {
      return this.http.get(ServicesEndPoints.CONTACTS);
  }


  deleteContact(id: number)
  {
    return this.http.delete(ServicesEndPoints.CONTACTS + '/' + id);
  }

  updateContact(id: number, contact: Contact)
  {
    let params = {};
    params['Contact'] = contact; 
    params['Id'] = id; 

    return this.http.put(ServicesEndPoints.CONTACTS, params,  { headers : new HttpHeaders().set('Content-Type', 'application/json')});
  }

  addContact(contact: Contact) 
  {
    return this.http.post(ServicesEndPoints.CONTACTS, contact,  { headers : new HttpHeaders().set('Content-Type', 'application/json')});
  }


  loadContactDetails(id)
  {
      return this.http.get(ServicesEndPoints.CONTACTS + '/' + id);
  }




  getContactRoles()
  {
      return this.http.get(ServicesEndPoints.CONTACTS_ROLES);
  }
*/

  /*********************************************************************** 
  *                         CONTACT LISTS
  ***********************************************************************/

/*
  addContactList(name) 
  {
    var json = {name : name};
    return this.http.post(ServicesEndPoints.CONTACT_LIST, json,  { headers : new HttpHeaders().set('Content-Type', 'application/json')});
  }

  updateContactList(id: number, nom: string)
  {
    let params = {};
    params['nom'] = nom; 
    params['id'] = id; 

    return this.http.put(ServicesEndPoints.CONTACT_LIST, params,  { headers : new HttpHeaders().set('Content-Type', 'application/json')});
  }

  getContactLists()
  {
      return this.http.get(ServicesEndPoints.CONTACT_LIST);
  }

  getListcontact(id)
  {
    return this.http.get(ServicesEndPoints.CONTACT_LIST + '/' + id);
  }
  
  getContactsInContactlist(id) // id = id de la liste de contacts
  {
    return this.http.get(ServicesEndPoints.CONTACT_LIST_CONTACTS_IN + '/' + id);
  }

  getContactsNotInContactlist(id)
  {
    return this.http.get(ServicesEndPoints.CONTACT_LIST_CONTACTS_NOT_IN + '/' + id);
  }

  addContactsInContactlist(contact_id, list_id)
  {
    return this.http.get(ServicesEndPoints.CONTACT_LIST_ADD_CONTACT_IN + '/' + contact_id + '/' + list_id);
  }

  deleteContactsFromContactlist(contact_id, list_id)
  {
    return this.http.get(ServicesEndPoints.CONTACT_LIST_DELETE_CONTACT_FROM + '/' + contact_id + '/' + list_id);
  }

  deleteContactList(list_id: number) 
  {
    return this.http.delete(ServicesEndPoints.CONTACT_LIST + '/' + list_id);
  }
  */

  /*********************************************************************** 
  *                         SITES
  ***********************************************************************/
/*
  getSites()
  {
      return this.http.get(ServicesEndPoints.SITE);
  }

  addSite(site: Site) 
  {
    return this.http.post(ServicesEndPoints.SITE, site,  { headers : new HttpHeaders().set('Content-Type', 'application/json')});
  }


  getSite(id)
  {
      return this.http.get(ServicesEndPoints.SITE + '/' + id);
  }

  updateSite(id: number, site: Site)
  {
    let params = {};
    params['Site'] = site; 
    params['Id'] = id; 

    return this.http.put(ServicesEndPoints.SITE, params,  { headers : new HttpHeaders().set('Content-Type', 'application/json')});
  }

  deleteSite(id: number)
  {
    return this.http.delete(ServicesEndPoints.SITE + '/' + id);
  }
*/
  /*********************************************************************** 
  *                         REGIONS
  ***********************************************************************/

  /*

  getRegions()
  {
      console.log('Réginos - On choppe la liste des régions possibles'); 
      
      return this.http.get(ServicesEndPoints.SITE_REGION);
  } 
  */ 
}
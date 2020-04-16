import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Post } from './../../core/model/post/post.model';

import { DataService } from '../../core/data/data.service';

import 'rxjs/Rx';

@Injectable()

export class PostService 
{
	// currentPostChanged  = new Subject<Post>();


  	constructor(private http: Http, private dataService: DataService) {

/*        this.dataService.getPosts()
        .subscribe(data => 
        {
            console.log('Data get posts ? : '); 
            console.log(data);
            // this.city = data['a'][0]['city_name']; 
            // this.citynameChanged.next(this.city);
            // console.log(this.city); 
        }); */
    }


    getPost(id: number) {
        console.log('getPost  -> On choppe le post avec id ' + id); 
        return this.dataService.getPost(id); 
    }


    /*addTagToPost(tagid: number, postid: number){
        console.log('Post service : on va ajouter le tag ' + tagid + ' au post ' + postid);
        return this.dataService.addTagToPost(tagid, postid);
    }

    deleteTagFromPost(tagid: number, postid: number){
        console.log('Post service : on va supprimer le tag ' + tagid + ' du post ' + postid);
        return this.dataService.deleteTagFromPost(tagid, postid);
    }
    /*

	setPost(post: Post)
	{
	    console.log('setPost');
	    console.log(post);

        // this.currentPostChanged.next(post);
        console.log('currentPostChanged2');
	}
*/
    deletePost(id: number) {
        return this.dataService.deletePost(id);          
    }
}

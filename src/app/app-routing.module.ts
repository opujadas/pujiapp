
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { DocumentationComponent } from './pages/documentation/documentation.component';
import { UserComponent } from './pages/user/user.component';
import { UserLoginComponent } from './pages/user/user-login/user-login.component';
import { UserLogoutComponent } from './pages/user/user-logout/user-logout.component';
import { UserSignupComponent } from './pages/user/user-signup/user-signup.component';
import { CategoryComponent } from './pages/category/category.component';
import { CategoryAddComponent } from './pages/category/category-add/category-add.component';
import { CategoryEditComponent } from './pages/category/category-edit/category-edit.component';

import { PostComponent } from './pages/elements/post/post.component';
import { PostAddComponent } from './pages/elements/post/post-add/post-add.component';
import { PostEditComponent } from './pages/elements/post/post-edit/post-edit.component';
import { PostListComponent } from './pages/elements/post/post-list/post-list.component';

import { TagComponent } from './pages/tag/tag.component';
import { TagAddComponent } from './pages/tag/tag-add/tag-add.component';
import { TagEditComponent } from './pages/tag/tag-edit/tag-edit.component';

import { ContactComponent } from './pages/contact/contact.component';
import { ContactAddComponent } from './pages/contact/contact-add/contact-add.component';
import { ContactEditComponent } from './pages/contact/contact-edit/contact-edit.component';
import { ListContactComponent } from './pages/list-contact/list-contact.component';
import { ListContactAddComponent } from './pages/list-contact/list-contact-add/list-contact-add.component';
import { ListContactEditComponent } from './pages/list-contact/list-contact-edit/list-contact-edit.component';

import { SiteComponent } from './pages/site/site.component';
import { SiteAddComponent } from './pages/site/site-add/site-add.component';
import { SiteEditComponent } from './pages/site/site-edit/site-edit.component';


import { ElementListComponent } from './pages/elements/element-list/element-list.component';

import { ViewLayoutComponent } from './pages/layouts/views/view-layout.component';
import { ViewAddComponent } from './pages/view/view-add/view-add.component';
import { ViewComponent } from './pages/view/view.component';


import { TestComponent } from './pages/test/test.component';

import { AuthGuardService as AuthGuard } from './guard/auth-guard.service';

// import { ContactComponent } from './pages/contact/contact.component';
// import { TestComponent } from './test/test.component';
// import { ContactAddComponent } from './contact/contact-add/contact-add.component';
// import { ContactEditComponent } from './contact/contact-edit/contact-edit.component';
// import { ContactStartComponent } from './contact/contact-start/contact-start.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent }, 

  { path: 'views', component: ViewLayoutComponent, canActivate: [AuthGuard], children: [
      { path: 'elements', component: ElementListComponent, canActivate: [AuthGuard] },
      { path: 'add/:parentid', component: ViewAddComponent, canActivate: [AuthGuard] }, 
      /* { path: ':elementtypeid', component: PostListComponent, canActivate: [AuthGuard] } */
      { path: ':idview', component: ViewComponent, canActivate: [AuthGuard] }
  ] },  


  { path : 'categories', component: CategoryComponent, canActivate: [AuthGuard] }, 
  { path : 'categories/add', component: CategoryAddComponent, canActivate: [AuthGuard] }, 
  { path : 'categories/edit/:id', component: CategoryEditComponent, canActivate: [AuthGuard] }, 


  { path : 'posts', component: PostComponent, canActivate: [AuthGuard] }, 
  { path : 'posts/add', component: PostAddComponent, canActivate: [AuthGuard] }, 
  { path : 'posts/edit/:id', component: PostEditComponent, canActivate: [AuthGuard] }, 
  { path : 'posts/edit/:id/:elementid', component: PostEditComponent, canActivate: [AuthGuard] }, 

  { path : 'tags', component: TagComponent, canActivate: [AuthGuard] }, 
  { path : 'tags/add', component: TagAddComponent, canActivate: [AuthGuard] }, 
  { path : 'tags/edit/:id', component: TagEditComponent, canActivate: [AuthGuard] }, 


  { path : 'contacts', component: ContactComponent, canActivate: [AuthGuard] }, 
  { path : 'contacts/add', component: ContactAddComponent, canActivate: [AuthGuard] }, 
  { path : 'contacts/edit/:id', component: ContactEditComponent, canActivate: [AuthGuard] }, 

/*  { path : 'contactlists', component: ListContactComponent, canActivate: [AuthGuard] }, 
  { path : 'contactlists/add', component: ListContactAddComponent, canActivate: [AuthGuard] }, 
  { path : 'contactlists/edit/:id', component: ListContactEditComponent, canActivate: [AuthGuard] }, 

  { path : 'sites', component: SiteComponent, canActivate: [AuthGuard] }, 
  { path : 'sites/add', component: SiteAddComponent, canActivate: [AuthGuard] }, 
  { path : 'sites/edit/:id', component: SiteEditComponent, canActivate: [AuthGuard] }, 
*/
  { path : 'documentation', component: DocumentationComponent, canActivate: [AuthGuard] }, 

  { path: 'user', component: UserComponent, children: [
    { path: 'login', component: UserLoginComponent },
    { path: 'logout', component: UserLogoutComponent },
    { path: 'signup', component: UserSignupComponent },
    { path: 'activate', component: UserSignupComponent }
  ]},

  { path : 'test', component: TestComponent, canActivate: [AuthGuard] }, 


  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes), RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}

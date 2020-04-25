import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { Http, HttpModule} from '@angular/http';
import { HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { ToastModule } from 'ng6-toastr/ng2-toastr';
import { SlimLoadingBarModule} from 'ng2-slim-loading-bar';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatSidenavModule} from '@angular/material/sidenav';
import { AngularDraggableModule } from 'angular2-draggable';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


import {  MatDialogModule,
          MatButtonModule, 
          MatCheckboxModule, 
          MatMenuModule, 
          MatTabsModule, 
          MatSlideToggleModule,
          MatToolbarModule,
          MatListModule,
          MatInputModule,
          MatSelectModule,
          MatGridListModule,
          MatChipsModule,
          MatTooltipModule,
          MatExpansionModule,
          MatPaginatorModule,
          MatIconModule

            
        } from '@angular/material';

import {MatTreeModule} from '@angular/material/tree';


import { HtmlcontentPipe } from './core/pipes/htmlcontent.pipe'; 


//import { MatDialogfrom '@angular/material';
// import { MatIconRegistry,MatIcon} from '@angular/material/icon/icon';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };


import { TestComponent } from './pages/test/test.component';

import { UserComponent } from './pages/user/user.component';
import { UserLoginComponent } from './pages/user/user-login/user-login.component';
import { UserLogoutComponent } from './pages/user/user-logout/user-logout.component';
import { UserSignupComponent } from './pages/user/user-signup/user-signup.component';

import { AuthService } from './guard/auth.service';
import { AuthGuardService } from './guard/auth-guard.service';

import { CategoryComponent } from './pages/category/category.component';
import { CategoryListComponent, DialogSupprimerCategory } from './pages/category/category-list/category-list.component';
import { CategoryService } from './core/service/category.service';
import { CategoryListService } from './core/service/category-list.service';
import { CategoryAddComponent } from './pages/category/category-add/category-add.component';
import { CategoryEditComponent } from './pages/category/category-edit/category-edit.component';


import { PostComponent } from './pages/elements/post/post.component';
//import { PostStartComponent } from './pages/post/post-start/post-start.component';
import { PostListComponent, DialogSupprimerPost } from './pages/elements/post/post-list/post-list.component';
import { PostListService } from './core/service/post-list.service';
import { PostService } from './core/service/post.service';
import { PostAddComponent } from './pages/elements/post/post-add/post-add.component';
import { PostEditComponent } from './pages/elements/post/post-edit/post-edit.component';

import { ElementService } from './core/service/element.service';
import { ElementListService } from './core/service/element-list.service';


import { TagComponent } from './pages/tag/tag.component';
//import { TagStartComponent } from './pages/tag/tag-start/tag-start.component';
import { TagListComponent, DialogSupprimerTag } from './pages/tag/tag-list/tag-list.component';
import { TagListService } from './core/service/tag-list.service';
import { TagService } from './core/service/tag.service';
import { TagAddComponent } from './pages/tag/tag-add/tag-add.component';
import { TagEditComponent } from './pages/tag/tag-edit/tag-edit.component';
import { TagelementComponent } from './pages/tag/tagelement/tagelement.component';



import { ContactComponent } from './pages/contact/contact.component';
import { ContactStartComponent } from './pages/contact/contact-start/contact-start.component';
import { ContactListComponent, DialogOverviewExampleDialog } from './pages/contact/contact-list/contact-list.component';
import { ContactListService } from './pages/contact/contact-list/contact-list.service';
import { ContactService } from './core/service/contact.service';
import { ContactAddComponent } from './pages/contact/contact-add/contact-add.component';
import { ContactEditComponent } from './pages/contact/contact-edit/contact-edit.component';

import { ListContactComponent, DialogSupprimerContactList } from './pages/list-contact/list-contact.component';
import { ListContactAddComponent } from './pages/list-contact/list-contact-add/list-contact-add.component';
import { ListContactEditComponent } from './pages/list-contact/list-contact-edit/list-contact-edit.component';
import { ListContactService } from './core/service/list-contact.service';

import { SiteComponent } from './pages/site/site.component';
import { SiteService } from './pages/site/site.service';
import { SiteAddComponent } from './pages/site/site-add/site-add.component';
import { SiteEditComponent } from './pages/site/site-edit/site-edit.component';
import { SiteListComponent, DialogSupprimerSite } from './pages/site/site-list/site-list.component';
import { SiteListService } from './pages/site/site-list/site-list.service';

import { ElementListComponent } from './pages/elements/element-list/element-list.component';
import { ElementComponent, DialogEditPost } from './pages/elements/element/element.component';

import { DataService } from './core/data/data.service';

import { ViewLayoutComponent, DialogSelectorTags} from './pages/layouts/views/view-layout.component';
import { DialogAddChildView } from './pages/layouts/views/dialogs/dialog-add-child-view.component';
import { ViewAddComponent } from './pages/view/view-add/view-add.component';
import { ViewComponent, DialogEditView } from './pages/view/view.component';
import { ViewService } from './core/service/view.service';
import { ChildrenviewComponent } from './pages/view/childrenview/childrenview.component';

import { TreeviewmenuComponent } from './pages/layouts/views/menus/treeviewmenu.component';



import { HeaderComponent } from './pages/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { DocumentationComponent } from './pages/documentation/documentation.component';

import { AppRoutingModule } from './app-routing.module';
import { MatTableModule} from '@angular/material/table';
import { ColorPickerModule } from 'ngx-color-picker';

import { WebsocketService } from './core/socket/websocket.service';
import { WebsocketmessageService } from './core/socket/websocketmessage.service';

import {TranslateLoader, TranslateModule, TranslateService, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
// import { DragulaModule } from 'ng2-dragula';
import {DndModule} from 'ng2-dnd';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
   HomeComponent,
   DocumentationComponent,
   TestComponent,
   CategoryComponent,
   CategoryListComponent,
   CategoryAddComponent,
   CategoryEditComponent,
    UserComponent,
    UserLoginComponent,
    UserLogoutComponent,
    UserSignupComponent,
    PostComponent,
    PostListComponent,
    PostAddComponent,
    PostEditComponent,
    PostComponent,
    PostListComponent,
    PostAddComponent,
    PostEditComponent,
    TagComponent,
    TagListComponent,
    TagAddComponent,
    TagEditComponent,
    TagComponent,
    TagListComponent,
    TagAddComponent,
    TagEditComponent,
    TagelementComponent,
    ContactComponent,
    ContactListComponent, 
    ContactAddComponent,
    ContactEditComponent,
    SiteComponent,
    SiteListComponent,
    SiteAddComponent,
    SiteEditComponent,
    ListContactComponent,
    ListContactAddComponent,
    ListContactEditComponent,
    ViewLayoutComponent, 
    ViewAddComponent,
    ViewComponent,
    ChildrenviewComponent,
    TreeviewmenuComponent,
    
    ElementListComponent,
      ElementComponent, 

    DialogOverviewExampleDialog,
    DialogSupprimerContactList,
    DialogSupprimerSite ,
    
    DialogSupprimerPost,
    DialogSupprimerCategory,
    DialogSupprimerTag,
    DialogSelectorTags, 
    DialogEditPost,
    DialogEditView,
    DialogAddChildView,
    HtmlcontentPipe
  ],
  
  entryComponents: [
      DialogSupprimerPost, 
      DialogOverviewExampleDialog, 
      DialogSupprimerContactList, 
      DialogSupprimerSite, 
      DialogSupprimerCategory, 
      DialogSupprimerTag,
      DialogSelectorTags,
      DialogEditPost,
      DialogEditView,
      DialogAddChildView
  ],

  imports: [
    BrowserModule, 
    BrowserAnimationsModule, 
    ToastModule.forRoot(),
    SlimLoadingBarModule.forRoot(),
    SocketIoModule.forRoot(config), 
ColorPickerModule,
        FlexLayoutModule, 

FormsModule,
ReactiveFormsModule,
HttpModule,
HttpClientModule,

     MatDialogModule,
          MatButtonModule, 
          MatCheckboxModule, 
          MatMenuModule, 
          MatTabsModule, 
          MatSlideToggleModule,
          MatToolbarModule,
          MatSidenavModule,
          MatListModule,
          MatInputModule,
          AppRoutingModule,
          MatTableModule,
          MatSelectModule,
          MatGridListModule,
          MatChipsModule,
          MatTooltipModule,
          MatExpansionModule,
          MatPaginatorModule,
          MatIconModule,

          MatTreeModule, 
          /* DragulaModule.forRoot(), */
        DndModule.forRoot(),
        AngularDraggableModule,
        CKEditorModule, 

    TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (http: Http) => new TranslateStaticLoader(http, '/assets/i18n', '.json'),
            deps: [Http]
    })



  ],
  exports: [
  TranslateModule
  ],
  providers: [
      AuthService, 
      AuthGuardService, 
      DataService, 
      ElementService,
      ElementListService,
      ContactListService, 
      ContactService, 
      SiteService, 
      SiteListService, 
      ListContactService,
      PostService,
      PostListService,
      TagService,
      TagListService,
      CategoryService,
      CategoryListService,
      WebsocketService,
      WebsocketmessageService,
      TranslateService,
      ViewService],
      
  bootstrap: [AppComponent]
})
export class AppModule { }

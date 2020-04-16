import { Component, OnInit, OnDestroy, EventEmitter  } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; 
import { DataService } from '../../../core/data/data.service';
import { ContactService } from './../../../core/service/contact.service';import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core';
import { FormsModule, FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { Contact } from './../../../core/model/contact/contact.model';
import { AppRoutingModule } from '../../../app-routing.module';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})


export class ContactEditComponent implements OnInit, OnDestroy {

	editContactForm: FormGroup; 

	id: number;

	private nom : string; //  = 'Lille'; 
	private prenom : string; //  = 'Lille'; 
	private telephone : string; //  = 'Lille'; 
	private actif : number; //  = 'Lille'; 

	private role_id : number; //  = 'Lille'; 
	private contact_id : number; //  = 'Lille'; 
	private site_id : number; //  = 'Lille'; 

  	roles : any;  
  	sites : any;  
  	private subscription: Subscription;
    private subscription2: Subscription;
    private subscription3: Subscription;
    private subscription4: Subscription;
    private subscription5: Subscription;

  	constructor(
  		private contactService: ContactService,
  		private slimLoadingBarService: SlimLoadingBarService, 
  		public toastr: ToastsManager, 
  		vcr: ViewContainerRef, 
  		private router: Router, 
  		private route: ActivatedRoute,
  		private dataService: DataService  	) 
  	{

      this.slimLoadingBarService.start(() => { console.log('Début de la loading bar'); });

      this.subscription = this.contactService.currentContactChanged
        .subscribe(data => 
        {
        	this.nom = data.nom; 
        	this.prenom = data.prenom; 
        	this.telephone = data.telephone; 	
        	this.actif = data.actif;
          this.role_id = data.role_id;
        	this.site_id = data.site_id;
        	this.id = data.id;
        });

      // On charge les différents roles pour les contacts 
      this.subscription2 = this.dataService.getContactRoles()
        .subscribe(
          data => 
          {
            console.log(data); 
            this.roles = data; 
            this.toastr.success('Les rôles sont chargés !', 'Success!');
            this.slimLoadingBarService.complete();  
          }
      );

      // On charge les différents roles pour les contacts 
      this.subscription3 = this.dataService.getSites()
        .subscribe(
          data => 
          {
            this.sites = data;
            this.toastr.success('Les sites sont chargés !', 'Success!');
            this.slimLoadingBarService.complete();  
          }
      );
 	 }


  ngOnInit() 
  {
    this.id = +this.route.snapshot.url[2].path; 
  	
   	console.log('ID : ' + this.id); 

    this.subscription4 = this.route.params
      .subscribe(
        (params: Params) => {
          	this.id = +params['id'];
          	this.contactService.getContact(this.id); 
		    // Dans tous les cas on initialise le formulaire
		    console.log('Initialisation du form'); 
        }
      );

    this.initForm();
  }

	private initForm() 
	{
		let  nom = this.nom;
		let  prenom = this.prenom;
		let  telephone = this.telephone;
		let  actif = this.actif;
		let  role_id = this.role_id;
		let  site_id = this.site_id;

		this.editContactForm = new FormGroup(
		{
			'nom': new FormControl(nom), 
			'prenom': new FormControl(prenom),
			'telephone': new FormControl(telephone),
			'actif': new FormControl(actif),
			'role_id': new FormControl(role_id),
			'site_id': new FormControl(site_id)
		});
		
    this.slimLoadingBarService.complete();  
	}


  onEditContact() 
  {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDeleteContact()
  {
  	return this.dataService.deleteContact(this.id)
  	  .subscribe(
  	    data => 
  	    {
  	    	// Là en fait, je mets un contact bidon, juste pour changer le currentContactChanged dans le contactService et répercuter/actualiser la liste de contacts
  			 let contact = new Contact('', '', '', 0, -1, -1);	
  			 this.contactService.setContact(contact);
         this.toastr.success('Le contact a bien été supprimé !', 'Success!');
  	     this.slimLoadingBarService.complete();  
  		    this.router.navigate([ '/contact' ]);
  	    }
  	); 	
  }


	onSubmit()
	{
      // Démarrage de la barre de chargement 
      this.slimLoadingBarService.start(() => { console.log('Début de la loading bar'); });

		let contact = new Contact(
			this.editContactForm.value.nom,
			this.editContactForm.value.prenom,
			this.editContactForm.value.telephone,
			this.editContactForm.value.actif,
			this.editContactForm.value.role_id,
			this.editContactForm.value.site_id
		);	 


		    return this.dataService.updateContact(this.id, contact)
		      .subscribe(
		        data => 
		        {
		          this.toastr.success('Le contact a bien été modifié !', 'Success!');
  				    this.slimLoadingBarService.complete();  
              this.router.navigate(['/contacts'], {relativeTo: this.route});
		        }
		    ); 	
		}

  ngOnDestroy() 
  {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();
  }

}
export class Contact {
  public id: number; 
  public nom: string;
  public prenom: string;
  public telephone: string;
  public actif: number;
  public role_id: number;
  public site_id: any;
  
  constructor(nom: string, prenom: string, telephone: string, actif: number, role_id: number, site_id: number) 
  {
    this.nom = nom;
    this.prenom = prenom;
    this.telephone = telephone;
    this.actif = actif;
    this.role_id = role_id;
    this.site_id = site_id;
  }
}

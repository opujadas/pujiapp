export class Site {
  public id: number; 
  public code_site: string;
  public ville: string;
  public region_id: number;
  public entrepot_id: string;
  public siret: string;
  public adresse: string;
  public adresse2: string;
  public cp: string;
  public telephone: string;
  
  constructor(    code_site: string, 
                  ville: string,
                  /*
                  entrepot_id: string, 
                  siret: string, */
                  adresse: string,
                  adresse2: string,
                  cp: string,
                  telephone : string,
                  region_id: number
                  ) 
  {
    this.code_site = code_site;
    this.ville = ville;
    this.region_id = region_id;
    /*
    this.entrepot_id = entrepot_id;
    this.siret = siret; */
    this.adresse = adresse;
    this.adresse2 = adresse2;
    this.cp = cp;
    this.telephone = telephone;
  }
}

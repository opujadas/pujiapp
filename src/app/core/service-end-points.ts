export class ServicesEndPoints {
  /**
   * Global end point services
   * @type {string}
   */
  public static SERVICES_ENDPOINT: string = 'http://localhost:3000/api';
  public static MYSQL_SERVICES_ENDPOINT: string = 'http://localhost:3000';



  /*********************************************
   * USERS END POINTS
   *********************************************/
  public static USERS: string = ServicesEndPoints.SERVICES_ENDPOINT + '/users';


  /*********************************************
   * VIEWS END POINTS
   *********************************************/
  public static VIEWS: string = ServicesEndPoints.SERVICES_ENDPOINT + '/views';


  /*********************************************
   * ELEMENTS END POINTS
   *********************************************/
  public static ELEMENTS: string = ServicesEndPoints.SERVICES_ENDPOINT + '/elements';


  /*********************************************
   * CATEGORIES END POINTS
   *********************************************/
  public static CATEGORIES: string = ServicesEndPoints.SERVICES_ENDPOINT + '/categories';
    

  /*********************************************
   * MESSAGES END POINTS
   *********************************************/
  public static MESSAGES: string = ServicesEndPoints.SERVICES_ENDPOINT + '/messages';


  /*********************************************
   * POSTS END POINTS
   *********************************************/
  public static POSTS: string = ServicesEndPoints.SERVICES_ENDPOINT + '/posts';

  /*********************************************
   * TAGS END POINTS
   *********************************************/
  public static TAGS: string = ServicesEndPoints.SERVICES_ENDPOINT + '/tags';



  /*********************************************
   * CONTACTS END POINTS
   *********************************************/
  public static CONTACTS: string = ServicesEndPoints.SERVICES_ENDPOINT + '/contacts';
  public static CONTACTS_ROLES: string = ServicesEndPoints.SERVICES_ENDPOINT + '/contacts/roles';


}
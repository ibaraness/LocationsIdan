import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

const fakeData = {
  locations:[
    {
      name:'Home',
      address:'Katsenelson 42, Bat-Yam, Israel',
      coordinates:'1000000,1000000',
      category:['Default']
    }
  ],
  categories:[{name:'Default', color:'#ffffff'}]
};

@Injectable()
export class DataService {

  constructor(private localStorageService:LocalStorageService) { 
    this.localStorageService.set('locations', fakeData.locations);
    this.localStorageService.set('categories', fakeData.categories);
  }

  /**
   * Get all locations
   */
  public getLocations():object{
    return fakeData.locations;
  }

  /**
   * Get all categories
   */
  public getCategories():object{
    return fakeData.categories;
  }

  public addCategory(name:string, color:string = '#ffffff'):Array<object>{
    let categories = this.localStorageService.get('categories');
    if(Array.isArray(categories)){
      categories.push({name, color});
      this.localStorageService.set('categories', categories);
      return categories;
    }
    return [];
  }

}

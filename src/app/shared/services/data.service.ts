import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { LocationModel, CategoryModel } from './../../models/interfaces';
const fakeData = {
  locations:[
    {
      name:'Home',
      address:'Katsenelson 42, Bat-Yam, Israel',
      coordinates:'1000000,1000000',
      category:['Default']
    }
  ],
  categories:[
    {name:'Default', color:'#ffffff'},
    {name:'Friends', color:'#6699FF'}
  ]
};

@Injectable()
export class DataService {
  //TODO: Change all getters to return Promises or Observables 
  constructor(private localStorageService:LocalStorageService) { 
    // this.localStorageService.set('locations', fakeData.locations);
    // this.localStorageService.set('categories', fakeData.categories);
  }

  /**
   * Get all locations
   */
  public getLocations(category:string = null):Array<LocationModel>{
    const locations = this.localStorageService.get('locations');
    if(!locations){
      return [];
    }
     if(category){
        return locations.filter(c => c.category.indexOf(category) >= 0);
      }
    return locations;
  }

  public getLocation(name:string):LocationModel{
    return this.getLocations().find(location => location.name === name);
  }

  public locationExist(name:string):number{
    return this.getLocations().findIndex(l => l.name.toLowerCase() === name.toLowerCase());
  }

  public removeLocation(location:LocationModel){
    const exist = this.locationExist(location.name);
    if(exist >= 0){
      const locations = this.getLocations();
      locations.splice(exist,1);
      this.localStorageService.set('locations', locations);
    } 
  }

  public removeCategoryLocations(categoryName:string){
    const locations = this.getLocations(categoryName);
    if(locations.length){
      locations.forEach(location =>{
        this.removeLocation(location);
      })
    }
  }

  /**
   * Add location to locations list. Important: Existing location will be overriten
   * @param location Required. Location object
   * @param name     Optional. A name of a location to be replaced with the new location
   */
  public setLocation(location:LocationModel, name:string = null){
    const exist = this.locationExist(name || location.name);
    const locations = this.getLocations();
    if(exist >= 0){
      locations[exist] = location;
    }else {
      locations.push(location);
    }
    this.localStorageService.set('locations', locations);
  }

  /**
   * Get all categories
   */
  public getCategories():Array<CategoryModel>{
    return this.localStorageService.get('categories');
  }

  public getCategory(name:string):CategoryModel{
    return this.getCategories().find(c => c.name === name);
  }

  public categoryExist(name:string):number{
    return this.getCategories().findIndex(c => c.name.toLowerCase() === name.toLowerCase());
  }

  public removeCategoty(category:CategoryModel){
    const exist = this.categoryExist(category.name);
    if(exist >= 0){
      const categories = this.getCategories();
      categories.splice(exist,1);
      this.localStorageService.set('categories', categories);
      this.removeCategoryLocations(category.name);
    } 
  }

  public setCategory(category:CategoryModel, name:string = null){
    const exist = this.categoryExist(name || category.name);
    const categories  = this.getCategories();
    if(exist >= 0){
      categories[exist] = category;
    }else {
      categories.push(category);
    }
    this.localStorageService.set('categories', categories);
  }

  public addCategory(name:string, color:string = '#ffffff'):Array<object>{
    //TODO: Chaeck that there are no duplicates
    let categories = this.localStorageService.get('categories');
    if(Array.isArray(categories)){
      categories.push({name, color});
      this.localStorageService.set('categories', categories);
      return categories;
    }
    return [];
  }

}

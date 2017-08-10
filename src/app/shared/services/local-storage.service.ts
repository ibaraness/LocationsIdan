import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() { 
    if (typeof(Storage) === "undefined") {
      throw 'Your browser doesn\'t support localStorage';
    }
  }

  /**
   * Fetch data from local storage
   * @param name The reference name of the data to be fetched
   */
  public get(name:string):Array<object>{
    const locations = localStorage.getItem(name);
    if(locations){
      return JSON.parse(locations);
    }
    return null;
  }

  /**
   * Save an Object or Array in local storage
   * @param name The reference name of the data to be save (and later accessed) 
   * @param data An Array or Object to be saved
   */
  public set(name:string, data:any):void{
    localStorage[name] = JSON.stringify(data);
  }
}

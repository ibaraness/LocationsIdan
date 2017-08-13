import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActionModel } from "app/models/interfaces";

@Injectable()
export class StoreService {

  public store = new BehaviorSubject<ActionModel>(null);
  public changes = this.store.asObservable();

  constructor() { 

  }

  update(value:any){
    this.store.next(value);
  }

  recreate(){
    this.store = new BehaviorSubject<ActionModel>(null);
  }

}

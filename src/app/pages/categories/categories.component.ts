import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from './../../shared/services/data.service';
import { StoreService } from './../../shared/services/store.service';
import { ActionModel } from "app/models/interfaces";
import { Action } from "app/constants/enums";
import { Router } from "@angular/router";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, OnDestroy {

  categories:any = [];

  private storeSubscription;
  checkAll = false;

  private selectedCategories:Array<string> = [];

  constructor(
    private dataService:DataService,
    private storeService: StoreService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.categories = this.dataService.getCategories();
    this.storeSubscription = this.storeService.store.subscribe(data => {
      console.log("storeService", data);
      if(data && data.pageName === 'Categories'){
        /**
         * Create a new location
         */
        if(data.type === Action.NEW){
          this.storeService.update(null);
          this.router.navigate(['/single-category-edit']);
        }
      }
      
    })
  }

  selectAll(e){
    this.checkAll = e.target.checked;
  }

  updateSelectedCategories(e){
    const index = this.selectedCategories.indexOf(e.name);
    if(e.checked && index < 0){
      this.selectedCategories.push(e.name);
    }else if(!e.checked && index >= 0){
      this.selectedCategories.splice(index,1);
    }
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from './../../shared/services/data.service';
import { StoreService } from './../../shared/services/store.service';
import { ActionModel, CategoryModel } from "app/models/interfaces";
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

  ascendingNameSorting = true;

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

        /**
         * Update a single location on list
         */
        else if(data.type === Action.CHANGE_SINGLE_CATEGORY){
          const index = this.categories.findIndex(c => c.name === data.data.categoryName);
           this.categories[index] = this.dataService.getCategory(data.data.newCategoryName);
          this.storeService.update(null);
          //console.log("new item", data.data.newCategoryName, this.dataService.getCategory(data.data.newCategoryName));
        }
        /**
         * Update the list on change
         */
        else if(data.type === Action.CHANGE){
          this.storeService.update(null);
          this.refreshCategories();
        }
        /**
         * Remove item(s)
         */
        else if(data.type === Action.REMOVE){
          if(this.selectedCategories.length){
            let extraContent = '';
            const locations = this.categoriesHasChildren(this.selectedCategories);
            if(locations.length){
              extraContent = "Some of those categories has locations(" + locations.join(",") + "), all will be lost!";
            }
            const am:ActionModel = {
              type:Action.SHOW_CONFIRM_MODAL,
              pageName:'Categories',
              data:{
                title:'Remove Category',
                content:'Are you sure you want to delete Category(s)?',
                extraContent,
                action:{
                  type:Action.APPROVE_DELETE,
                  pageName:'Categories',
                  data:this.selectedCategories
                }
              }
            };
            this.storeService.update(am);
            this.selectedCategories = [];
          }
          
        }
      }
      
    })
  }

  categoriesHasChildren(categories:Array<string>){
    const hasChildren = [];
    categories.forEach(categoryName => {
      if(this.dataService.getLocations(categoryName).length){
        hasChildren.push(categoryName);
      }
    });
    return hasChildren;
  }

  refreshCategories(){
    this.categories = this.dataService.getCategories();
  }

  private getSortingFunction(key:string = 'name', sign:number = 1){
    const v1 = 1 * sign, v2 = -1 * sign;
    return (a:CategoryModel,b:CategoryModel) => a[key] > b[key]?v1:a[key] < b[key]?v2:0;
  }

  private sortByName(key){
    if(this.ascendingNameSorting){
      this.categories.sort(this.getSortingFunction(key));
      return;
    }
    this.categories.sort(this.getSortingFunction(key, -1));
  }

  toggleNameSort(){
    this.ascendingNameSorting = !this.ascendingNameSorting;
    this.sortByName('name');
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

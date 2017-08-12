import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from './../../shared/services/data.service';
import { LocationModel, ActionModel } from './../../models/interfaces';
import { ActivatedRoute, Router } from "@angular/router";
import { StoreService } from './../../shared/services/store.service';
import { Action } from './../../constants/enums';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalComponent } from './../../shared/components/modal/modal.component';
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit, OnDestroy {

  bsModalRef: BsModalRef;
  
  locations:LocationModel[];
  byCategory:string;
  checkAll = false;

  private selectedLocations:Array<string> = [];

  private storeSubscription;

  activeSorting = "name";
  ascendingNameSorting = true;
  ascendingCategorySorting = false;

  times = 0;

  constructor(
    private dataService:DataService,
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private modalService: BsModalService
  ) { }

  public openModalWithComponent() {
    this.bsModalRef = this.modalService.show(ConfirmModalComponent);
    this.bsModalRef.content.title = "Confirm Box";
    this.bsModalRef.content.content = "Do you really want to delete all?"
  }

  ngOnInit() {
    this.locations = this.dataService.getLocations();
     /**
     * Check if category was passed for in URL
     */
    this.route.paramMap.subscribe(paramMap => {
      this.byCategory = paramMap.get('category');
      if(this.byCategory){
        this.locations = this.dataService.getLocations(this.byCategory);
      }
      
      console.log("this.locations", this.locations);
    });

    /**
     * Subscribe for actions from header toolbar
     */
    this.storeSubscription = this.storeService.changes.subscribe(data => {
      if(data && data.pageName === 'Locations'){
        /**
         * Create a new location
         */
        if(data.type === Action.NEW){
          this.storeService.update(null);
          this.router.navigate(['/single-location-edit']);
        }
        /**
         * Update the list on change
         */
        else if(data.type === Action.CHANGE){
          this.storeService.update(null);
          this.refreshLocations();
        }
        /**
         * Remove item(s)
         */
        else if(data.type === Action.REMOVE){
          if(this.selectedLocations.length){
            console.log("SHOW_CONFIRM_MODAL times:", this.times)
            const am:ActionModel = {
              type:Action.SHOW_CONFIRM_MODAL,
              pageName:'Locations',
              data:{
                title:'Remove Location',
                content:'Are you sure you want to delete location(s)?',
                count:++this.times,
                action:{
                  type:Action.APPROVE_DELETE,
                  pageName:'Locations',
                  data:this.selectedLocations
                }
              }
            };
            this.storeService.update(am);
            this.selectedLocations = [];
          }
          
        }else {
          //console.log("Action in Locations", data)
        }
      } 
    });
  }

  selectAll(e){
    this.checkAll = e.target.checked;
  }

  private refreshLocations(){
    this.locations = this.dataService.getLocations();
    if(this.byCategory){
      this.locations = this.dataService.getLocations(this.byCategory);
    } 
  }

  private getSortingFunction(key:string = 'name', sign:number = 1){
    const v1 = 1 * sign, v2 = -1 * sign;
    return (a:LocationModel,b:LocationModel) => a[key] > b[key]?v1:a[key] < b[key]?v2:0;
  }

  private sortByName(key){
    if(this.ascendingNameSorting){
      this.locations.sort(this.getSortingFunction(key));
      return;
    }
    this.locations.sort(this.getSortingFunction(key, -1));
  }

  toggleNameSort(){
    this.ascendingNameSorting = !this.ascendingNameSorting;
    this.sortByName('name');
    this.activeSorting = 'name';
  }
  toggleCategorySort(){
    this.ascendingNameSorting = !this.ascendingNameSorting;
    this.sortByName('category');
    this.activeSorting = 'category';
  }

  updateSelectedLocations(e){
    const index = this.selectedLocations.indexOf(e.name);
    if(e.checked && index < 0){
      this.selectedLocations.push(e.name);
    }else if(!e.checked && index >= 0){
      this.selectedLocations.splice(index,1);
    }
    console.log("updateSelectedLocations", e, this.selectedLocations);
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }
}

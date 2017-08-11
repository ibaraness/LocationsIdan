import { Component, OnInit } from '@angular/core';
import { DataService } from './../../shared/services/data.service';
import { LocationModel } from './../../models/interfaces';
import { ActivatedRoute, Router } from "@angular/router";
import { StoreService } from './../../shared/services/store.service';
import { Action } from './../../constants/enums';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalComponent } from './../../shared/components/modal/modal.component';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {

  bsModalRef: BsModalRef;
  
  locations:LocationModel[];
  byCategory:string;
  checkAll = false;

  activeSorting = "name";
  ascendingNameSorting = true;
  ascendingCategorySorting = false;

  constructor(
    private dataService:DataService,
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private modalService: BsModalService
  ) { }

  public openModalWithComponent() {
    let list = ['Open a modal with component', 'Pass your data', 'Do something else', '...'];
    this.bsModalRef = this.modalService.show(ModalComponent);
    this.bsModalRef.content.title = 'Modal with component';
    this.bsModalRef.content.list = list;
    setTimeout(() => {
      list.push('PROFIT!!!');
    }, 2000);
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
    this.storeService.changes.subscribe(data => {
      if(data && data.pageName === 'Locations'){
        if(data.type === Action.EDIT){
          this.storeService.update(null);
          console.log("Edit locations");
        }else if(data.type === Action.NEW){
          this.storeService.update(null);
          this.router.navigate(['/single-location-edit']);
        }else if(data.type === Action.CHANGE){
          this.storeService.update(null);
          this.refreshLocations();
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
}

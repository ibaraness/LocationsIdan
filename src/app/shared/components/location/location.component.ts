import { Component, OnInit, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from './../../../shared/services/store.service';
import { Action } from './../../../constants/enums';
import { LocationModel, ActionModel } from "app/models/interfaces";
import { DataService } from './../../../shared/services/data.service';
import { EventEmitter, OnDestroy } from "@angular/core";

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit, OnDestroy {

  @Input() location:LocationModel;
  @Input() checked = false;

  @Output() selectionChanged = new EventEmitter();

  private editMode = false;
  private pendingDelete = false;
  private storeSubscription;

  constructor(
    private router: Router,
    private storeService: StoreService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    
    /**
     * Subscribe for actions from header toolbar
     */
    this.storeSubscription = this.storeService.store.subscribe(data => {
      if(this.checked && data && data.pageName === 'Locations'){
        /**
         * Edit location
         */
        if(data.type === Action.EDIT){
          this.storeService.update(null);
          this.editMode = true;
          console.log("Edit Location", this.location.name);
        }
        /**
         * Remove location
         */
        else if(data.type === Action.REMOVE){
          // this.storeService.update(null);
          // console.log("Remove Location", this.location.name);
          // this.pendingDelete = true;
          // //this.dataService.removeLocation(this.location);

          // const am:ActionModel = Object.assign({}, data, {type:Action.CHANGE})
          // this.storeService.update(am);

        }else if(data.type === Action.NEW){
          this.storeService.update(null);

        }else if(data.type === Action.COMPLETE && data.data.locationName && data.data.locationName === this.location.name){
          this.editMode = false;
        }else if(data.type === Action.APPROVE_DELETE && Array.isArray(data.data) && data.data.indexOf(this.location.name) >= 0){
          console.log(this.location.name + " Approved for deletion");
          this.dataService.removeLocation(this.location);
          const am:ActionModel = Object.assign({}, data, {type:Action.CHANGE})
          this.storeService.update(am);
          //this.router.navigate(['/locations']);
        }else {
          console.log("Data", data, Action.APPROVE_DELETE);
        }
      }
    });
  }

  click(){
    //data.data.title,data.data.content, data.data.action
    const am:ActionModel = {
      type:Action.SHOW_CONFIRM_MODAL,
      pageName:'Locations',
      data: {
        title:'Show Location',
        content:'Choose YES to show location on map, and NO to see Location details',
        action:{
          type:Action.SHOW_ON_MAP,
          pageName:'Locations',
          data:{location:this.location}
        }
      }
    }
    this.storeService.update(am);
  }

  changed(e){
    this.checked = e.target.checked;
    this.selectionChanged.emit({name:this.location.name, checked:this.checked});
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }

}

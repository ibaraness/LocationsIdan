import { Component, OnInit, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from './../../../shared/services/store.service';
import { Action } from './../../../constants/enums';
import { LocationModel, ActionModel } from "app/models/interfaces";
import { DataService } from './../../../shared/services/data.service';
import { EventEmitter, OnDestroy } from "@angular/core";
import { VibrationService } from "app/shared/services/vibration.service";

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
    private dataService: DataService,
    private vibrationService:VibrationService
  ) { }

  ngOnInit() {
    
    /**
     * Listen for store events
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
         * Cancel edit location(disable edit mode)
         */
        else if(data.type === Action.CANCEL_EDIT 
          && data.data.locationName && data.data.locationName === this.location.name){
          this.storeService.update(null);
          this.editMode = false;
        }
        /**
         * If action was completed (edit)
         */
        else if(data.type === Action.COMPLETE && data.data.locationName && data.data.locationName === this.location.name){
          this.editMode = false;
          const am: ActionModel = {
            type:Action.CHANGE_SINGLE_LOCATION,
            pageName:'Locations',
            data:data.data
          }
          this.storeService.update(am);
        }
        /**
         * Id deletion of a location was approved, delete it
         */
        else if(data.type === Action.APPROVE_DELETE && Array.isArray(data.data) && data.data.indexOf(this.location.name) >= 0){
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
    this.vibrationService.vibrate(500);
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
        },
        cancelAction: {
          type:Action.NAVIGATION,
          pageName:'Locations',
          data:{path:'/single-location/' + this.location.name}
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

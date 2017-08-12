import { Component, OnInit, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from './../../../shared/services/store.service';
import { Action } from './../../../constants/enums';
import { LocationModel, ActionModel } from "app/models/interfaces";
import { DataService } from './../../../shared/services/data.service';
import { EventEmitter } from "@angular/core";

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

  @Input() location:LocationModel;
  @Input() checked = false;

  @Output() selectionChanged = new EventEmitter();

  private editMode = false;
  private pendingDelete = false;

  constructor(
    private router: Router,
    private storeService: StoreService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    /**
     * Subscribe for actions from header toolbar
     */
    this.storeService.changes.subscribe(data => {
      if(this.checked && data && data.pageName === 'Locations'){
        if(data.type === Action.EDIT){
          this.storeService.update(null);
          this.editMode = true;
          console.log("Edit Location", this.location.name);

        }else if(data.type === Action.REMOVE){
          this.storeService.update(null);
          console.log("Remove Location", this.location.name);
          this.pendingDelete = true;
          //this.dataService.removeLocation(this.location);

          const am:ActionModel = Object.assign({}, data, {type:Action.CHANGE})
          this.storeService.update(am);

        }else if(data.type === Action.NEW){
          this.storeService.update(null);

        }else if(data.type === Action.COMPLETE && data.data.locationName && data.data.locationName === this.location.name){
          this.editMode = false;
        }else if(data.type === Action.APPROVE_DELETE && this.pendingDelete 
          && Array.isArray(data.data) && data.data.indexOf(this.location.name) >= 0){
          console.log(this.location.name + " Approved for deletion");
          this.dataService.removeLocation(this.location);
        }
      }
    });
  }

  changed(e){
    this.checked = e.target.checked;
    this.selectionChanged.emit({name:this.location.name, checked:this.checked});
  }

}

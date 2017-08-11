import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from './../../../shared/services/store.service';
import { Action } from './../../../constants/enums';
import { LocationModel, ActionModel } from "app/models/interfaces";
import { DataService } from './../../../shared/services/data.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

  @Input() location:LocationModel;
  @Input() checked = false;

  private vibrationEnabled = false;

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
          console.log("Edit Location", this.location.name);
        }else if(data.type === Action.REMOVE){
          this.storeService.update(null);
          console.log("Remove Location", this.location.name);
          this.dataService.removeLocation(this.location);

          const am:ActionModel = Object.assign({}, data, {type:Action.CHANGE})
          this.storeService.update(am);
        }else if(data.type === Action.NEW){
          this.storeService.update(null);
        }
      }
    });
  }

  changed(e){
    this.checked = e.target.checked;
  }
}

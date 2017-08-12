import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { DataService } from './../../shared/services/data.service';
import { LocationModel } from './../../models/interfaces';
import { StoreService } from './../../shared/services/store.service';
import { Action } from './../../constants/enums';

@Component({
  selector: 'app-single-location',
  templateUrl: './single-location.component.html',
  styleUrls: ['./single-location.component.css']
})
export class SingleLocationComponent implements OnInit, OnDestroy {

  location:LocationModel;
  private storeSubscription;

  constructor(
    private dataService:DataService, 
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService
  ) { }

  ngOnInit() {

    /**
     * Check if location was passed for editing in URL
     */
    this.route.paramMap.subscribe(paramMap => {
      this.location = this.dataService.getLocation(paramMap.get('location'));
    });

    /**
     * Subscribe for actions from header toolbar
     */
    this.storeSubscription = this.storeService.changes.subscribe(data => {
      if(data && data.pageName === 'Location'){
        if(data.type === Action.EDIT){
          if(this.location){
            this.storeService.update(null);
            console.log("Single locatin edit")
            this.router.navigate(['/single-location-edit/' + this.location.name]);
          }
        }else if(data.type === Action.REMOVE){
          this.storeService.update(null);
          confirm("Are you sure you want to delete this location?");
        }else if(data.type === Action.NEW){
          this.storeService.update(null);
          this.router.navigate(['/single-location-edit']);
        }
      }
      
    });
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }

}

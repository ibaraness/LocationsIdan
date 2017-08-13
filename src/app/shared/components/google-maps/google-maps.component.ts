import { Component, OnInit, ElementRef, OnDestroy, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { DynamicScriptLoaderService } from "app/shared/services/dynamic-script-loader.service";
import { StoreService } from "app/shared/services/store.service";
import { ActionModel, LocationModel } from "app/models/interfaces";
import { Action } from 'app/constants/enums';
import { ActivatedRoute, Router } from "@angular/router";
import { DataService } from "app/shared/services/data.service";
import { GoogleMapsService } from "app/shared/services/google-maps.service";

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.css']
})
export class GoogleMapsComponent implements OnInit, OnDestroy {

  private map;
  public coordinates:string;
  public location:LocationModel;
  private editMode = false;
  private storeSubscription;
  @Input() fromModal = false;
  @Input() initialCoordinates:object;
  @Output() onClick = new EventEmitter;

  constructor(
    private scriptLoader:DynamicScriptLoaderService,
    private storeService: StoreService,
    private ngZone: NgZone,
    private dataService:DataService, 
    private route: ActivatedRoute,
    private router: Router,
    private gmServices: GoogleMapsService
  ) { }

  ngOnInit() {

    /**
     * Check if location was passed for editing in URL
     */
    this.route.paramMap.subscribe(paramMap => {
      this.location = this.dataService.getLocation(paramMap.get('location'));
      this.editMode = !!paramMap.get('edit');
    });

    let position = null;
    if(this.location){
      const pos = this.location.coordinates.split(",");
      if(pos.length === 2 && isNaN(+pos[0]) && isNaN(+pos[1])){
        this.initialCoordinates = {
          lat:+pos[0],
          lng:+pos[1]
        }
      }
      
    }

    this.storeSubscription = this.storeService.changes.subscribe(action => {
      if(action && action.type === Action.SET_COORDINATES && action.data.location){
        console.log("asdasd,hjkhj")
        this.location = action.data.location;
        this.editMode = true;
      }else if(action && action.type === Action.SHOW_ON_MAP && action.pageName === 'Map'){
        this.location = action.data.location;
      }
    })

    /**
     * Get Map instance
     */
    this.gmServices.getMap(document.getElementById('google_maps_contnet')​, this.initialCoordinates).subscribe(map => {
      /**
       * Create marker
       */
      const marker = this.gmServices.addMarker(position || {lat: -34.397, lng: 150.644});
      //map.setZoom(18)
      if(this.initialCoordinates){
        map.setZoom(18);
      }

      /**
       * Reposition marker on each click
       */
      this.gmServices.clickListener.subscribe(e=>{
        if(e){
          marker.setPosition(e.latLng);
          this.coordinates = "" + e.latLng.lat() + "," +  e.latLng.lng();
          this.onClick.emit(this.coordinates);
        }
      });

      /**
       * Setting autocomplete box
       */
      var input = document.getElementById('pac-input');
      this.gmServices.addSearchBox(input);

    });
  }

  setNewCoordinates(){
    // if(this.location && this.coordinates){
    //   this.location.coordinates = this.coordinates;
    //   this.dataService.setLocation(this.location);
    // }
    //single-location-edit
    const am:ActionModel = {
      type: Action.COORDINATES_DONE ,
      pageName:'Location', 
      data:{
        location:Object.assign(this.location, {coordinates:this.coordinates || ""})
      }
    }
    this.router.navigate(['/single-location-edit']).then(()=>{
      this.storeService.update(am);
    })
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }
}

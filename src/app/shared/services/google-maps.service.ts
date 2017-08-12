import { Injectable, NgZone } from '@angular/core';
import { DynamicScriptLoaderService } from "app/shared/services/dynamic-script-loader.service";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class GoogleMapsService {

  private map;
  public clickListener = new BehaviorSubject<any>(null);

  constructor(
    private scriptLoader:DynamicScriptLoaderService,
    private ngZone: NgZone,
  ) { 
  }
  
  getMap(element:HTMLElement, position = null):Observable<any>{
    return Observable.create(observer => {
      this.scriptLoader.loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyA34ttaUhAwCf5O-7j-5U71sZFi3RHjnYY&libraries=places').then(data => {
        this.ngZone.runOutsideAngular(()=>{
          const google = window['google'];
          if(google){
            /**
             * Create the main Map instance
             */
            this.map = new google.maps.Map(element, {
              center: position || {lat: -34.397, lng: 150.644},
              zoom: 8,
              mapTypeControl:false,
              streetViewControl:false,
              mapTypeId: 'roadmap'
            });
            if(this.map){
              const callback = function(e){
                this.ngZone.run(()=>{
                  this.clickListener.next(e);
                  //this.onMarkerChange("" + e.latLng.lat() + ", " + e.latLng.lng())
                });
              }.bind(this);
                this.map.addListener('click', callback);
              }
            
            observer.next(this.map);
          }else {
            observer.error(new Error("error message"));
          }
          observer.complete;
        });
      });
    });
  }

  addMarker(position:object, title:string = null):any{
    if(this.map && window['google']){
      return new window['google'].maps.Marker({
            position,
            map: this.map,
            title
      });
    }
    return null;
  }

  addSearchBox(element:HTMLElement){

    const googlePlaces = window['google'] && window['google'].maps && window['google'].maps.places;
    if(this.map && googlePlaces){
      const searchBox = new googlePlaces.SearchBox(element);
      this.map.controls[window['google'].maps.ControlPosition.TOP_LEFT].push(element);

      // Bias the SearchBox results towards current map's viewport.
      this.map.addListener('bounds_changed', function() {
        searchBox.setBounds(this.map.getBounds());
      }.bind(this));

      let markers = [];

      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener('places_changed', () => {
        let places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }

        // Clear out the old markers.
        markers.forEach((marker) => {
          marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new window['google'].maps.LatLngBounds();
        places.forEach((place) => {
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }
          const icon = {
            url: place.icon,
            size: new window['google'].maps.Size(71, 71),
            origin: new window['google'].maps.Point(0, 0),
            anchor: new window['google'].maps.Point(17, 34),
            scaledSize: new window['google'].maps.Size(25, 25)
          };

          // Create a marker for each place.
          markers.push(new window['google'].maps.Marker({
            map: this.map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          }));

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        this.map.fitBounds(bounds);
      })

    }
  }

  // onMapClick():Observable<any>{
    
  // }

}

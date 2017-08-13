import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DataService } from './../../shared/services/data.service';
import { LocationModel, ActionModel } from './../../models/interfaces';
import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import 'rxjs/add/operator/switchMap';
import { StoreService } from "app/shared/services/store.service";
import { Action } from "./../../constants/enums";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";

@Component({
  selector: 'app-single-location-edit',
  templateUrl: './single-location-edit.component.html',
  styleUrls: ['./single-location-edit.component.css']
})
export class SingleLocationEditComponent implements OnInit, OnDestroy {

  private storeSubscription;

  @Input() activeLocation:LocationModel;
  @Input() refererPage;

  bsModalRef: BsModalRef;

  categories:any = [];

  /**
   * Reactive form settings
   */
  form: FormGroup;

  /**
   * Set the form control to all the text inputs
   */
  name:FormControl = new FormControl("", Validators.required);
  address:FormControl = new FormControl("", Validators.required);
  coordinates:FormControl = new FormControl("", Validators.required);
  category:FormControl = new FormControl("default", [Validators.required, Validators.pattern(/^(?!default)/g)]);

  dirtyProgramatically = false;

  constructor(
    formBuilder:FormBuilder, 
    private dataService:DataService, 
    private route: ActivatedRoute,
    private router: Router,
    private locationService:Location,
    private storeService: StoreService,
    private modalService: BsModalService
  ) { 
    this.form = formBuilder.group({
      "name": this.name,
      "address":this.address,
      "coordinates": this.coordinates,
      "category":this.category
    });
  }

  public openModal(title:string, content:string, action:ActionModel) {
    this.bsModalRef = this.modalService.show(ConfirmModalComponent);
    this.bsModalRef.content.title = title;
    this.bsModalRef.content.content = content;
    this.bsModalRef.content.action = action;
  }
  
  /**
   * Fetch values if exist
   */
  ngOnInit() {

    /**
     * Fetch available catagories
     */
    this.categories = this.dataService.getCategories();


    /**
     * Check if location was passed for editing in URL or by Input
     */
    if(this.activeLocation){
      this.fillFormFields();
    }else {
      this.route.paramMap.subscribe(paramMap => {
        this.activeLocation = this.dataService.getLocation(paramMap.get('location'));
        if(this.activeLocation){
          this.fillFormFields();
        }
      });
    }
    
    /**
     * Listen for store events
     */
    this.storeSubscription = this.storeService.store.subscribe(data => {
      if(data && data.pageName === 'Location'){
        /**
         * If an action was completed, go back to previous page
         */
        if(data.type === Action.COMPLETE){
          this.storeService.update(null);
          this.locationService.back();
        }else if(data.type === Action.CONFIRM_OVERWRITE && data.data.location){
          this.dataService.setLocation(data.data.location);
          this.complete();
        }else if(data.type === Action.COORDINATES_DONE){
          const location = data.data.location;
          if(location){
            this.name.setValue(location.name || "");
            this.address.setValue(location.address || "");
            this.coordinates.setValue(location.coordinates || "");
            this.category.setValue(location.category.length && location.category[0] || "");
            this.dirtyProgramatically = true;
          }
        }
      }
    });
  }

  private fillFormFields(){
    if(this.activeLocation){
      this.name.setValue(this.activeLocation.name);
      this.address.setValue(this.activeLocation.address);
      this.coordinates.setValue(this.activeLocation.coordinates);
      this.category.setValue(this.activeLocation.category[0]);
    }
  }

  onSubmit(){
    //console.log("Submited!", this.form.valid);

    /**
     * Create a new location for saving in database
     */
    const location:LocationModel = {
      "name":this.name.value,
      "address":this.address.value,
      "coordinates":this.coordinates.value,
      "category":[this.category.value]
    };

    /**
     * If we choose a new location with the same name of other location that already exist,
     * Ask the user if he wants to overwrite it
     */
    if(!this.activeLocation && this.dataService.locationExist(location.name) >= 0){
      // let overwrite = confirm("A location with that Name already exist! \n Do you want to ovewrite it?");
      // if(overwrite){
      //   this.dataService.setLocation(location);
      //   this.complete();
      // }
      const am:ActionModel = {
        type: Action.CONFIRM_OVERWRITE ,
        pageName:this.refererPage || 'Location', 
        data:{
          location
        }
      }
      this.openModal("Location exist", "A location with that Name already exist! \n Do you want to ovewrite it?", am);
    }
    /**
     * If we are editing existing location from the start
     */
    else if(this.activeLocation){
      this.dataService.setLocation(location, this.activeLocation.name);
      this.complete(location.name);
    }
    /**
     * If we are saving a new unique location
     */
    else {
      this.dataService.setLocation(location);
      this.complete(location.name);
      //alert("Location Was saved")
    }
  }

  getCoordinatesFromMap(){
    const location:LocationModel = {
      "name":this.name.value,
      "address":this.address.value,
      "coordinates":this.coordinates.value,
      "category":[this.category.value]
    };
    const am:ActionModel = {
      type: Action.SET_COORDINATES ,
      pageName:this.refererPage || 'Location', 
      data:{location}
    }
    this.router.navigate(['/map']).then(()=>{
      this.storeService.update(am);
    });
  }

  complete(newLocationName:string = null){
    const am:ActionModel = {
      type: Action.COMPLETE ,
      pageName:this.refererPage || 'Location', 
      data:{
        locationName:this.activeLocation && this.activeLocation.name || '',
        newLocationName
      }
    }
    this.storeService.update(am);
  }

  cancelEdit(){
    const am:ActionModel = {
      type: Action.CANCEL_EDIT ,
      pageName:this.refererPage || 'Location', 
      data:{
        locationName:this.activeLocation && this.activeLocation.name || ''
      }
    }
    this.storeService.update(am);
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }

}

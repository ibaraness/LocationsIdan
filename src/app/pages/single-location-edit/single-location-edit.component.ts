import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DataService } from './../../shared/services/data.service';
import { LocationModel } from './../../models/interfaces';
import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap } from "@angular/router";
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-single-location-edit',
  templateUrl: './single-location-edit.component.html',
  styleUrls: ['./single-location-edit.component.css']
})
export class SingleLocationEditComponent implements OnInit {

  private activeLocation:LocationModel;

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

  constructor(
    formBuilder:FormBuilder, 
    private dataService:DataService, 
    private route: ActivatedRoute,
    private locationService:Location
  ) { 
    this.form = formBuilder.group({
      "name": this.name,
      "address":this.address,
      "coordinates": this.coordinates,
      "category":this.category
    });
  }
  
  /**
   * Fetch values if exist
   */
  ngOnInit() {

    // const ltest:Location = {name:'asd',address:'s',coordinates:'s',category:['d']};

    // console.log("Exist", this.dataService.locationExist(ltest));

    /**
     * Fetch available catagories
     */
    this.categories = this.dataService.getCategories();

    /**
     * Check if location was passed for editing in URL
     */
    this.route.paramMap.subscribe(paramMap => {
      this.activeLocation = this.dataService.getLocation(paramMap.get('location'));
      if(this.activeLocation){
        this.name.setValue(this.activeLocation.name);
        this.address.setValue(this.activeLocation.address);
        this.coordinates.setValue(this.activeLocation.coordinates);
        this.category.setValue(this.activeLocation.category[0]);
      }
    });

    //Test - get location from database
    //console.log("dsf", this.dataService.getLocation('Home'));
  }
  onSubmit(){
    console.log("Submited!", this.form.valid);

    const location:LocationModel = {
      "name":this.name.value,
      "address":this.address.value,
      "coordinates":this.coordinates.value,
      "category":[this.category.value]
    };

    if(!this.activeLocation && this.dataService.locationExist(location.name) >= 0){
      let overwrite = confirm("A location with that Name already exist! \n Do you want to ovewrite it?");
      if(overwrite){
        this.dataService.setLocation(location);
        this.locationService.back();
      }
    }else if(this.activeLocation){
      console.log("Location changes Was saved, going back", this.dataService.locationExist(this.activeLocation.name));
      this.dataService.setLocation(location, this.activeLocation.name);
      this.locationService.back();
    }else {
      this.dataService.setLocation(location);
      console.log("Save", this.dataService.locationExist(location.name));
      this.locationService.back();
      alert("Location Was saved")
    }
  }

  cancel(){
    this.locationService.back();
  }

}

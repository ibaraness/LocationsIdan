import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { DataService } from "app/shared/services/data.service";
import { ActivatedRoute, Router } from "@angular/router";
import { StoreService } from "app/shared/services/store.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { CategoryModel, ActionModel } from "app/models/interfaces";
import { Action } from "./../../constants/enums";
import { Location } from '@angular/common';
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";

@Component({
  selector: 'app-single-category-edit',
  templateUrl: './single-category-edit.component.html',
  styleUrls: ['./single-category-edit.component.css']
})
export class SingleCategoryEditComponent implements OnInit {

  private storeSubscription;

  bsModalRef: BsModalRef;

  /**
   * Reactive form settings
   */
  form: FormGroup;

  /**
   * Set the form control to all the text inputs
   */
  name:FormControl = new FormControl("", Validators.required);
  // color:FormControl = new FormControl("#ffffff", Validators.required);

  @Input() activeCategory:CategoryModel;
  @Input() refererPage;

  constructor(
    private formBuilder:FormBuilder, 
    private dataService:DataService, 
    private route: ActivatedRoute,
    private router: Router,
    private locationService:Location,
    private storeService: StoreService,
    private modalService: BsModalService,
  ) {
    
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      "name": this.name,
    });

    if(this.activeCategory){
      this.fillFormFields();
    }else {
      this.route.paramMap.subscribe(paramMap => {
        this.activeCategory = this.dataService.getLocation(paramMap.get('category'));
        if(this.activeCategory){
          this.fillFormFields();
        }
      });
    }

    this.storeSubscription = this.storeService.store.subscribe(data => {
      if(data && data.pageName === 'Category'){
        if(data.type === Action.COMPLETE){
          this.storeService.update(null);
          this.locationService.back();
        }
        else if(data.type === Action.CONFIRM_OVERWRITE && data.data.category){
          this.dataService.setCategory(data.data.category);
          this.complete();
        }
      }
    });
  }

  private fillFormFields(){
    if(this.activeCategory){
      this.name.setValue(this.activeCategory.name);
    }
  }

  onSubmit(){
    console.log("Submited!", this.form.valid);

    const category:CategoryModel = {
      name: this.name.value,
    }

    /**
     * If we choose a new category with the same name of other category already exist
     */
    if(!this.activeCategory && this.dataService.categoryExist(category.name) >= 0){
      const am:ActionModel = {
        type: Action.CONFIRM_OVERWRITE ,
        pageName:this.refererPage || 'Category', 
        data:{
          category
        }
      }
      this.openModal("Category exist", "A category with that Name already exist! \n Do you want to ovewrite it?", am);
    }
    /**
     * If we are editing existing category from the start
     */
    else if(this.activeCategory){
      this.dataService.setCategory(category, this.activeCategory.name);
      this.complete();
    }else {
      this.dataService.setCategory(category);
      this.complete();
      //alert("Location Was saved")
    }
  }

  public openModal(title:string, content:string, action:ActionModel) {
    this.bsModalRef = this.modalService.show(ConfirmModalComponent);
    this.bsModalRef.content.title = title;
    this.bsModalRef.content.content = content;
    this.bsModalRef.content.action = action;
  }

  complete(){
    const am:ActionModel = {
      type: Action.COMPLETE ,
      pageName:this.refererPage || 'Category', 
      data:{categoryName:this.activeCategory && this.activeCategory.name || ''}
    }
    this.storeService.update(am);
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CategoryModel, ActionModel } from "app/models/interfaces";
import { Action } from "app/constants/enums";
import { DataService } from "app/shared/services/data.service";
import { StoreService } from "app/shared/services/store.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  @Input() category: CategoryModel;
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
      if(this.checked && data && data.pageName === 'Categories'){
        /**
         * Edit location
         */
        if(data.type === Action.EDIT){
          this.storeService.update(null);
          this.editMode = true;
        }
        /**
         * Remove location
         */
        // else if(data.type === Action.REMOVE){
        //   this.storeService.update(null);
        //   console.log("Remove Location", this.category.name);
        //   this.pendingDelete = true;
        //   //this.dataService.removeLocation(this.location);

        //   const am:ActionModel = Object.assign({}, data, {type:Action.CHANGE})
        //   this.storeService.update(am);
        // }
        else if(data.type === Action.COMPLETE && data.data.categoryName && data.data.categoryName === this.category.name){
          this.editMode = false;
        }
        else if(data.type === Action.APPROVE_DELETE && Array.isArray(data.data) && data.data.indexOf(this.category.name) >= 0){
          console.log(this.category.name + " Approved for deletion");
          this.dataService.removeCategoty(this.category);
          const am:ActionModel = Object.assign({}, data, {type:Action.CHANGE})
          this.storeService.update(am);
          //this.router.navigate(['/locations']);
        }
      }
    });
  }

  changed(e){
    this.checked = e.target.checked;
    this.selectionChanged.emit({name:this.category.name, checked:this.checked});
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }

}

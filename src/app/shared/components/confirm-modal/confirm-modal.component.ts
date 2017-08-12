import { Component, OnInit } from '@angular/core';
import { BsModalRef } from "ngx-bootstrap";
import { ActionModel } from "app/models/interfaces";
import { StoreService } from "app/shared/services/store.service";

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent {

  public title: string;
  public content: string;
  public action: ActionModel;
  constructor(
    public bsModalRef: BsModalRef,
    private storeService: StoreService
  ) { }

  public approvedAction(){
    console.log("Approved action!");
    this.bsModalRef.hide();
    if(this.action){
      this.storeService.update(this.action);
    }
  }

  public disapprove(){
    this.bsModalRef.hide();
    this.storeService.update(null);
  }
}

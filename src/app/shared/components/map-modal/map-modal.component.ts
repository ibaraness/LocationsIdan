import { Component, OnInit } from '@angular/core';
import { BsModalRef } from "ngx-bootstrap";
import { ActionModel } from "app/models/interfaces";
import { StoreService } from "app/shared/services/store.service";

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.css']
})
export class MapModalComponent implements OnInit {

  public action:ActionModel;
  public hara;
  public initialCoordinates:string;
  public coordinates:string;

  constructor(
    public bsModalRef: BsModalRef,
    private storeService: StoreService
  ) { }

  ngOnInit() {
  }

  setCoordinates(e){
    this.coordinates = e;
  }

  save(){
    if(this.action){
      this.action.data['coordinates'] = this.coordinates;
      this.storeService.update(this.action);
    }
    this.bsModalRef.hide();
  }

}

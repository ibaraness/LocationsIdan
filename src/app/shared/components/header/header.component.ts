import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET } from "@angular/router";
import { StoreService } from './../../services/store.service';
import { Action } from './../../../constants/enums';
import "rxjs/add/operator/filter";
import R from 'ramda';
import { ActionModel } from "app/models/interfaces";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";

const pageParams = {
  "Locations":"category",
  "Location":"location"
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  bsModalRef: BsModalRef;

  pageName:string;
  pageParam:string;
  private storeSubscription;
  private modalIsActive = false;

  count = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    console.log("ngOnInit ngOnInit asdasdsdasdasad")
     //subscribe to the NavigationEnd event
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
      
      
      this.pageName = R.path(['root','firstChild','snapshot','data','pageName'], this.route);
      
      if(this.pageName && pageParams[this.pageName]){
        this.pageParam = R.path(['root','firstChild','snapshot','params',pageParams[this.pageName]], this.route);
        console.log("pageName", this.pageName, pageParams[this.pageName]);
        console.log("sdaa", this.pageParam)
      }

      this.storeSubscription = this.storeService.store.subscribe(data => {
        /**
         * Show confirmation modal
         */
        if(data && data.type === Action.SHOW_CONFIRM_MODAL && !this.modalIsActive){
          console.log("SHOW_CONFIRM_MODAL", ++this.count)
          this.modalIsActive = true;
          setTimeout(()=>{
              this.storeService.update({
                type:Action.NULL,
                pageName:'',
                data
              });
          },100)
          
          this.openModal(data.data.title,data.data.content, data.data.action, data.data.extraContent, data.data.cancelAction);
        }

        /**
         * Release confirmation modal
         */
        if(data && data.type === Action.NULL){
          console.log("Release_CONFIRM_MODAL", ++this.count)
          this.modalIsActive = false;
        }
        /**
         * Show location on map
         */
        else if(data && data.type === Action.SHOW_ON_MAP && data.pageName === 'Locations'){
          this.router.navigate(['/map/' + data.data.location.name]).then(()=>{
            this.storeService.update(null);
          });
        }
      })
    });
  }

  public openModal(title:string, content:string, action:ActionModel, extraContent:string = null, cancelAction:ActionModel = null) {
    console.log("openModal", action)
    this.bsModalRef = this.modalService.show(ConfirmModalComponent);
    this.bsModalRef.content.title = title;
    this.bsModalRef.content.content = content;
    this.bsModalRef.content.extraContent = extraContent;
    this.bsModalRef.content.action = action;
    this.bsModalRef.content.cancelAction = cancelAction;
  }

  edit(){
    const am:ActionModel = {
      type:Action.EDIT,
      pageName:this.pageName,
      data:this.pageParam
    }
    this.storeService.update(am);
  }
  remove(){
    const am:ActionModel = {
      type:Action.REMOVE,
      pageName:this.pageName,
      data:this.pageParam
    }
    this.storeService.update(am);
  }
  addNew(){
    const am:ActionModel = {
      type:Action.NEW,
      pageName:this.pageName,
      data:this.pageParam
    }
    this.storeService.update(am);
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }
}

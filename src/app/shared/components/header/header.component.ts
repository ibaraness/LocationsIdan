import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET } from "@angular/router";
import { StoreService } from './../../services/store.service';
import { Action } from './../../../constants/enums';
import "rxjs/add/operator/filter";
import R from 'ramda';
import { ActionModel } from "app/models/interfaces";

const pageParams = {
  "Locations":"category",
  "Location":"location"
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  pageName:string;
  pageParam:string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService
  ) { }

  ngOnInit() {
     //subscribe to the NavigationEnd event
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
      
      
      this.pageName = R.path(['root','firstChild','snapshot','data','pageName'], this.route);
      
      if(this.pageName && pageParams[this.pageName]){
        this.pageParam = R.path(['root','firstChild','snapshot','params',pageParams[this.pageName]], this.route);
        console.log("pageName", this.pageName, pageParams[this.pageName]);
        console.log("sdaa", this.pageParam)
      }
    });
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
}

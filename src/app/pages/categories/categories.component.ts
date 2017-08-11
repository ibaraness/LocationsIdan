import { Component, OnInit } from '@angular/core';
import { DataService } from './../../shared/services/data.service';
import { StoreService } from './../../shared/services/store.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categories:any = [];

  constructor(
    private dataService:DataService,
    private storeService: StoreService
  ) { }

  ngOnInit() {
    this.categories = this.dataService.getCategories();
    this.storeService.changes.subscribe(data => {
      console.log("storeService", data);
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { DataService } from './shared/services/data.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';
  count = [1,2,3,4,5];
  constructor(private dataService:DataService){

  }
  ngOnInit(){
    console.log(this.dataService.getCategories());
  }
}

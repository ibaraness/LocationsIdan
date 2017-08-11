import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  showMenu = false;

  constructor() { }

  ngOnInit() {
  }

  hideMenu(){
    this.showMenu = false;
  }

  toggleMenu(){
    this.showMenu = !this.showMenu;
  }

}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { LocationsComponent } from './pages/locations/locations.component';
import { LocationComponent } from './shared/components/location/location.component';
import { DataService } from './shared/services/data.service';
import { LocalStorageService } from './shared/services/local-storage.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { SingleLocationComponent } from './pages/single-location/single-location.component';
import { SingleLocationEditComponent } from './pages/single-location-edit/single-location-edit.component';
import { StoreService } from './shared/services/store.service';
import { ModalComponent } from './shared/components/modal/modal.component';

@NgModule({
  declarations: [
    ModalComponent,
    AppComponent,
    CategoriesComponent,
    LocationsComponent,
    LocationComponent,
    HeaderComponent,
    FooterComponent,
    SingleLocationComponent,
    SingleLocationEditComponent,
  ],
  entryComponents:[ModalComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    RouterModule.forRoot([
      { path:'', redirectTo: '/categories', pathMatch: 'full'},
      {
        path:'locations',
        component:LocationsComponent,
        data:{
          pageName:'Locations'
        }
      },
      {
        path:'locations/:category',
        component:LocationsComponent,
        data:{
          pageName:'Locations'
        }
      },
      {
        path:'categories',
        component: CategoriesComponent,
        data:{
          pageName:'Categories'
        }
      },
      {
        path:'single-location',
        component:SingleLocationComponent,
        data:{
          pageName:'Location'
        }
        
      },
      {
        path:'single-location/:location',
        component:SingleLocationComponent,
        data:{
          pageName:'Location'
        }
      },
      {
        path:'single-location-edit',
        component:SingleLocationEditComponent,
        data:{
          pageName:'Location'
        }
      },
      {
        path:'single-location-edit/:location',
        component:SingleLocationEditComponent,
        data:{
          pageName:'Location'
        }
      }
    ])
  ],
  providers: [LocalStorageService, DataService, StoreService, BsModalRef],
  bootstrap: [AppComponent]
})
export class AppModule { }

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
import { ConfirmModalComponent } from './shared/components/confirm-modal/confirm-modal.component';
import { GoogleMapsComponent } from './shared/components/google-maps/google-maps.component';
import { RoutingModule } from "app/shared/routing/routing/routing.module";
import { DynamicScriptLoaderService } from "app/shared/services/dynamic-script-loader.service";
import { GoogleMapsService } from "app/shared/services/google-maps.service";
import { SingleCategoryEditComponent } from './pages/single-category-edit/single-category-edit.component';
import { CategoryComponent } from './shared/components/category/category.component';


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
    ConfirmModalComponent,
    GoogleMapsComponent,
    SingleCategoryEditComponent,
    CategoryComponent,
  ],
  entryComponents:[ModalComponent, ConfirmModalComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    RoutingModule,
  ],
  providers: [
    LocalStorageService, 
    DataService, 
    StoreService, 
    BsModalRef, 
    DynamicScriptLoaderService,
    GoogleMapsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

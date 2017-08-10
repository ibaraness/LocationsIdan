import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { LocationsComponent } from './pages/locations/locations.component';
import { LocationComponent } from './shared/components/location/location.component';
import { DataService } from './shared/services/data.service';
import { LocalStorageService } from './shared/services/local-storage.service';

@NgModule({
  declarations: [
    AppComponent,
    CategoriesComponent,
    LocationsComponent,
    LocationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [LocalStorageService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }

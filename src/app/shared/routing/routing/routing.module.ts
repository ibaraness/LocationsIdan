import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from "@angular/router";
import { LocationsComponent } from "app/pages/locations/locations.component";
import { CategoriesComponent } from "app/pages/categories/categories.component";
import { SingleLocationComponent } from "app/pages/single-location/single-location.component";
import { SingleLocationEditComponent } from "app/pages/single-location-edit/single-location-edit.component";
import { GoogleMapsComponent } from "app/shared/components/google-maps/google-maps.component";
import { SingleCategoryEditComponent } from "app/pages/single-category-edit/single-category-edit.component";

const appRoutes: Routes = [
  { 
    path:'', 
    redirectTo: '/categories', 
    pathMatch: 'full'
  },
  {
    path:'map',
    component:GoogleMapsComponent,
    data:{
      pageName:'Map'
    }
  },
  {
    path:'map/:location',
    component:GoogleMapsComponent,
    data:{
      pageName:'Map'
    }
  },
  {
    path:'map/:location/:edit',
    component:GoogleMapsComponent,
    data:{
      pageName:'Map'
    }
  },
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
  },
  {
    path:'single-category-edit',
    component:SingleCategoryEditComponent,
    data:{
      pageName:'Category'
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class RoutingModule { }

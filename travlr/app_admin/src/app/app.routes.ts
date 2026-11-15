
import { Routes } from '@angular/router';

import { TripListingComponent } from './trip-listing/trip-listing.component';
import { AddTripComponent } from './add-trip/add-trip.component';

export const routes: Routes = [
  {
    path: '',
    component: TripListingComponent,
    pathMatch: 'full'
  },
  {
    path: 'add-trip',
    component: AddTripComponent
  }
];


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data.service';
import { TripCardComponent } from '../trip-card/trip-card.component';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, TripCardComponent],
  templateUrl: './trip-listing.component.html',
  styleUrl: './trip-listing.component.css'
})
export class TripListingComponent implements OnInit {

  trips: Trip[] = [];
  message = '';

  constructor(
    private tripDataService: TripDataService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public addTrip(): void {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/add-trip']);
  }

  private getStuff(): void {
    this.tripDataService.getTrips().subscribe({
      next: (value: Trip[]) => {
        this.trips = value;

        this.message = value.length > 0
          ? 'There are ' + value.length + ' trips available.'
          : 'There were no trips retrieved from the database.';

        console.log(this.message);
      },
      error: (error: any) => {
        this.message = 'Error retrieving trips from the database.';
        console.error('Error:', error);
      }
    });
  }

  ngOnInit(): void {
    this.getStuff();
  }
}

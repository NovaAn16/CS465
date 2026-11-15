
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Trip } from '../models/trip';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.css'
})
export class TripCardComponent implements OnInit {

  @Input('trip') trip!: Trip;

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  public editTrip(trip: Trip): void {
    // Save the selected trip code for the Edit Trip page
    localStorage.setItem('tripCode', trip.code);

    // Open the Edit Trip component
    this.router.navigate(['edit-trip']);
  }
}

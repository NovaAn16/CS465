
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-trip.component.html',
  styleUrl: './add-trip.component.css'
})
export class AddTripComponent implements OnInit {

  public addForm!: FormGroup;
  public submitted = false;
  public saving = false;
  public errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripService: TripDataService
  ) {}

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  public onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.addForm.invalid || this.saving) {
      return;
    }

    this.saving = true;

    const newTrip: Trip = this.addForm.value;

    this.tripService.addTrip(newTrip).subscribe({
      next: (data: Trip) => {
        console.log('Trip saved successfully:', data);
        this.saving = false;

        // Return to the list of trips
        this.router.navigate(['/']);
      },
      error: (error: any) => {
        console.error('Error saving trip:', error);
        this.errorMessage =
          error.error?.message ||
          'Unable to save the trip. Please try again.';

        this.saving = false;
      }
    });
  }

  get f() {
    return this.addForm.controls;
  }
}

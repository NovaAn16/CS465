
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { Router } from '@angular/router';

import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.component.html',
  styleUrl: './edit-trip.component.css'
})
export class EditTripComponent implements OnInit {

  public editForm!: FormGroup;
  public trip!: Trip;
  public tripCode: string = '';
  public submitted = false;
  public saving = false;
  public loading = true;
  public errorMessage = '';
  public message = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripDataService
  ) {}

  ngOnInit(): void {

    // Retrieve the trip code selected from the card
    const storedCode = localStorage.getItem('tripCode');

    if (!storedCode) {
      this.router.navigate(['/']);
      return;
    }

    this.tripCode = storedCode;

    // Create the editing form
    this.editForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });

    // Retrieve the existing trip from MongoDB
    this.tripDataService.getTrip(this.tripCode).subscribe({
      next: (value: Trip) => {

        this.trip = value;

        // Convert the MongoDB date to YYYY-MM-DD
        // so it displays in the HTML date input.
        const formattedDate = value.start
          ? String(value.start).substring(0, 10)
          : '';

        // Fill the form with the existing trip data
        this.editForm.patchValue({
          code: value.code,
          name: value.name,
          length: value.length,
          start: formattedDate,
          resort: value.resort,
          perPerson: value.perPerson,
          image: value.image,
          description: value.description
        });

        this.loading = false;
        this.message = 'Trip ' + this.tripCode + ' retrieved.';

        console.log(this.message);
      },
      error: (error: any) => {
        console.error('Error retrieving trip:', error);

        this.errorMessage =
          'Unable to retrieve trip information.';

        this.loading = false;
      }
    });
  }

  public onSubmit(): void {

    this.submitted = true;
    this.errorMessage = '';

    if (this.editForm.invalid || this.saving || this.loading) {
      return;
    }

    this.saving = true;

    const updatedTrip: Trip = this.editForm.value;

    // Save the updated record using the original trip code
    this.tripDataService.updateTrip(
      this.tripCode,
      updatedTrip
    ).subscribe({
      next: (value: Trip) => {

        console.log('Trip updated successfully:', value);

        this.saving = false;

        // Clear the stored selection
        localStorage.removeItem('tripCode');

        // Return to the trip listing
        this.router.navigate(['/']);
      },
      error: (error: any) => {

        console.error('Error updating trip:', error);

        this.errorMessage =
          error.error?.message ||
          'Unable to update the trip. Please try again.';

        this.saving = false;
      }
    });
  }

  public cancel(): void {
    localStorage.removeItem('tripCode');
    this.router.navigate(['/']);
  }

  get f() {
    return this.editForm.controls;
  }
}

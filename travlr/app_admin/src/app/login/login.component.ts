
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { TripDataService } from '../services/trip-data.service';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  public formError = '';
  public submitting = false;

  public credentials = {
    name: '',
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private tripDataService: TripDataService
  ) {}

  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  public onLoginSubmit(): void {
    this.formError = '';

    if (
      !this.credentials.name.trim() ||
      !this.credentials.email.trim() ||
      !this.credentials.password
    ) {
      this.formError = 'All fields are required. Please try again.';
      return;
    }

    if (this.submitting) {
      return;
    }

    this.submitting = true;

    const user = new User();
    user.name = this.credentials.name;
    user.email = this.credentials.email;

    this.tripDataService.login(
      user,
      this.credentials.password
    ).subscribe({
      next: (response: AuthResponse) => {
        this.submitting = false;

        if (!response.token) {
          this.formError = 'No authentication token was returned.';
          return;
        }

        this.authenticationService.saveToken(response.token);

        console.log('Login successful');

        this.router.navigate(['/']);
      },
      error: (error: any) => {
        this.submitting = false;

        if (error.status === 401) {
          this.formError = 'Incorrect email or password.';
        } else {
          this.formError =
            'Unable to log in. Please check the server and try again.';
        }

        console.error('Login failed:', error);
      }
    });
  }
}

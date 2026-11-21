
import { Inject, Injectable } from '@angular/core';

import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripDataService } from './trip-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authResp: AuthResponse = new AuthResponse();

  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripDataService
  ) {}

  // Retrieve the saved authentication token
  public getToken(): string {
    return this.storage.getItem('travlr-token') || '';
  }

  // Save the authentication token
  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  // Log out by clearing the stored token
  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  // Check if the user has a valid, unexpired token
  public isLoggedIn(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(
        atob(token.split('.')[1])
      );

      return payload.exp > Date.now() / 1000;

    } catch (error) {
      return false;
    }
  }

  // Retrieve the currently authenticated user
  public getCurrentUser(): User {
    const user = new User();

    if (!this.isLoggedIn()) {
      return user;
    }

    try {
      const token = this.getToken();

      const payload = JSON.parse(
        atob(token.split('.')[1])
      );

      user.email = payload.email;
      user.name = payload.name;

    } catch (error) {
      console.error('Error reading user information:', error);
    }

    return user;
  }

  // Log in using the Express API
  public login(user: User, password: string): void {
    this.tripDataService.login(user, password).subscribe({
      next: (response: AuthResponse) => {
        this.authResp = response;
        this.saveToken(response.token);
        console.log('Login successful');
      },
      error: (error: any) => {
        console.error('Login failed:', error);
      }
    });
  }

  // Register a new user through the Express API
  public register(user: User, password: string): void {
    this.tripDataService.register(user, password).subscribe({
      next: (response: AuthResponse) => {
        this.authResp = response;
        this.saveToken(response.token);
        console.log('Registration successful');
      },
      error: (error: any) => {
        console.error('Registration failed:', error);
      }
    });
  }
}

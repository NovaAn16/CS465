
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { BROWSER_STORAGE } from '../storage';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {

  private apiBaseUrl = 'http://localhost:3000/api';
  private tripsUrl = `${this.apiBaseUrl}/trips`;

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  // Retrieve all trips (public endpoint)
  public getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.tripsUrl);
  }

  // Retrieve one trip (public endpoint)
  public getTrip(tripCode: string): Observable<Trip> {
    const url = `${this.tripsUrl}/${encodeURIComponent(tripCode)}`;
    return this.http.get<Trip>(url);
  }

  // Create headers containing the JWT
  private getAuthHeaders(): HttpHeaders {
    const token = this.storage.getItem('travlr-token') || '';

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Add a trip (protected endpoint)
  public addTrip(trip: Trip): Observable<Trip> {
    return this.http.post<Trip>(
      this.tripsUrl,
      trip,
      { headers: this.getAuthHeaders() }
    );
  }

  // Update a trip (protected endpoint)
  public updateTrip(
    tripCode: string,
    trip: Trip
  ): Observable<Trip> {
    const url = `${this.tripsUrl}/${encodeURIComponent(tripCode)}`;

    return this.http.put<Trip>(
      url,
      trip,
      { headers: this.getAuthHeaders() }
    );
  }

  // Log in with email and password
  public login(
    user: User,
    password: string
  ): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiBaseUrl}/login`,
      {
        email: user.email,
        password: password
      }
    );
  }

  // Register with name, email, and password
  public register(
    user: User,
    password: string
  ): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiBaseUrl}/register`,
      {
        name: user.name,
        email: user.email,
        password: password
      }
    );
  }
}


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trip } from '../models/trip';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {

  private apiBaseUrl = 'http://localhost:3000/api';
  private tripsUrl = `${this.apiBaseUrl}/trips`;

  constructor(private http: HttpClient) {}

  // Retrieve all trips from MongoDB
  public getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.tripsUrl);
  }

  // Save a new trip in MongoDB
  public addTrip(trip: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.tripsUrl, trip);
  }
}

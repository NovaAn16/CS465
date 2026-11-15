
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

  // GET: Retrieve all trips from MongoDB
  public getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.tripsUrl);
  }

  // GET: Retrieve one trip by its code
  public getTrip(tripCode: string): Observable<Trip> {
    const url = `${this.tripsUrl}/${encodeURIComponent(tripCode)}`;
    return this.http.get<Trip>(url);
  }

  // POST: Add a new trip to MongoDB
  public addTrip(trip: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.tripsUrl, trip);
  }

  // PUT: Update an existing trip in MongoDB
  public updateTrip(
    tripCode: string,
    trip: Trip
  ): Observable<Trip> {
    const url = `${this.tripsUrl}/${encodeURIComponent(tripCode)}`;
    return this.http.put<Trip>(url, trip);
  }
}

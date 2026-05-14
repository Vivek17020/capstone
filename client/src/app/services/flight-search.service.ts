import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Flights } from '../model/flights';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlightSearchService {
   private baseUrl=environment.apiUrl; 

   constructor(private http: HttpClient, private authService: AuthService) {}

   private headers(): HttpHeaders {
     return new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` });
   }

   suggestSource(): Observable<any[]> {
     return this.http.get<any[]>(`${this.baseUrl}/api/flights/source/suggest`, { headers: this.headers() });
   }

   suggestDestination(): Observable<any[]> {
     return this.http.get<any[]>(`${this.baseUrl}/api/flights/destination/suggest`, { headers: this.headers() });
   }

   searchFlights(source: string, destination: string, date: string): Observable<Flights[]> {
     const params = new HttpParams().set('source', source).set('destination', destination).set('date', date);
     return this.http.get<Flights[]>(`${this.baseUrl}/api/flights/search`, { headers: this.headers(), params });
   }

   getSeats(flightId: number): Observable<any[]> {
     return this.http.get<any[]>(`${this.baseUrl}/api/seats/flights/${flightId}/seats`, { headers: this.headers() });
   }

   bookSeats(flightId: number, seatNumbers: string, userId: number): Observable<any> {
     const seatList = seatNumbers ? seatNumbers.split(',') : [];
     return this.http.post(`${this.baseUrl}/api/booking/book-seats`, { flightId, seatNumbers: seatList, userId }, { headers: this.headers() });
   }
}

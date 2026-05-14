import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class HttpService {
  public serverName = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : ''
      })
    };
  }

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.serverName}${path}`, this.getHeaders());
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.serverName}${path}`, body, this.getHeaders());
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.serverName}${path}`, body, this.getHeaders());
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.serverName}${path}`, this.getHeaders());
  }

  getSeats(flightId: number) {
    return this.get<any[]>(`/api/seats/flights/${flightId}/seats`);
  }

  bookSeats(flightId: number, seatNumbers: string[], userId: number) {
    return this.post(`/api/booking/book-seats`, { flightId, seatNumbers, userId });
  }

  getMyBookings() {
    return this.get<any[]>(`/api/booking/bookings`);
  }

  getAllBookings() {
    return this.get<any[]>(`/api/booking/bookingList`);
  }

  updateBookingStatus(id: number, status: string) {
    return this.put(`/api/booking/${id}/status`, { status });
  }

  downloadTicket(id: number) {
    return this.http.get(`${this.serverName}/api/booking/ticket/${id}`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` }),
      responseType: 'blob'
    });
  }

  suggestSource() {
    return this.get<any[]>(`/api/flights/source/suggest`);
  }

  suggestDestination() {
    return this.get<any[]>(`/api/flights/destination/suggest`);
  }

  searchFlights(source: string, destination: string, date: string) {
    return this.http.get<any[]>(`${this.serverName}/api/flights/search`, {
      params: { source, destination, date },
      headers: new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` })
    });
  }

  assignPilot(flightId: number, pilotId: number, scheduledDate: string, assignStatus: string) {
    return this.http.post(`${this.serverName}/api/pilot/schedule/admin/assign-pilot`, null, {
      params: { flightId: flightId.toString(), pilotId: pilotId.toString(), scheduledDate, assignStatus },
      headers: new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` })
    });
  }

  getPilots() {
    return this.get<any[]>(`/api/pilot/schedule/users`);
  }

  getAllSchedules() {
    return this.get<any[]>(`/api/pilot/schedule`);
  }

  getMySchedule() {
    return this.get<any[]>(`/api/pilot/schedule/scheduleUser`);
  }

  updateScheduleStatus(id: number, status: string) {
    return this.put(`/api/pilot/schedule/${id}/status`, { status });
  }

  login(body: any) {
    return this.http.post(`${this.serverName}/api/auth/login`, body);
  }

  register(body: any) {
    return this.http.post(`${this.serverName}/api/auth/register`, body);
  }

  getProfile() {
    return this.get<any>(`/api/auth/user`);
  }
}

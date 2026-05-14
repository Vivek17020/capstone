import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FlightSchedule, ScheduleStatus } from '../model/flight-schedule';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlightScheduleService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` });
  }

  getAllSchedules(): Observable<FlightSchedule[]> {
    return this.http.get<FlightSchedule[]>(`${this.baseUrl}/api/pilot/schedule`, { headers: this.headers() });
  }

  getMySchedule(): Observable<FlightSchedule[]> {
    return this.http.get<FlightSchedule[]>(`${this.baseUrl}/api/pilot/schedule/scheduleUser`, { headers: this.headers() });
  }

  assignPilot(flightId: number, pilotId: number, scheduledDate: string, assignStatus: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/pilot/schedule/admin/assign-pilot`, null, {
      headers: this.headers(),
      params: {
        flightId: flightId.toString(),
        pilotId: pilotId.toString(),
        scheduledDate,
        assignStatus
      }
    });
  }

  updateScheduleStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/pilot/schedule/${id}/status`, { status }, { headers: this.headers() });
  }
}
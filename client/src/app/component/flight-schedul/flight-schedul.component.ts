import { Component, OnInit } from '@angular/core';
import { FlightSchedule, ScheduleStatus } from '../../model/flight-schedule';
import { FlightScheduleService } from '../../services/flight-schedul.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-flight-schedul',
  templateUrl: './flight-schedul.component.html',
  styleUrls: ['./flight-schedul.component.scss']
})
export class FlightSchedulComponent implements OnInit {
  schedules: FlightSchedule[] = [];
  roleName: string | null = null;

  constructor(private scheduleService: FlightScheduleService, private authService: AuthService) {}

  ngOnInit(): void {
    this.roleName = this.authService.getRole();
    this.loadSchedules();
  }

  loadSchedules(): void {
    if (this.roleName === 'ADMIN') {
      this.scheduleService.getAllSchedules().subscribe((data) => this.schedules = data);
    } else {
      this.scheduleService.getMySchedule().subscribe((data) => this.schedules = data);
    }
  }

  updateStatus(id: number, status: string): void {
    this.scheduleService.updateScheduleStatus(id, status).subscribe(() => this.loadSchedules());
  }
}

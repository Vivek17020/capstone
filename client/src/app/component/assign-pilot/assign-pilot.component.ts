import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-assign-pilot',
  templateUrl: './assign-pilot.component.html',
  styleUrls: ['./assign-pilot.component.scss']
})
export class AssignPilotComponent implements OnInit {
  assignForm: FormGroup;
  flights: any[] = [];
  pilots: any[] = [];
  schedules: any[] = [];
  roleName: string | null = null;
  showMessage = false;
  showError = false;
  message = '';

  constructor(private fb: FormBuilder, private httpService: HttpService, private authService: AuthService) {
    this.assignForm = this.fb.group({
      flightId: [null, Validators.required],
      pilotId: [null, Validators.required],
      scheduledDate: ['', Validators.required],
      assignStatus: ['ASSIGNED', Validators.required]
    });
  }

  ngOnInit(): void {
    this.roleName = this.authService.getRole();
    this.httpService.getAllFlights().subscribe((data: any[]) => this.flights = data);
    this.httpService.getPilots().subscribe((data: any[]) => this.pilots = data);
    this.loadSchedules();
  }

  loadSchedules(): void {
    if (this.roleName === 'ADMIN') {
      this.httpService.getAllSchedules().subscribe((data: any[]) => this.schedules = data);
    } else {
      this.httpService.getMySchedule().subscribe((data: any[]) => this.schedules = data);
    }
  }

  onSubmit(): void {
    this.showError = false;
    if (this.assignForm.invalid) {
      this.showError = true;
      this.message = 'Please fill all required fields.';
      return;
    }
    const { flightId, pilotId, scheduledDate, assignStatus } = this.assignForm.value;
    this.httpService.assignPilot(flightId, pilotId, scheduledDate, assignStatus).subscribe({
      next: () => {
        this.showMessage = true;
        this.message = 'Pilot assigned successfully.';
        this.loadSchedules();
      },
      error: (err) => {
        this.showError = true;
        this.message = err?.error?.message || 'Assignment failed.';
      }
    });
  }

  updateStatus(id: number, status: string): void {
    this.httpService.updateScheduleStatus(id, status).subscribe({
      next: () => {
        this.showMessage = true;
        this.message = 'Schedule status updated.';
        this.loadSchedules();
      },
      error: (err) => {
        this.showError = true;
        this.message = err?.error?.message || 'Update failed.';
      }
    });
  }
}

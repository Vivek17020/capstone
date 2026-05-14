import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';

@Component({
  selector: 'app-viewuser',
  templateUrl: './viewuser.component.html',
  styleUrls: ['./viewuser.component.scss']
})
export class ViewuserComponent implements OnInit {
  bookingsListUser: any[] = [];
  showError = false;
  errorMessage = '';

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.httpService.getAllBookings().subscribe({
      next: (data: any[]) => {
        this.bookingsListUser = data;
      },
      error: () => {
        this.showError = true;
        this.errorMessage = 'Failed to load bookings.';
      }
    });
  }
}

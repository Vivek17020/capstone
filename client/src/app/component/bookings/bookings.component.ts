import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {
  bookings: any[] = [];
  showError = false;
  showMessage = false;
  errorMessage = '';
  responseMessage = '';

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.httpService.getMyBookings().subscribe({
      next: (data: any[]) => {
        this.bookings = data;
      },
      error: () => {
        this.showError = true;
        this.errorMessage = 'Failed to load bookings.';
      }
    });
  }

  cancelBooking(id: number): void {
    this.httpService.updateBookingStatus(id, 'CANCELLED').subscribe({
      next: () => {
        this.showMessage = true;
        this.responseMessage = 'Booking cancelled successfully.';
        this.loadBookings();
      },
      error: (err) => {
        this.showError = true;
        this.errorMessage = err?.error?.message || 'Cancel failed.';
      }
    });
  }

  downloadTicket(id: number): void {
    this.httpService.downloadTicket(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'ticket.pdf';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.showError = true;
        this.errorMessage = 'Download failed.';
      }
    });
  }
}

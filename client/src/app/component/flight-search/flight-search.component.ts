import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.scss']
})
export class FlightSearchComponent implements OnInit {
  searchForm: FormGroup;
  flights: any[] = [];
  sourceList: string[] = [];
  destinationList: string[] = [];
  selectedFlight: any = null;
  seatNumbers = '';
  totalPrice = 0;
  dropdownOpen = false;
  showMessage = false;
  showError = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private httpService: HttpService, private authService: AuthService) {
    this.searchForm = this.fb.group({
      source: ['', Validators.required],
      destination: ['', Validators.required],
      date: ['', Validators.required],
      adult: [1, [Validators.required, Validators.min(1)]],
      child: [0, [Validators.required, Validators.min(0)]],
      infant: [0, [Validators.required, Validators.min(0)]],
      travelClass: ['Economy', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSuggestions();
  }

  loadSuggestions(): void {
    this.httpService.suggestSource().subscribe({
      next: (items: any[]) => this.sourceList = items.map(item => item.source || item),
      error: () => this.sourceList = []
    });
    this.httpService.suggestDestination().subscribe({
      next: (items: any[]) => this.destinationList = items.map(item => item.destination || item),
      error: () => this.destinationList = []
    });
  }

  search(): void {
    this.showError = false;
    if (this.searchForm.invalid) {
      this.showError = true;
      this.errorMessage = 'Please fill all required search fields.';
      return;
    }
    const { source, destination, date } = this.searchForm.value;
    this.httpService.searchFlights(source, destination, date).subscribe({
      next: (data: any[]) => {
        this.flights = data;
        this.showMessage = false;
      },
      error: () => {
        this.showError = true;
        this.errorMessage = 'Flight search failed.';
      }
    });
  }

  viewFlight(flight: any): void {
    this.selectedFlight = flight;
    const { adult, child, infant } = this.searchForm.value;
    this.totalPrice = adult * flight.price + child * flight.price * 0.75 + infant * flight.price * 0.5;
    this.httpService.getSeats(flight.id).subscribe({
      next: () => {},
      error: () => {
        this.showError = true;
        this.errorMessage = 'Unable to load seats.';
      }
    });
  }

  onSeatSelected(seat: string): void {
    this.seatNumbers = seat;
  }

  updateTravelerCount(field: string, amount: number): void {
    const current = this.searchForm.get(field)?.value || 0;
    const updated = current + amount;
    if (updated >= 0) {
      this.searchForm.get(field)?.setValue(updated);
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  bookSelectedFlight(): void {
    if (!this.selectedFlight || !this.seatNumbers) {
      this.showError = true;
      this.errorMessage = 'Please select a flight and seat.';
      return;
    }
    const userId = Number(this.authService.getUserId());
    if (!userId) {
      this.showError = true;
      this.errorMessage = 'User not logged in.';
      return;
    }
    const seatList = this.seatNumbers.split(',').map(s => s.trim()).filter(Boolean);
    this.httpService.bookSeats(this.selectedFlight.id, seatList, userId).subscribe({
      next: () => {
        this.showMessage = true;
        this.showError = false;
        this.errorMessage = '';
      },
      error: () => {
        this.showError = true;
        this.errorMessage = 'Booking failed.';
      }
    });
  }
}

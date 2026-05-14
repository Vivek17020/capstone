import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Seat } from '../../model/seat';
import { SeatService } from '../../services/seat.service';

@Component({
  selector: 'app-seat',
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.scss']
})
export class SeatSelectionComponent implements OnInit, OnChanges {
  @Input() seats: Seat[] = [];
  @Input() flightId?: number;
  @Output() seatSelected = new EventEmitter<string>();

  seatMap: { row: string; seats: Seat[] }[] = [];
  selectedSeatNumber: string | null = null;

  constructor(private seatService: SeatService) {}

  ngOnInit(): void {
    if (this.flightId) {
      this.loadSeats();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['seats'] && this.seats) {
      this.buildSeatMap();
    }
  }

  loadSeats(): void {
    if (!this.flightId) {
      return;
    }
    this.seatService.getSeats(this.flightId).subscribe((data) => {
      this.seats = data;
      this.buildSeatMap();
    });
  }

  buildSeatMap(): void {
    const map: { [row: string]: Seat[] } = {};
    this.seats.forEach((seat) => {
      const row = seat.rowLabel || seat.seatNumber?.charAt(0) || 'A';
      if (!map[row]) {
        map[row] = [];
      }
      map[row].push(seat);
    });
    this.seatMap = Object.keys(map).sort().map((row) => ({ row, seats: map[row] }));
  }

  selectSeat(seat: Seat): void {
    if (!seat.isAvailable || seat.isBlocked) {
      return;
    }
    this.selectedSeatNumber = seat.seatNumber;
    this.seatSelected.emit(seat.seatNumber);
  }
}

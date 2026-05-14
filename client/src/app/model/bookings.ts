import { Flights, FlightStatus } from './flights';
import { User } from './user';

export enum PaymentStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED'


}

export enum BookingStatus {
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED'

}


export interface Bookings {
    id?: number;
    user: User;
    flight: Flights;
    bookingDate: string;
    seatNumbers: string;
    paymentStatus: PaymentStatus;
    pnr: string;
    status: BookingStatus;


}
export { User };


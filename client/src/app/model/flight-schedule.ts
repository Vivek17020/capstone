import { Flights, FlightStatus } from './flights';
import { User } from './bookings'; // Assuming User is defined in bookings.ts or a separate user.ts

export enum ScheduleStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    COMPLETED = 'COMPLETED'
}

export interface FlightSchedule {
    id?: number;
    flight: Flights;
    pilot: User;
    scheduledDate: string;
    status: ScheduleStatus;
    assignStatus: string;
}

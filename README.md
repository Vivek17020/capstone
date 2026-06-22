# End-to-End-Airline-Reservation-Travel-Experience-System

app_user is the central actor. The same table holds all three roles — ADMIN, PILOT, and PASSENGER — differentiated by the role enum. It carries both OTP fields (for email verification at registration) and reset OTP fields (for forgot-password), plus the older token-based reset fields.
flights is the core data entity. It tracks everything about a flight — route, schedule, pricing, and real-time seat inventory (available_seats decremented on booking, restored on cancellation). status mirrors the schedule state machine (SCHEDULED → AWAITING_PILOT_ACCEPTANCE → CONFIRMED → BOARDING → COMPLETED / CANCELLED).
seat has a many-to-one back to flights (each flight owns all its seats via @OneToMany cascade). Individual seats carry flags — blocked, xl, emergency_exist — that the seat map UI uses to render the cabin layout. available flips to false on booking and back to true on cancellation, always inside a pessimistic write lock.
bookings is the join between a passenger (user_id) and a flight (flight_id). seat_numbers is stored as a comma-separated string (e.g. "A1,A2,B3"). The pnr is a unique 8-char UUID prefix. payment_status is an enum (PENDING / SUCCESS / FAILED); status is a plain string (CONFIRMED / CANCELLED).
flight_schedule links a flight to a pilot for a specific date. It has two status fields — status (overall schedule state) and assign_status (pilot's acceptance state) — which the state machine updates in tandem when the pilot accepts or rejects, or the admin moves through boarding → completed.


In short

app_user is the main user table containing all roles — ADMIN, PILOT, and PASSENGER — identified using a role enum. It also manages email verification OTPs, forgot-password OTPs, and token-based password reset details.

flights stores complete flight details like route, timing, price, seat availability, and flight status. Seat counts decrease on booking and restore on cancellation. Flight status follows a lifecycle such as SCHEDULED → CONFIRMED → BOARDING → COMPLETED/CANCELLED.

seat represents individual seats linked to a flight. It manages seat properties like blocked seats, XL seats, emergency exit seats, and availability. Seat booking updates happen safely using pessimistic locking.

bookings connects passengers with flights. It stores booked seat numbers, unique PNR, payment status, and booking status such as CONFIRMED or CANCELLED.

flight_schedule maps pilots to flights on specific dates. It tracks both overall flight schedule status and pilot assignment acceptance/rejection status through the scheduling workflow.


Screenshot_2026-05-18-12-51-44-837-edit_cn.wps.xiaomi.abroad.lite.jpg
Ok provide this i text

END-TO-END FLOW DIAGRAM
User visits the application

User performs Register / Login

JWT Token is generated

Role validation is performed

Passenger Flow
Search Flights

View Available Flights

Select Seats

Check Availability

Book Ticket

Generate PNR

Download PDF Ticket

Admin Flow
Add / Manage Flights

View All Bookings

Assign Pilots

Manage Schedule Status

Pilot Flow
View Assigned Schedules

Update Flight Status

Database
All modules interact with the Central Database (MySQL) for storing and updating flight, booking, seat, pilot, and user information.


Get me the short overview of complete project for resume

Airline Reservation System – Project Overview (Resume)
Developed a full-stack Airline Reservation System using Spring Boot, Angular, JWT Authentication, and MySQL. The application supports role-based access for Admin, Pilot, and Passenger users. Passengers can search flights, select seats, book tickets, generate PNRs, and download PDF tickets. Admins can manage flights, assign pilots, monitor bookings, and control flight schedules, while pilots can view assigned schedules and update flight statuses. Implemented secure JWT-based authentication, OTP verification, seat inventory management with concurrency control, and real-time flight scheduling workflows.

Key Features:

Role-Based Access Control (Admin, Pilot, Passenger)

JWT Authentication & OTP Verification

Flight Search and Seat Booking System

PNR Generation and PDF Ticket Download

Pilot Assignment and Schedule Management

Real-Time Flight Status Tracking

MySQL Database with Entity Relationships

Secure REST APIs using Spring Boot

Tech Stack: Java, Spring Boot, Angular, MySQL, Hibernate/JPA, JWT, REST APIs, Maven, Git.

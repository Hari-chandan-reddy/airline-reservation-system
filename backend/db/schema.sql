CREATE DATABASE airline_db;


CREATE TABLE User (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'Customer'
);


CREATE TABLE Flight (
    flight_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    flight_number VARCHAR(20) NOT NULL,
    airline_name VARCHAR(100) NOT NULL,
    source VARCHAR(50) NOT NULL,
    destination VARCHAR(50) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    total_seats INT NOT NULL
);


CREATE TABLE Booking (
    booking_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    flight_id BIGINT,
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    booking_status VARCHAR(20) DEFAULT 'Pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE SET NULL,
    FOREIGN KEY (flight_id) REFERENCES Flight(flight_id) ON DELETE CASCADE
);


CREATE TABLE Flight_Seat (
    flight_seat_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    flight_id BIGINT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    seat_class VARCHAR(20) DEFAULT 'Economy',
    status VARCHAR(20) DEFAULT 'Available',
    FOREIGN KEY (flight_id) REFERENCES Flight(flight_id) ON DELETE CASCADE,
    UNIQUE KEY unique_flight_seat (flight_id, seat_number)
);


CREATE TABLE Passenger (
    passenger_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT,
    flight_seat_id BIGINT UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    gender VARCHAR(10),
    age INT,
    passport_number VARCHAR(50),
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (flight_seat_id) REFERENCES Flight_Seat(flight_seat_id) ON DELETE SET NULL
);


CREATE TABLE Payment (
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'Pending',
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id) ON DELETE CASCADE
);

ALTER TABLE Flight_Seat ADD COLUMN price DECIMAL(10, 2) NOT NULL;
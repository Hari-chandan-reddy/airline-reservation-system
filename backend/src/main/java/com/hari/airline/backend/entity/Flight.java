package com.hari.airline.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Flight")
@Data
public class Flight {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "flight_id")
	private Long flightId;
	
	@Column(name = "flight_number", nullable = false, length = 20)
	private String flightNumber;
	
	@Column(name = "airline_name", nullable = false, length = 100)
	private String airlineName;
	
	@Column(name = "source", nullable = false, length = 50)
	private String source;
	
	@Column(name = "destination", nullable = false, length = 50)
	private String destination;
	
	@Column(name = "departure_time", nullable = false)
	private LocalDateTime departureTime;
	
	@Column(name = "arrival_time", nullable = false)
	private LocalDateTime arrivalTime;
	
	@Column(name = "total_seats", nullable = false)
	private int totalSeats;
}
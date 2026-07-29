package com.hari.airline.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Passenger")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Passenger {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "passenger_id")
	private Long passengerId;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "booking_id")
	@JsonBackReference
	private Booking booking;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "flight_seat_id")
	private FlightSeat flightSeat;
	
	@Column(name = "first_name", nullable = false, length = 50)
	private String firstName;
	
	@Column(name = "last_name", nullable = false, length = 50)
	private String lastName;
	
	@Column(name = "gender", length = 10)
	private String gender;
	
	@Column(name = "age")
	private int age;
	
	@Column(name = "passport_number", length = 50)
	private String passportNumber;
}
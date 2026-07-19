package com.hari.airline.backend.entity;

import java.math.BigDecimal;

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
@Table(name = "Flight_Seat")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class FlightSeat {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "flight_seat_id")
	private Long flightSeatId;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "flight_id", nullable = false)
	private Flight flight;
	
	@Column(name = "seat_number", nullable = false, length = 10)
	private String seatNumber;
	
	@Column(name = "seat_class", length = 20)
	private String seatClass = "Economy";
	
	@Column(name = "status", length = 20)
	private String status = "Available";
	
	@Column(name = "price", nullable = false)
	private BigDecimal price;
}
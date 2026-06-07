package com.hari.airline.backend.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Booking")
@Data
public class Booking {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "booking_id")
	private Long bookingId;
	
	@Column(name = "user_id")
	private Long userId;
	
	@Column(name = "flight_id")
	private Long flightId;
	
	@Column(name = "booking_date")
	private LocalDateTime bookingDate;
	
	@Column(name = "booking_status")
	private String bookingStatus;
	
	@Column(name = "total_amount")
	private BigDecimal totalAmount;
}
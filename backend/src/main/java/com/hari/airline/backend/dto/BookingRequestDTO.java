package com.hari.airline.backend.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class BookingRequestDTO {
	private Long userId;
	private Long flightId;
	private String seatNumber;
	private BigDecimal totalAmount;
	private String firstName;
	private String lastName;
	private String passportNumber;
}
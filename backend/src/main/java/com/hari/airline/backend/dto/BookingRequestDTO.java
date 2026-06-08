package com.hari.airline.backend.dto;

import lombok.Data;

@Data
public class BookingRequestDTO {
	private Long userId;
	private Long flightId;
	private String seatNumber;
	private String firstName;
	private String lastName;
	private String gender;
	private int age;
	private String passportNumber;
	private String paymentMethod;
}
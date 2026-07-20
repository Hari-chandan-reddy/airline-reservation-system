package com.hari.airline.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hari.airline.backend.dto.BookingRequestDTO;
import com.hari.airline.backend.entity.Booking;
import com.hari.airline.backend.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {
	private final BookingService bookingService;
	
	public BookingController(BookingService bookingService) {
		this.bookingService = bookingService;
	}
	
	@PostMapping
	public ResponseEntity<?> conformBooking(@RequestBody BookingRequestDTO dto) {
		try {
			Booking booking = bookingService.createBooking(dto);
			return ResponseEntity.ok(booking);
		} catch (RuntimeException rtEx) {
			return ResponseEntity.badRequest().body(rtEx.getMessage());
		}
	}
	
	@GetMapping("user/{userId}")
	public ResponseEntity<List<Booking>> getUserBookings(@PathVariable Long userId) {
		List<Booking> userBookings = bookingService.getBookingsByUserId(userId);
		return ResponseEntity.ok(userBookings);
	}
	
	@PutMapping("/{bookingId}/cancel")
	public ResponseEntity<?> cancelBooking(@PathVariable Long bookingId) {
		try {
			String message = bookingService.cancelBooking(bookingId);
			return ResponseEntity.ok(message);
		} catch (RuntimeException rtEx) {
			return ResponseEntity.badRequest().body(rtEx.getMessage());
		}
	}
}
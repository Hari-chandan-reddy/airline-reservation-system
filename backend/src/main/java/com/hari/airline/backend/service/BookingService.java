package com.hari.airline.backend.service;

import org.springframework.stereotype.Service;

import com.hari.airline.backend.dto.BookingRequestDTO;
import com.hari.airline.backend.entity.Booking;
import com.hari.airline.backend.entity.Flight;
import com.hari.airline.backend.entity.User;
import com.hari.airline.backend.repository.BookingRepository;
import com.hari.airline.backend.repository.FlightRepository;
import com.hari.airline.backend.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class BookingService {
	private final BookingRepository bookingRepository;
	private final UserRepository userRepository;
	private final FlightRepository flightRepository;
	
	public BookingService(BookingRepository bookingRepository, UserRepository userRepository, FlightRepository flightRepository) {
		this.bookingRepository = bookingRepository;
		this.userRepository = userRepository;
		this.flightRepository = flightRepository;
	}
	
	@Transactional
	public Booking createBooking(BookingRequestDTO dto) {
		User user = userRepository.findById(dto.getUserId())
				.orElseThrow(() -> new RuntimeException("User not found with ID: " + dto.getUserId()));
		
		Flight flight = flightRepository.findWithLockByFlightId(dto.getFlightId())
				.orElseThrow(() -> new RuntimeException("Flight not fount with ID: " + dto.getFlightId()));
		
		if(flight.getTotalSeats() <= 0) {
			throw new RuntimeException("Sorry, this flight is fully booked!");
		}
		
		flight.setTotalSeats(flight.getTotalSeats() - 1);
		flightRepository.save(flight);
		
		Booking booking = new Booking();
		booking.setUser(user);
		booking.setFlight(flight);
		booking.setTotalAmount(dto.getTotalAmount());
		booking.setBookingStatus("Confirmed");
		
		
		return bookingRepository.save(booking);
	}
}
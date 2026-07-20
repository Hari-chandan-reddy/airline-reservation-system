package com.hari.airline.backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hari.airline.backend.dto.BookingRequestDTO;
import com.hari.airline.backend.entity.Booking;
import com.hari.airline.backend.entity.Flight;
import com.hari.airline.backend.entity.FlightSeat;
import com.hari.airline.backend.entity.Passenger;
import com.hari.airline.backend.entity.Payment;
import com.hari.airline.backend.entity.User;
import com.hari.airline.backend.repository.BookingRepository;
import com.hari.airline.backend.repository.FlightRepository;
import com.hari.airline.backend.repository.FlightSeatRepository;
import com.hari.airline.backend.repository.PassengerRepository;
import com.hari.airline.backend.repository.PaymentRepository;
import com.hari.airline.backend.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class BookingService {
	private final BookingRepository bookingRepository;
	private final UserRepository userRepository;
	private final FlightRepository flightRepository;
	private final FlightSeatRepository flightSeatRepository;
	private final PassengerRepository passengerRepository;
	private final PaymentRepository paymentRepository;
	
	public BookingService(BookingRepository bookingRepository, UserRepository userRepository, FlightRepository flightRepository, FlightSeatRepository flightSeatRepository, PassengerRepository passengerRepository, PaymentRepository paymentRepository) {
		this.bookingRepository = bookingRepository;
		this.userRepository = userRepository;
		this.flightRepository = flightRepository;
		this.flightSeatRepository = flightSeatRepository;
		this.passengerRepository = passengerRepository;
		this.paymentRepository = paymentRepository;
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
		
		// Validate and Update Flight Seat
		FlightSeat seat = flightSeatRepository.findByFlightFlightIdAndSeatNumber(dto.getFlightId(), dto.getSeatNumber())
				.orElseThrow(() -> new RuntimeException("Seat " + dto.getSeatNumber() + " does not exist on this flight."));
		
		if(!"Available".equalsIgnoreCase(seat.getStatus())) {
			throw new RuntimeException("Seat " + dto.getSeatNumber() + " is already booked!");
		}
		
		// Reserve the physical seat
		seat.setStatus("Booked");
		flightSeatRepository.save(seat);
		
		// Reduce available flight capacity count
		flight.setTotalSeats(flight.getTotalSeats() - 1);
		flightRepository.save(flight);
		
		// Extract the exact price from the database seat record
		BigDecimal calculatedPrice = seat.getPrice();
		
		// Create and Save Booking Record
		Booking booking = new Booking();
		booking.setUser(user);
		booking.setFlight(flight);
		booking.setTotalAmount(calculatedPrice);
		booking.setBookingStatus("Confirmed");
		Booking savedBooking = bookingRepository.save(booking);
		
		// Create and Save Passenger Details
		Passenger passenger = new Passenger();
		passenger.setBooking(savedBooking);
		passenger.setFlightSeat(seat);
		passenger.setFirstName(dto.getFirstName());
		passenger.setLastName(dto.getLastName());
		passenger.setGender(dto.getGender());
		passenger.setAge(dto.getAge());
		passenger.setPassportNumber(dto.getPassportNumber());
		passengerRepository.save(passenger);
		
		// Create and Save Payment Transaction Record
		Payment payment = new Payment();
		payment.setBooking(savedBooking);
		payment.setAmount(calculatedPrice);
		payment.setPaymentMethod(dto.getPaymentMethod());
		payment.setPaymentStatus("Success");
		paymentRepository.save(payment);
		
		return savedBooking;
	}
	
	public List<Booking> getBookingsByUserId(Long userId) {
		List<Booking> bookings = bookingRepository.findByUserUserId(userId);
		
		// Trigger lazy loading explicitly for nested properties so Jackson can serialize them
		for (Booking b : bookings) {
			if (b.getPassengers() != null) {
				for (Passenger p : b.getPassengers()) {
					if (p.getFlightSeat() != null) {
						p.getFlightSeat().getSeatNumber(); // Forces loading the seat details
					}
				}
			}
		}
		
		return bookings;
	}
	
	@Transactional
	public String cancelBooking(Long bookingId) {
		Booking booking = bookingRepository.findById(bookingId)
				.orElseThrow(() -> new RuntimeException("Bookings not found with ID: " + bookingId));
		
		if ("CANCELLED".equalsIgnoreCase(booking.getBookingStatus())) {
			throw new RuntimeException("This booking is already cancelled.");
		}
		
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime departureTime = booking.getFlight().getDepartureTime();
		
		if (departureTime != null && now.plusHours(24).isAfter(departureTime)) {
			throw new RuntimeException("Cancellation failed: Bookings can only be cancelled at least 24 hours prior flight departure.");
		}
		
		booking.setBookingStatus("CANCELLED");
		bookingRepository.save(booking);
		
		if (booking.getPassengers() != null) {
			for (Passenger passenger : booking.getPassengers()) {
				FlightSeat seat = passenger.getFlightSeat();
				if (seat != null) {
					seat.setStatus("Available");
					flightSeatRepository.save(seat);
					
					passenger.setFlightSeat(null);
				}
			}
		}
		
		return "Booking cancelled successfully.";
	}
}
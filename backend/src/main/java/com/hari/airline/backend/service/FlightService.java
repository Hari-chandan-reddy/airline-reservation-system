package com.hari.airline.backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hari.airline.backend.entity.Flight;
import com.hari.airline.backend.entity.FlightSeat;
import com.hari.airline.backend.repository.FlightRepository;
import com.hari.airline.backend.repository.FlightSeatRepository;

@Service
public class FlightService {
	private final FlightRepository flightRepository;
	private final FlightSeatRepository flightSeatRepository;
	
	// Constructor Injection to link our repository layer
	public FlightService(FlightRepository flightRepository, FlightSeatRepository flightSeatRepository) {
		this.flightRepository = flightRepository;
		this.flightSeatRepository = flightSeatRepository;
	}
	
	// Business Logic: Retrieve only upcoming flights
	public List<Flight> getAllFlights() {
		return flightRepository.findByDepartureTimeAfter(LocalDateTime.now());
	}
	
	// Business Logic: Search flights by source and destination cities
	public List<Flight> searchFlights(String source, String destination) {
		LocalDateTime cutoffTime = LocalDateTime.now().plusHours(2);
		return flightRepository.findBySourceAndDestinationAndDepartureTimeAfter(source, destination, cutoffTime);
	}
	
	// Business Logic: Retrieve seats by flight ID
	public List<FlightSeat> getSeatsByFlightId(Long flightId) {
		if(!flightRepository.existsById(flightId)) {
			throw new RuntimeException("Flight not found with ID: " + flightId);
		}
		
		return flightSeatRepository.findByFlightFlightId(flightId);
	}
	
	// Retrieve ALL flights for admin (including past ones)
	public List<Flight> getAllFlightsAdmin() {
		return flightRepository.findAll();
	}
	
	// Add new flight & automatically generate seat grid
	@Transactional
	public Flight addFlight(Flight flight) {
		Flight savedFlight = flightRepository.save(flight);
		
		List<FlightSeat> seats = new ArrayList<>();
		int totalSeats = flight.getTotalSeats();
		char[] seatLetters = {'A', 'B', 'C', 'D', 'E', 'F'};
		
		for(int i = 0; i < totalSeats; i++) {
			int row = (i / 6) + 1;
			char letter = seatLetters[i % 6];
			String seatNumber = row + String.valueOf(letter);
			
			FlightSeat seat = new FlightSeat();
			seat.setFlight(savedFlight);
			seat.setSeatNumber(seatNumber);
			seat.setSeatClass(row <= 2 ? "Business" : "Economy");
			seat.setStatus("Available");
			seat.setPrice(row <= 2 ? new BigDecimal("5000.00") : new BigDecimal("3000.00"));
			
			seats.add(seat);
		}
		
		flightSeatRepository.saveAll(seats);
		return savedFlight;
	}
	
	public void deleteFlight(Long flightId) {
		if(!flightRepository.existsById(flightId)) {
			throw new RuntimeException("Flight not found with ID: " + flightId);
		}
		flightRepository.deleteById(flightId);
	}
	
	// Update status or times for a flight
	@Transactional
	public Flight updateFlightStatus(Long flightId, String status, LocalDateTime newDeparture, LocalDateTime newArrival) {
	    Flight flight = flightRepository.findById(flightId)
	            .orElseThrow(() -> new RuntimeException("Flight not found with ID: " + flightId));

	    if (status != null && !status.trim().isEmpty()) {
	        flight.setStatus(status);
	    }
	    
	    if (newDeparture != null) {
	        flight.setDepartureTime(newDeparture);
	    }
	    
	    if (newArrival != null) {
	        flight.setArrivalTime(newArrival);
	    }

	    return flightRepository.save(flight);
	}
}
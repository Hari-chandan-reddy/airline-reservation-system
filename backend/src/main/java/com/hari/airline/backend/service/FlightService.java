package com.hari.airline.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

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
}
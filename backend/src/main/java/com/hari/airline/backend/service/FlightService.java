package com.hari.airline.backend.service;

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
	
	// Business Logic: Retrieve all flights currently in the system
	public List<Flight> getAllFlights() {
		return flightRepository.findAll();
	}
	
	// Business Logic: Search flights by source and destination cities
	public List<Flight> serchFlights(String source, String destination) {
		return flightRepository.findBySourceAndDestination(source, destination);
	}
	
	// Business Logic: Retrieve seats by flight ID
	public List<FlightSeat> getSeatsByFlightId(Long flightId) {
		if(!flightRepository.existsById(flightId)) {
			throw new RuntimeException("Flight not found with ID: " + flightId);
		}
		
		return flightSeatRepository.findByFlightFlightId(flightId);
	}
}
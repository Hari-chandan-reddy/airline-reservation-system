package com.hari.airline.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hari.airline.backend.entity.Flight;
import com.hari.airline.backend.repository.FlightRepository;

@Service
public class FlightService {
	private final FlightRepository flightRepository;
	
	// Constructor Injection to link our repository layer
	public FlightService(FlightRepository flightRepository) {
		this.flightRepository = flightRepository;
	}
	
	// Business Logic: Retrieve all flights currently in the system
	public List<Flight> getAllFlights() {
		return flightRepository.findAll();
	}
}
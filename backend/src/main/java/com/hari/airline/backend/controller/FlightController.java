package com.hari.airline.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hari.airline.backend.entity.Flight;
import com.hari.airline.backend.service.FlightService;

@RestController
@RequestMapping("/api/flights") // Base path for all flight routes
@CrossOrigin(origins = "http://localhost:5173")
public class FlightController {
	private FlightService flightService;
	
	public FlightController(FlightService flightService) {
		this.flightService = flightService;
	}
	
	@GetMapping
	public ResponseEntity<List<Flight>> getAllFlights() {
		List<Flight> availableFlights = flightService.getAllFlights();

		return ResponseEntity.ok(availableFlights);
	}
}
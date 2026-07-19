package com.hari.airline.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hari.airline.backend.entity.Flight;
import com.hari.airline.backend.entity.FlightSeat;
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
	
	@GetMapping("/search")
	public ResponseEntity<List<Flight>> searchFlights(@RequestParam String source, @RequestParam String destination) {
		List<Flight> resultFlights = flightService.serchFlights(source, destination);
		
		return ResponseEntity.ok(resultFlights);
	}
	
	@GetMapping("/{flightId}/seats")
	public ResponseEntity<List<FlightSeat>> getSeatsByFlightId(@PathVariable Long flightId) {
		List<FlightSeat> seats = flightService.getSeatsByFlightId(flightId);
		
		return ResponseEntity.ok(seats);
	}
}
package com.hari.airline.backend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import com.hari.airline.backend.entity.Flight;

import jakarta.persistence.LockModeType;

public interface FlightRepository extends JpaRepository<Flight, Long>{
	
	// All flights that haven't departed yet (departure_time > NOW)
	List<Flight> findByDepartureTimeAfter(LocalDateTime now);
	
	// Search results: Flights departing at least 2 hours from now
	List<Flight> findBySourceAndDestinationAndDepartureTimeAfter(String source, String destination, LocalDateTime cutoffTime);
	
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	Optional<Flight> findWithLockByFlightId(Long flightId);
}
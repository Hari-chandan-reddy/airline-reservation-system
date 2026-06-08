package com.hari.airline.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hari.airline.backend.entity.FlightSeat;

public interface FlightSeatRepository extends JpaRepository<FlightSeat, Long>{
	Optional<FlightSeat> findByFlightFlightIdAndSeatNumber(Long flightId, String seatNumber);
}
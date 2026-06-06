package com.hari.airline.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hari.airline.backend.entity.Flight;

public interface FlightRepository extends JpaRepository<Flight, Long>{
	List<Flight> findBySourceAndDestination(String source, String destination);
}
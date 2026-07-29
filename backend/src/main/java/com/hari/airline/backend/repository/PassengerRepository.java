package com.hari.airline.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hari.airline.backend.entity.Passenger;

public interface PassengerRepository extends JpaRepository<Passenger, Long>{
	List<Passenger> findByBookingBookingId(Long bookingId);
}
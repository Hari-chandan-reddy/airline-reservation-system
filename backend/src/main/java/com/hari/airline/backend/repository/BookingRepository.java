package com.hari.airline.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hari.airline.backend.entity.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long>{
	// Finds all bookings made by a specific user ID
	List<Booking> findByUserUserId(Long userId);
}
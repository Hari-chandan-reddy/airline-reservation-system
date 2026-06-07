package com.hari.airline.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hari.airline.backend.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long>{}
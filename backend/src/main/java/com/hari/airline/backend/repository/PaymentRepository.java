package com.hari.airline.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hari.airline.backend.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long>{
	Payment findByBookingBookingId(Long bookingId);
}
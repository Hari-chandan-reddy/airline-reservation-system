package com.hari.airline.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hari.airline.backend.entity.Passenger;

public interface PassengerRepository extends JpaRepository<Passenger, Long>{}
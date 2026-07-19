package com.hari.airline.backend.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Booking")
@Data
// Prevents Jackson serialization errors caused by Hibernate's lazy-loading proxy properties
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Booking {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "booking_id")
	private Long bookingId;
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;
	
	@Column(name = "booking_date")
	private LocalDateTime bookingDate = LocalDateTime.now();
	
	@Column(name = "booking_status")
	private String bookingStatus = "Pending";
	
	@Column(name = "total_amount", nullable = false)
	private BigDecimal totalAmount;
	
	@OneToMany(mappedBy = "booking", fetch = FetchType.EAGER)
	// Marks the child-side of a relationship; prevents infinite loops/StackOverflow errors during JSON serialization
	@JsonManagedReference
	private List<Passenger> passengers;
}
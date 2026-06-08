package com.hari.airline.backend;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class BackendApplication {
	
	@PostConstruct
    public void init() {
        // This forces Spring Boot application to use India's clock time
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
    }
	
	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}
}
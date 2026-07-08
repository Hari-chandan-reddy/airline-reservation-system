package com.hari.airline.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hari.airline.backend.entity.User;
import com.hari.airline.backend.service.UserService;

@RestController
@RequestMapping("/api/auth") // Root URL path for authentication APIs
@CrossOrigin(origins = "http://localhost:5173") // Enables React to communicate safely
public class UserController {
	private final UserService userService;
	
	public UserController(UserService userService) {
		this.userService = userService;
	}
	
	// HTTP POST mapping to handle user registration
	@PostMapping("/register") // Full URL becomes: POST http://localhost:8080/api/auth/register
	public ResponseEntity<?> registerUser(@RequestBody User user) {
		try {
			User registeredUser = userService.registerUser(user);
			return ResponseEntity.ok(registeredUser);
		} catch(RuntimeException rtEx) {
			return ResponseEntity.badRequest().body(rtEx.getMessage());
		}
	}
	
	// HTTP POST mapping to handle user login authentication
	@PostMapping("/login") // Full URL: POST http://localhost:8080/api/auth/login
	public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
		try {
			// Pass email and raw password inputs to the business layer verification method
			User authenticatedUser = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
			return ResponseEntity.ok(authenticatedUser);
		} catch(RuntimeException rtEx) {
			return ResponseEntity.badRequest().body(rtEx.getMessage());
		}
	}
}
package com.hari.airline.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.hari.airline.backend.entity.User;
import com.hari.airline.backend.repository.UserRepository;

@Service
public class UserService {
	private final UserRepository userRepository;
	private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();	// Initialize encoder
	
	// Constructor Injection (Dependency injection)
	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}
	
	// Business Logic: Register a new user
	public User registerUser(User user) {
		// Business Rule: Check if email is already taken
		Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
		if(existingUser.isPresent()) {
			throw new RuntimeException("Email is already registered!");
		}
		
		// Secure Hashing: Encode the password before it touches MYSQL
		String hashedPwd = passwordEncoder.encode(user.getPassword());
		user.setPassword(hashedPwd);
		
		// 🔒 SECURITY GUARD: Always force newly registered accounts to default USER role
		user.setRole("Customer");
		
		return userRepository.save(user);
	}
	
	// Business Logic: Authenticate User Login
	public User loginUser(String email, String rawPassword) {
		// Check if email exists
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("Authentication failed: Email not found."));
		
		// Safe one-way comparison (Raw input vs Database scrambled hash)
		if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
			throw new RuntimeException("Authentication failed: Invalid credentials.");
		}
		
		return user; // Success! Return profile metadata
	}
	
	public List<User> getAdminUsers() {
        return userRepository.findByRole("ADMIN");
    }
}
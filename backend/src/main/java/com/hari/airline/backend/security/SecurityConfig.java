package com.hari.airline.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(List.of("*"));
                config.setAllowCredentials(true);
                return config;
            }))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Allow OPTIONS preflight calls
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Public API Endpoints
                .requestMatchers("/api/auth/login", "/api/auth/register", "/api/users/login", "/api/users/register").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/flights/search", "/api/flights").permitAll()
                
                // Admin-Only Endpoints (hasAnyAuthority accepts "Admin" or "ROLE_Admin" safely)
                .requestMatchers("/api/auth/users", "/api/auth").hasAnyAuthority("Admin", "ROLE_Admin")
                .requestMatchers("/api/flights/admin/**", "/api/bookings/admin/**").hasAnyAuthority("Admin", "ROLE_Admin")
                .requestMatchers(HttpMethod.POST, "/api/flights/**").hasAnyAuthority("Admin", "ROLE_Admin")
                .requestMatchers(HttpMethod.PUT, "/api/flights/**").hasAnyAuthority("Admin", "ROLE_Admin")
                .requestMatchers(HttpMethod.DELETE, "/api/flights/**").hasAnyAuthority("Admin", "ROLE_Admin")
                
                // Authenticated User / Booking Endpoints
                .requestMatchers("/api/bookings/**").hasAnyAuthority("Customer", "ROLE_Customer", "Admin", "ROLE_Admin")
                
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
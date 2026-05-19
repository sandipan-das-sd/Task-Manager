package com.taskapp.taskmanager.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {


    private final JwtAuthFilter jwtAuthFilter;


    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }



    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http

                // disable csrf for REST API
                .csrf(csrf -> csrf.disable())

                // enable cors
                .cors(cors -> {})

                // no session storage (JWT based auth)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // route authorization
                .authorizeHttpRequests(auth -> auth

                        // public routes
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(
                                "/",
                                "/health",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/projects/**")
                        .hasAnyRole("ADMIN", "MEMBER")
                        .requestMatchers(HttpMethod.POST, "/api/projects/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/projects/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/projects/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/tasks/**")
                        .hasAnyRole("ADMIN", "MEMBER")
                        .requestMatchers(HttpMethod.PATCH, "/api/tasks/*/status")
                        .hasAnyRole("ADMIN", "MEMBER")
                        .requestMatchers(HttpMethod.POST, "/api/tasks/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/tasks/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/tasks/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/users/**")
                        .hasAnyRole("ADMIN", "MEMBER")
                        .requestMatchers("/api/users/**").hasRole("ADMIN")

                        // all other routes need login
                        .anyRequest().authenticated()
                )

                // add JWT filter before default auth filter
                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        // build security object
        return http.build();
    }


    // password hashing using bcrypt
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    // authentication manager bean
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {

        return config.getAuthenticationManager();
    }
}

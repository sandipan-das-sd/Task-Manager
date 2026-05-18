package com.taskapp.taskmanager.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;


//generate token
    


    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }



    //extract email from token



    public String extractEmail(String token) {

        return getClaims(token).getSubject();
    }
    public String extractRole(String token) {
        return getClaims(token).get("role", String.class);
    }
    //check token valid or not



    public boolean isTokenValid(String token) {
        return getClaims(token).getExpiration().after(new Date());
    }


//ge all claims from token


    private Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
    }
}
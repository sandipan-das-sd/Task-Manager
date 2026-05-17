package com.taskapp.taskmanager.security;

import com.taskapp.taskmanager.entity.User;
import com.taskapp.taskmanager.repositary.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
private final JwtUtil jwtUtil;
private final UserRepository userRepository;
    public JwtAuthFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }




    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
String authHeader=request.getHeader("Authorization");
if(authHeader==null || !authHeader.startsWith("Bearer "))
{
    filterChain.doFilter(request,response);
    return;
}
//extract token and email
String token=authHeader.substring(7);
String email=jwtUtil.extractEmail(token);

//   email found AND current request has no logged-in user yet
if(email!=null && SecurityContextHolder.getContext().getAuthentication()==null)
{
    //find that user using user repository database query
    User  user=userRepository.findByEmail(email).orElse(null);

    //User exists AND token not expired
    if(user!=null && jwtUtil.isTokenValid(token))
    {
        //validate token
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        user.getEmail(),
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                );
//Set user logged in
        SecurityContextHolder.getContext()
                .setAuthentication(authentication);    }

}

//go to the next
filterChain.doFilter(request,response);


    }
}

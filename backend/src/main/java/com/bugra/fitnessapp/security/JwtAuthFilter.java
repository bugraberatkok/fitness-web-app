package com.bugra.fitnessapp.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

// JwtAuthFilter = Her HTTP isteğinde otomatik çalışan güvenlik filtresi
// OncePerRequestFilter → her istek için tam olarak bir kez çalışır
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final AppUserDetailsService appUserDetailsService;

    public JwtAuthFilter(JwtUtil jwtUtil, AppUserDetailsService appUserDetailsService) {
        this.jwtUtil = jwtUtil;
        this.appUserDetailsService = appUserDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // 1. İstekteki Authorization header'ını al
        // Header şu formatta gelir: "Bearer eyJhbGc..."
        String authHeader = request.getHeader("Authorization");

        String token = null;
        String email = null;

        // 2. Header varsa ve "Bearer " ile başlıyorsa token'ı çıkar
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7); // "Bearer " = 7 karakter, geri kalanı token
            if (jwtUtil.validateToken(token)) {
                email = jwtUtil.getEmailFromToken(token);
            }
        }

        // 3. Email geçerliyse ve kullanıcı henüz authenticate edilmemişse
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = appUserDetailsService.loadUserByUsername(email);
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(userDetails, null, List.of());
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        // 4. İsteği bir sonraki filtreye (veya controller'a) ilet
        filterChain.doFilter(request, response);
    }
}

package com.bugra.fitnessapp.controller;

import com.bugra.fitnessapp.entity.AppUser;
import com.bugra.fitnessapp.repository.AppUserRepository;
import com.bugra.fitnessapp.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// AuthController: Kayıt ve giriş işlemlerini yönetir
// Bu endpoint'ler herkese açık (SecurityConfig'de .permitAll() ile ayarlandı)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(AppUserRepository appUserRepository,
                          PasswordEncoder passwordEncoder,
                          AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    // POST /api/auth/register
    // Body: { "username": "bugra", "email": "bugra@mail.com", "password": "123456" }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String username = body.get("username");

        // Email zaten kayıtlı mı?
        if (appUserRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bu email zaten kayıtlı."));
        }

        // Kullanıcı oluştur — şifreyi BCrypt ile hash'le, ham şifreyi ASLA kaydetme!
        AppUser user = new AppUser();
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password)); // "123456" → "$2a$10$..."

        appUserRepository.save(user);

        // Kayıt başarılı → hemen token üret, kullanıcı direkt giriş yapmış olsun
        String token = jwtUtil.generateToken(email);
        return ResponseEntity.ok(Map.of("token", token, "username", username));
    }

    // POST /api/auth/login
    // Body: { "email": "bugra@mail.com", "password": "123456" }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        // AuthenticationManager email+şifreyi doğrular
        // Yanlış şifre → BadCredentialsException fırlatır (401 döner)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        // Doğrulama başarılı → token üret ve dön
        String token = jwtUtil.generateToken(email);
        AppUser user = appUserRepository.findByEmail(email).orElseThrow();

        return ResponseEntity.ok(Map.of(
                "token", token,
                "username", user.getUsername()
        ));
    }
}

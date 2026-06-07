package com.bugra.fitnessapp.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

// JwtUtil = JWT token'larını oluşturan ve doğrulayan yardımcı sınıf
// @Component → Spring bunu otomatik olarak bir bean olarak tanır, @Autowired ile kullanabiliriz
@Component
public class JwtUtil {

    // application.properties'den alınan secret key ve süre
    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    // Secret key'den HMAC-SHA imzalama anahtarı üretir
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    // Kullanıcı email'inden JWT token üretir
    // İçinde: kim olduğu (subject=email), ne zaman oluşturuldu, ne zaman sona erecek, imza
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)                                         // token kimin için
                .setIssuedAt(new Date())                                   // oluşturulma zamanı
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs)) // bitiş zamanı
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)       // imzala
                .compact();
    }

    // Token'dan email adresini çıkarır
    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Token geçerli mi? (imza doğru mu, süresi dolmamış mı?)
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false; // geçersiz veya süresi dolmuş token
        }
    }
}

package com.bugra.fitnessapp.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

// JwtUtil = JWT token'larını oluşturan ve doğrulayan yardımcı sınıf
// @Component → Spring bunu otomatik olarak bir bean olarak tanır, @Autowired ile kullanabiliriz
@Component
public class JwtUtil {

    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);

    private final Key signingKey;
    private final long jwtExpirationMs;

    // Secret key JWT_SECRET ortam değişkeninden gelir (bkz. application.properties).
    // Boşsa rastgele bir HMAC-SHA anahtarı üretilir; uygulama yeniden başlayınca eski token'lar geçersiz olur.
    public JwtUtil(@Value("${app.jwt.secret}") String jwtSecret,
                   @Value("${app.jwt.expiration-ms}") long jwtExpirationMs) {
        if (jwtSecret.isBlank()) {
            log.warn("JWT_SECRET is not set; using a random signing key. Sessions will not survive a restart.");
            this.signingKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        } else {
            this.signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        }
        this.jwtExpirationMs = jwtExpirationMs;
    }

    private Key getSigningKey() {
        return signingKey;
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

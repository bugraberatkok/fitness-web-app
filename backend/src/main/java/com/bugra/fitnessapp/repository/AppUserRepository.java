package com.bugra.fitnessapp.repository;

import com.bugra.fitnessapp.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// Spring Data JPA sayesinde findByEmail gibi metodları kendimiz yazmıyoruz,
// Spring otomatik olarak SQL sorgusunu üretiyor: SELECT * FROM app_user WHERE email = ?
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String email);
    boolean existsByEmail(String email);
}

package com.bugra.fitnessapp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

// Bu sınıf veritabanında "app_user" tablosunu temsil eder.
// Her kullanıcının id, username, email ve şifreli password'u olur.
@Entity
@Table(name = "app_user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; // bcrypt ile şifrelenmiş hali saklanır, ham şifre asla!

    @Column(nullable = false)
    private String username;

    // Bir kullanıcının birden fazla workout'u olabilir
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Workout> workouts = new ArrayList<>();

    // Bir kullanıcının birden fazla öğünü olabilir
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DailyMeal> dailyMeals = new ArrayList<>();
}

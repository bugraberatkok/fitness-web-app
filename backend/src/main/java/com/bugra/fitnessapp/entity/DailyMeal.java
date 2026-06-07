package com.bugra.fitnessapp.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DailyMeal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    private String mealName;

    @OneToMany(mappedBy = "dailyMeal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FoodItem> foods = new ArrayList<>();

    // Her öğün bir kullanıcıya aittir
    @ManyToOne(fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private AppUser user;
}
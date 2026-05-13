package com.bugra.fitnessapp.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bugra.fitnessapp.entity.DailyMeal;

public interface DailyMealRepository extends JpaRepository<DailyMeal, Long> {
    List<DailyMeal> findByDate(LocalDate date);
}
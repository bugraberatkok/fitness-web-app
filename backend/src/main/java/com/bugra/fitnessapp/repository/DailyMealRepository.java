package com.bugra.fitnessapp.repository;

import com.bugra.fitnessapp.entity.AppUser;
import com.bugra.fitnessapp.entity.DailyMeal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DailyMealRepository extends JpaRepository<DailyMeal, Long> {
    List<DailyMeal> findByUser(AppUser user);
}
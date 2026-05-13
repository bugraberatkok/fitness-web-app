package com.bugra.fitnessapp.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bugra.fitnessapp.entity.DailyMeal;
import com.bugra.fitnessapp.entity.FoodItem;
import com.bugra.fitnessapp.repository.DailyMealRepository;

@RestController
@RequestMapping("/api/meals")
@CrossOrigin(origins = "http://localhost:5173")
public class DailyMealController {

    private final DailyMealRepository dailyMealRepository;

    public DailyMealController(DailyMealRepository dailyMealRepository) {
        this.dailyMealRepository = dailyMealRepository;
    }

    @GetMapping
    public List<DailyMeal> getAllMeals() {
        return dailyMealRepository.findAll();
    }

    @GetMapping("/date/{date}")
    public List<DailyMeal> getMealsByDate(@PathVariable LocalDate date) {
        return dailyMealRepository.findByDate(date);
    }

    @PostMapping
    public DailyMeal createMeal(@RequestBody DailyMeal meal) {
        for (FoodItem food : meal.getFoods()) {
            food.setDailyMeal(meal);
        }

        return dailyMealRepository.save(meal);
    }
}
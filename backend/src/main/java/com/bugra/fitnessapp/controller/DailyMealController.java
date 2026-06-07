package com.bugra.fitnessapp.controller;

import com.bugra.fitnessapp.entity.AppUser;
import com.bugra.fitnessapp.entity.DailyMeal;
import com.bugra.fitnessapp.entity.FoodItem;
import com.bugra.fitnessapp.repository.AppUserRepository;
import com.bugra.fitnessapp.repository.DailyMealRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meals")
public class DailyMealController {

    private final DailyMealRepository dailyMealRepository;
    private final AppUserRepository appUserRepository;

    public DailyMealController(DailyMealRepository dailyMealRepository, AppUserRepository appUserRepository) {
        this.dailyMealRepository = dailyMealRepository;
        this.appUserRepository = appUserRepository;
    }

    @GetMapping
    public List<DailyMeal> getAllMeals(@AuthenticationPrincipal UserDetails userDetails) {
        AppUser user = appUserRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return dailyMealRepository.findByUser(user);
    }

    @PostMapping
    public DailyMeal createMeal(@RequestBody DailyMeal meal,
                                @AuthenticationPrincipal UserDetails userDetails) {
        AppUser user = appUserRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        meal.setUser(user);

        for (FoodItem food : meal.getFoods()) {
            food.setDailyMeal(meal);
        }

        return dailyMealRepository.save(meal);
    }

    @DeleteMapping("/{id}")
    public void deleteMeal(@PathVariable Long id,
                           @AuthenticationPrincipal UserDetails userDetails) {
        AppUser user = appUserRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        DailyMeal meal = dailyMealRepository.findById(id).orElseThrow();
        if (meal.getUser().getId().equals(user.getId())) {
            dailyMealRepository.deleteById(id);
        }
    }
}
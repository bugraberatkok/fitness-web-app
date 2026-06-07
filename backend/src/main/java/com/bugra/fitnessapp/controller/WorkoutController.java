package com.bugra.fitnessapp.controller;

import com.bugra.fitnessapp.entity.AppUser;
import com.bugra.fitnessapp.entity.ExerciseEntry;
import com.bugra.fitnessapp.entity.Workout;
import com.bugra.fitnessapp.repository.AppUserRepository;
import com.bugra.fitnessapp.repository.WorkoutRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    private final WorkoutRepository workoutRepository;
    private final AppUserRepository appUserRepository;

    public WorkoutController(WorkoutRepository workoutRepository, AppUserRepository appUserRepository) {
        this.workoutRepository = workoutRepository;
        this.appUserRepository = appUserRepository;
    }

    // @AuthenticationPrincipal → JWT token'dan gelen kullanıcı bilgisini otomatik inject eder
    // Artık tüm workoutlar hem filtreleniyor (sadece bu kullanıcınınkiler) hem de kullanıcıya bağlanıyor

    @GetMapping
    public List<Workout> getAllWorkouts(@AuthenticationPrincipal UserDetails userDetails) {
        AppUser user = appUserRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return workoutRepository.findByUser(user);
    }

    @PostMapping
    public Workout createWorkout(@RequestBody Workout workout,
                                 @AuthenticationPrincipal UserDetails userDetails) {
        AppUser user = appUserRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        workout.setUser(user); // workout'u bu kullanıcıya bağla

        for (ExerciseEntry exercise : workout.getExercises()) {
            exercise.setWorkout(workout);
        }

        return workoutRepository.save(workout);
    }

    @DeleteMapping("/{id}")
    public void deleteWorkout(@PathVariable Long id,
                              @AuthenticationPrincipal UserDetails userDetails) {
        AppUser user = appUserRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        // Güvenlik: sadece kendi workout'unu silebilir
        Workout workout = workoutRepository.findById(id).orElseThrow();
        if (workout.getUser().getId().equals(user.getId())) {
            workoutRepository.deleteById(id);
        }
    }
}
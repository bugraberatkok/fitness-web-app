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

import com.bugra.fitnessapp.entity.ExerciseEntry;
import com.bugra.fitnessapp.entity.Workout;
import com.bugra.fitnessapp.repository.WorkoutRepository;

@RestController
@RequestMapping("/api/workouts")
@CrossOrigin(origins = "http://localhost:5173")
public class WorkoutController {

    private final WorkoutRepository workoutRepository;

    public WorkoutController(WorkoutRepository workoutRepository) {
        this.workoutRepository = workoutRepository;
    }

    @GetMapping
    public List<Workout> getAllWorkouts() {
        return workoutRepository.findAll();
    }

    @GetMapping("/date/{date}")
    public List<Workout> getWorkoutsByDate(@PathVariable LocalDate date) {
        return workoutRepository.findByDate(date);
    }

    @PostMapping
    public Workout createWorkout(@RequestBody Workout workout) {
        for (ExerciseEntry exercise : workout.getExercises()) {
            exercise.setWorkout(workout);
        }

        return workoutRepository.save(workout);
    }
}
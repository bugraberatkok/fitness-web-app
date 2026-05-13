package com.bugra.fitnessapp.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bugra.fitnessapp.entity.Workout;

public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    List<Workout> findByDate(LocalDate date);
}
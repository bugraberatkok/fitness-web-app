package com.bugra.fitnessapp.repository;

import com.bugra.fitnessapp.entity.AppUser;
import com.bugra.fitnessapp.entity.Workout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    List<Workout> findByUser(AppUser user);
}
import { useEffect, useState } from "react";


function WorkoutsPage() {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const todayIndex = new Date().getDay();
  const convertedTodayIndex = todayIndex === 0 ? 6 : todayIndex - 1;

  const [selectedDay, setSelectedDay] = useState(days[convertedTodayIndex]);

  const [workoutName, setWorkoutName] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");

  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weightKg, setWeightKg] = useState("");

  const [exercises, setExercises] = useState([]);

  const [workouts, setWorkouts] = useState([]);

  function getDateForSelectedDay() {
    const today = new Date();
    const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
    const selectedDayIndex = days.indexOf(selectedDay);

    const difference = selectedDayIndex - currentDayIndex;

    const selectedDate = new Date(today);
    selectedDate.setDate(today.getDate() + difference);

    return selectedDate.toISOString().split("T")[0];
  }

  async function fetchWorkouts() {
  const response = await fetch("http://localhost:8080/api/workouts");
  const data = await response.json();
  setWorkouts(data);
}

useEffect(() => {
  fetchWorkouts();
}, []);

  function addExercise() {
  if (!exerciseName || !sets || !reps || !weightKg) {
    alert("Please fill all exercise fields.");
    return;
  }

  if (Number(sets) <= 0 || Number(reps) <= 0 || Number(weightKg) < 0) {
    alert("Sets and reps must be greater than 0. Weight cannot be negative.");
    return;
  }

  const newExercise = {
    name: exerciseName,
    sets: Number(sets),
    reps: Number(reps),
    weightKg: Number(weightKg),
  };

  setExercises([...exercises, newExercise]);

  setExerciseName("");
  setSets("");
  setReps("");
  setWeightKg("");
}

  async function handleAddWorkout() {

    if (!workoutName || !durationMinutes || exercises.length === 0) {
    alert("Please enter workout name, duration, and at least one exercise.");
    return;
  }


      const workoutData = {
      date: getDateForSelectedDay(),
      name: workoutName,
      durationMinutes: Number(durationMinutes),
      exercises: exercises,
    };

    const response = await fetch("http://localhost:8080/api/workouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workoutData),
    });

    const savedWorkout = await response.json();
    console.log(savedWorkout);
    fetchWorkouts();
    setWorkoutName("");
    setDurationMinutes("");
    setExercises([]);
  }

  async function deleteWorkout(id) {
  await fetch(`http://localhost:8080/api/workouts/${id}`, {
    method: "DELETE",
  });

  fetchWorkouts();
}

  return (
    <div>
      <h1>Workouts Page</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              padding: "10px",
              backgroundColor: selectedDay === day ? "orange" : "white",
            }}
          >
            {day}
          </button>
        ))}
      </div>

      <h2>Selected Day: {selectedDay}</h2>
      <p>Date: {getDateForSelectedDay()}</p>

      <h2>Add Workout</h2>

      <input
        type="text"
        placeholder="Workout Name"
        value={workoutName}
        onChange={(e) => setWorkoutName(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Duration Minutes"
        value={durationMinutes}
        onChange={(e) => setDurationMinutes(e.target.value)}
      />

      <h3>Add Exercise</h3>

      <input
        type="text"
        placeholder="Exercise Name"
        value={exerciseName}
        onChange={(e) => setExerciseName(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Sets"
        value={sets}
        onChange={(e) => setSets(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Reps"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Weight KG"
        value={weightKg}
        onChange={(e) => setWeightKg(e.target.value)}
      />

      <br /><br />

      <button onClick={addExercise}>Add Exercise</button>

      <h3>Exercises to Add</h3>

      {exercises.map((exercise, index) => (
        <div key={index}>
          {exercise.name} - {exercise.sets} sets x {exercise.reps} reps -{" "}
          {exercise.weightKg} kg
        </div>
      ))}

      <br />

      <button onClick={handleAddWorkout}>Add Workout</button>

      <h2>Saved Workouts</h2>

{workouts.map((workout) => (
  <div
    key={workout.id}
    style={{
      border: "1px solid gray",
      padding: "10px",
      marginBottom: "10px",
    }}
  >
    <h3>{workout.name}</h3>
    <p>Date: {workout.date}</p>
    <p>Duration: {workout.durationMinutes} minutes</p>

    {workout.exercises.map((exercise) => (
      <div key={exercise.id}>
        {exercise.name} - {exercise.sets} sets x {exercise.reps} reps -{" "}
        {exercise.weightKg} kg
      </div>
    ))}
    <br></br>
    <button onClick={() => deleteWorkout(workout.id)}>
  Delete Workout
</button>
  </div>
))}


    </div>
  );
}

export default WorkoutsPage;
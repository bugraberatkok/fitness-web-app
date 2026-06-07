import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Plus, Trash2, Dumbbell, CalendarDays, CheckCircle2 } from "lucide-react";

function WorkoutsPage() {
  const { token } = useAuth(); // JWT token'ı al
  
  const days = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];
  const trDays = {
    "Monday": "Pzt", "Tuesday": "Sal", "Wednesday": "Çar", "Thursday": "Per", "Friday": "Cum", "Saturday": "Cmt", "Sunday": "Paz"
  };

  const [date, setDate] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [exercises, setExercises] = useState([]);

  // Geçici form state'i
  const [currentExName, setCurrentExName] = useState("");
  const [currentSets, setCurrentSets] = useState("");
  const [currentReps, setCurrentReps] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");

  const [workouts, setWorkouts] = useState([]);

  async function fetchWorkouts() {
    const response = await fetch("http://localhost:8080/api/workouts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setWorkouts(data);
  }

  useEffect(() => {
    if (token) fetchWorkouts();
  }, [token]);

  function handleAddExercise() {
    if (!currentExName || !currentSets || !currentReps || !currentWeight) return;
    setExercises([
      ...exercises,
      {
        name: currentExName,
        sets: parseInt(currentSets),
        reps: parseInt(currentReps),
        weightKg: parseFloat(currentWeight),
      },
    ]);
    setCurrentExName("");
    setCurrentSets("");
    setCurrentReps("");
    setCurrentWeight("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (exercises.length === 0 || !date) return;

    const workoutData = {
      date: date,
      name: "Antrenman",
      durationMinutes: 45,
      exercises: exercises,
    };

    await fetch("http://localhost:8080/api/workouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(workoutData),
    });

    setDate("");
    setExercises([]);
    fetchWorkouts();
  }

  async function deleteWorkout(id) {
    await fetch(`http://localhost:8080/api/workouts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchWorkouts();
  }

  // Hangi günlerde idman var?
  const workedOutDays = [...new Set(workouts.map(w => new Date(w.date).toLocaleDateString("en-US", { weekday: 'long' })))];
  const currentDayName = new Date().toLocaleDateString("en-US", { weekday: 'long' });

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Antrenman Programım</h1>
        <p className="page-subtitle">Ağırlıkları artır, sınırları zorla, gelişimi hisset.</p>

        {/* WEEK GRID OVERVIEW */}
        <div className="card fade-in-2" style={{ marginTop: "20px", padding: "16px" }}>
          <div className="section-hd" style={{ marginBottom: "0" }}>
            <div className="section-hd-title" style={{ fontSize: "13px" }}><CalendarDays size={14} style={{ verticalAlign: "middle", marginRight: "6px" }} /> Haftalık Görünüm</div>
          </div>
          <div className="week-grid">
            {days.map(d => {
              const isDone = workedOutDays.includes(d);
              const isToday = currentDayName === d;
              return (
                <div key={d} className="week-day">
                  <div className={`week-day-bar ${isDone ? 'done' : 'empty'} ${isToday ? 'today' : ''}`} style={isToday ? { border: '2px solid var(--green-400)' } : {}}>
                    {isDone && <CheckCircle2 size={14} />}
                  </div>
                  <div className="week-day-lbl" style={isToday ? { color: 'var(--green-400)', fontWeight: 'bold' } : {}}>{trDays[d]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* FORM BÖLÜMÜ */}
        <div className="fade-in-2">
          <div className="form-section">
            <h2 className="section-hd-title" style={{ marginBottom: "20px" }}>
              <Plus size={18} style={{ verticalAlign: "middle", marginRight: "8px", color: "var(--lime-400)" }} />
              Yeni Antrenman
            </h2>

            <form onSubmit={handleSubmit} className="form-grid">
              
              <div className="form-group full" style={{ display: 'none' }}>
                <label className="form-label">Antrenman Günü</label>
                <div className="day-selector">
                  {days.map(d => (
                    <button
                      key={d} type="button"
                      className={`day-btn ${dayOfWeek === d ? 'active' : ''}`}
                      onClick={() => setDayOfWeek(d)}
                    >
                      {trDays[d]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group full">
                <label className="form-label">Tarih</label>
                <input
                  type="date"
                  className="form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group full" style={{ borderTop: "1px solid var(--border-sub)", paddingTop: "15px", marginTop: "5px" }}>
                <label className="form-label">Hareket Ekle</label>
                <div className="form-grid g2" style={{ marginBottom: "10px" }}>
                  <div className="form-group full">
                    <input
                      type="text" className="form-input" placeholder="Hareket (Bench Press)"
                      value={currentExName} onChange={(e) => setCurrentExName(e.target.value)}
                    />
                  </div>
                  <input
                    type="number" className="form-input" placeholder="Set"
                    value={currentSets} onChange={(e) => setCurrentSets(e.target.value)}
                  />
                  <input
                    type="number" className="form-input" placeholder="Tekrar"
                    value={currentReps} onChange={(e) => setCurrentReps(e.target.value)}
                  />
                  <input
                    type="number" step="0.5" className="form-input" placeholder="KG"
                    value={currentWeight} onChange={(e) => setCurrentWeight(e.target.value)}
                  />
                  <button type="button" onClick={handleAddExercise} className="btn btn-secondary">Ekle</button>
                </div>
              </div>

              {exercises.length > 0 && (
                <div className="form-group full">
                  <div className="staged-list">
                    {exercises.map((ex, i) => (
                      <div key={i} className="staged-item">
                        <span className="staged-name">{ex.name}</span>
                        <span className="staged-det">{ex.sets}x{ex.reps} • {ex.weightKg}kg</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-group full" style={{ marginTop: "10px" }}>
                <button type="submit" className="btn btn-primary" style={{ width: "100%", background: "linear-gradient(135deg, var(--lime-400), var(--green-600))", color: "#000" }}>
                  Antrenmanı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* LİSTE BÖLÜMÜ */}
        <div className="fade-in-3" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {workouts.length === 0 ? (
            <div className="empty-state">
              <Dumbbell className="empty-icon" />
              <div className="empty-text">Henüz kaydedilmiş bir antrenman bulunmuyor.</div>
            </div>
          ) : (
            workouts.map((workout) => (
              <div key={workout.id} className="workout-card">
                <div className="workout-card-hd">
                  <div>
                    <h3 className="workout-name">{trDays[new Date(workout.date).toLocaleDateString("en-US", { weekday: 'long' })]} Antrenmanı</h3>
                    <div className="workout-badges">
                      <div className="w-badge"><CalendarDays size={12}/> {workout.date}</div>
                      <div className="w-badge" style={{ color: "var(--lime-400)" }}><Dumbbell size={12}/> {workout.exercises.length} Hareket</div>
                    </div>
                  </div>
                  <button onClick={() => deleteWorkout(workout.id)} className="btn btn-danger">
                    <Trash2 size={14} />
                  </button>
                </div>
                
                <div className="ex-list">
                  {workout.exercises.map((ex) => (
                    <div key={ex.id} className="ex-row">
                      <span className="ex-name">{ex.name}</span>
                      <span className="ex-detail">{ex.sets} set × {ex.reps} tekrar <span style={{ color: "var(--text-primary)", fontWeight: 600, marginLeft: "6px" }}>{ex.weightKg} kg</span></span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkoutsPage;
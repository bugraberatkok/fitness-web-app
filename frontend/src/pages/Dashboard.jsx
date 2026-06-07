import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Activity, Flame, Utensils, Trophy, TrendingUp, Dumbbell } from "lucide-react";

function Dashboard() {
  const { token, username } = useAuth();
  const [meals, setMeals] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bugünün tarihi (YYYY-MM-DD)
  const todayDateStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    async function fetchData() {
      try {
        const [mealsRes, workoutsRes] = await Promise.all([
          fetch("http://localhost:8080/api/meals", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:8080/api/workouts", { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        if (mealsRes.ok) setMeals(await mealsRes.json());
        if (workoutsRes.ok) setWorkouts(await workoutsRes.json());
      } catch (err) {
        console.error("Dashboard veri çekme hatası", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  // Bugünün istatistiklerini hesapla
  const todaysMeals = meals.filter(m => m.date === todayDateStr);
  const todaysWorkouts = workouts.filter(w => w.date === todayDateStr);

  const totalCaloriesIn = todaysMeals.reduce((acc, meal) => {
    return acc + meal.foods.reduce((sum, food) => sum + food.calories, 0);
  }, 0);

  const totalCaloriesOut = todaysWorkouts.reduce((acc, workout) => {
    // Tahmini: her set * rep için ortalama kalori veya sadece egzersiz sayısı üzerinden basit bir hesap
    return acc + workout.exercises.reduce((sum, ex) => sum + (ex.sets * ex.reps * 2.5), 0);
  }, 0);

  const totalWorkoutTime = todaysWorkouts.length * 45; // Her workout ortalama 45 dk varsayımı

  const DAILY_CALORIE_GOAL = 2500;
  const progressPercent = Math.min((totalCaloriesIn / DAILY_CALORIE_GOAL) * 100, 100);

  // En son aktiviteler (tarihe göre tersten, son 4)
  const recentActivities = [
    ...meals.map(m => ({ ...m, type: 'meal', ts: new Date(m.date).getTime() })),
    ...workouts.map(w => ({ ...w, type: 'workout', ts: new Date(w.date).getTime() }))
  ].sort((a, b) => b.ts - a.ts).slice(0, 4);

  if (loading) return <div style={{ padding: "40px", color: "var(--text-muted)" }}>Yükleniyor...</div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Hoş Geldin, {username}!</h1>
        <p className="page-subtitle">İşte bugünün özeti. Hedeflerine emin adımlarla ilerliyorsun.</p>
      </div>

      {/* STATS GRID */}
      <div className="stats-grid fade-in-2">
        <div className="stat-card">
          <div className="stat-icon" style={{ color: "var(--green-400)" }}><Flame size={26} /></div>
          <div className="stat-value">{totalCaloriesOut.toFixed(0)} <span>kcal</span></div>
          <div className="stat-label">Yakılan Kalori</div>
          <div className="stat-trend">Aktif bir gün!</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: "#fbbf24" }}><Utensils size={26} /></div>
          <div className="stat-value">{totalCaloriesIn} <span>kcal</span></div>
          <div className="stat-label">Alınan Kalori</div>
          <div className="stat-trend" style={{ color: totalCaloriesIn > DAILY_CALORIE_GOAL ? '#ef4444' : 'var(--text-muted)' }}>
            Hedef: {DAILY_CALORIE_GOAL}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: "#60a5fa" }}><Activity size={26} /></div>
          <div className="stat-value">{totalWorkoutTime} <span>dk</span></div>
          <div className="stat-label">Antrenman Süresi</div>
          <div className="stat-trend" style={{ color: 'var(--text-muted)' }}>Bugün {todaysWorkouts.length} antrenman</div>
        </div>
      </div>

      <div className="dashboard-grid fade-in-3">
        {/* CALORIE RING CARD */}
        <div className="card">
          <div className="card-title">
            <Trophy size={18} color="var(--green-400)" /> Günlük İlerleme
          </div>
          <div className="calorie-ring-wrap">
            <div className="ring-svg-wrap">
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="60" fill="none" stroke="var(--bg-elevated)" strokeWidth="12" />
                <circle cx="70" cy="70" r="60" fill="none" 
                  stroke="url(#grad1)" strokeWidth="12" 
                  strokeDasharray="377" 
                  strokeDashoffset={377 - (377 * progressPercent) / 100}
                  strokeLinecap="round" 
                  transform="rotate(-90 70 70)"
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--green-500)" />
                    <stop offset="100%" stopColor="var(--lime-400)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="ring-center">
                <div className="ring-cal">{DAILY_CALORIE_GOAL - totalCaloriesIn > 0 ? DAILY_CALORIE_GOAL - totalCaloriesIn : 0}</div>
                <div className="ring-lbl">Kalan</div>
              </div>
            </div>
            
            <div className="ring-rows">
              <div className="ring-row">
                <div className="ring-row-lbl">
                  <div className="ring-dot" style={{ background: 'var(--green-400)' }}></div> Tüketilen
                </div>
                <div className="ring-row-val">{totalCaloriesIn} kcal</div>
              </div>
              <div className="ring-row">
                <div className="ring-row-lbl">
                  <div className="ring-dot" style={{ background: 'var(--bg-elevated)' }}></div> Hedef
                </div>
                <div className="ring-row-val">{DAILY_CALORIE_GOAL} kcal</div>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY CARD */}
        <div className="card">
          <div className="card-title">
            <TrendingUp size={18} color="var(--green-400)" /> Son Aktiviteler
          </div>
          
          {recentActivities.length === 0 ? (
            <div className="empty-state">
              <div className="empty-text">Henüz aktivite bulunmuyor.</div>
            </div>
          ) : (
            <div className="act-list">
              {recentActivities.map((act, i) => (
                <div className="act-item" key={`${act.type}-${act.id}-${i}`}>
                  <div className={`act-icon ${act.type}`}>
                    {act.type === 'meal' ? <Utensils size={16} color="var(--green-400)" /> : <Dumbbell size={16} color="var(--lime-400)" />}
                  </div>
                  <div className="act-info">
                    <div className="act-name">{act.type === 'meal' ? act.mealName : "Antrenman"}</div>
                    <div className="act-meta">
                      {act.type === 'meal' ? `${act.foods?.length || 0} besin • ${act.date}` : `${act.exercises?.length || 0} egzersiz • ${act.date}`}
                    </div>
                  </div>
                  <div className="act-val">
                    {act.type === 'meal' 
                      ? `+${act.foods.reduce((sum, f) => sum + f.calories, 0)}`
                      : `~${act.exercises.reduce((sum, ex) => sum + (ex.sets * ex.reps * 2.5), 0).toFixed(0)}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

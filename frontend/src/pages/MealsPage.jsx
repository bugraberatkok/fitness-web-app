import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Plus, Trash2, Utensils, Calendar } from "lucide-react";

function MealsPage() {
  const { token } = useAuth(); // JWT token'ı al
  const [mealName, setMealName] = useState("");
  const [date, setDate] = useState("");
  const [foods, setFoods] = useState([]);
  
  // Geçici form state'i (food eklemek için)
  const [currentFoodName, setCurrentFoodName] = useState("");
  const [currentCalories, setCurrentCalories] = useState("");

  const [meals, setMeals] = useState([]);

  async function fetchMeals() {
    const response = await fetch("http://localhost:8080/api/meals", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setMeals(data);
  }

  useEffect(() => {
    if (token) fetchMeals();
  }, [token]);

  function handleAddFood() {
    if (!currentFoodName || !currentCalories) return;
    setFoods([
      ...foods,
      { name: currentFoodName, calories: parseInt(currentCalories) },
    ]);
    setCurrentFoodName("");
    setCurrentCalories("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!mealName || foods.length === 0 || !date) return;

    const mealData = {
      mealName: mealName,
      date: date,
      foods: foods,
    };

    await fetch("http://localhost:8080/api/meals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(mealData),
    });

    setMealName("");
    setDate("");
    setFoods([]);
    fetchMeals();
  }

  async function deleteMeal(id) {
    await fetch(`http://localhost:8080/api/meals/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchMeals();
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Öğünlerim</h1>
        <p className="page-subtitle">Tükettiğin besinleri kaydet, makrolarını takip et.</p>
      </div>

      <div className="dashboard-grid">
        {/* FORM BÖLÜMÜ */}
        <div className="fade-in-2">
          <div className="form-section">
            <h2 className="section-hd-title" style={{ marginBottom: "20px" }}>
              <Plus size={18} style={{ verticalAlign: "middle", marginRight: "8px", color: "var(--green-400)" }} />
              Yeni Öğün Ekle
            </h2>
            
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-group full">
                <label className="form-label">Öğün Adı</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Örn: Sabah Kahvaltısı, Antrenman Sonrası"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  required
                />
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
                <label className="form-label">Besin Ekle</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Besin adı (Yulaf)"
                    value={currentFoodName}
                    onChange={(e) => setCurrentFoodName(e.target.value)}
                    style={{ flex: 2 }}
                  />
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Kcal"
                    value={currentCalories}
                    onChange={(e) => setCurrentCalories(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={handleAddFood} className="btn btn-secondary btn-sm" style={{ padding: "10px 14px", height: "42px" }}>
                    Ekle
                  </button>
                </div>
              </div>

              {foods.length > 0 && (
                <div className="form-group full">
                  <div className="staged-list">
                    {foods.map((f, i) => (
                      <div key={i} className="staged-item">
                        <span className="staged-name">{f.name}</span>
                        <span className="staged-det">{f.calories} kcal</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-group full" style={{ marginTop: "10px" }}>
                <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                  Öğünü Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* LİSTE BÖLÜMÜ */}
        <div className="fade-in-3" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {meals.length === 0 ? (
            <div className="empty-state">
              <Utensils className="empty-icon" />
              <div className="empty-text">Henüz kaydedilmiş bir öğün bulunmuyor.</div>
            </div>
          ) : (
            meals.map((meal) => {
              const totalCal = meal.foods.reduce((sum, f) => sum + f.calories, 0);
              return (
                <div key={meal.id} className="meal-card">
                  <div className="meal-card-hd">
                    <div>
                      <h3 className="meal-name">{meal.mealName || "İsimsiz Öğün"}</h3>
                      <div className="meal-date-tag" style={{ marginTop: "6px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <Calendar size={12} /> {meal.date}
                      </div>
                    </div>
                    <button onClick={() => deleteMeal(meal.id)} className="btn btn-danger">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  <div className="food-list">
                    {meal.foods.map((food) => (
                      <div key={food.id} className="food-row">
                        <span className="food-name">{food.name}</span>
                        <span className="food-cal">{food.calories} kcal</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="meal-total-row">
                    <span className="total-lbl">Toplam Kalori</span>
                    <span className="total-val">{totalCal} kcal</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default MealsPage;
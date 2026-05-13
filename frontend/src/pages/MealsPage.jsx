import { useEffect, useState } from "react";

function MealsPage() {
  const [mealName, setMealName] = useState("");
  const [date, setDate] = useState("");
  const [foods, setFoods] = useState([]);

  const [foodNameInput, setFoodNameInput] = useState("");
  const [caloriesInput, setCaloriesInput] = useState("");
  const [meals, setMeals] = useState([]);

  async function fetchMeals() {
    const response = await fetch("http://localhost:8080/api/meals");
    const data = await response.json();
    setMeals(data);
  }

  useEffect(() => {
    fetchMeals();
  }, []);

  function addFood() {
    if (!foodNameInput || !caloriesInput) {
      return;
    }

    const newFood = {
      name: foodNameInput,
      calories: Number(caloriesInput),
    };

    setFoods([...foods, newFood]);

    setFoodNameInput("");
    setCaloriesInput("");
  }

  async function handleAddMeal() {
    const mealData = {
      date: date,
      mealName: mealName,
      foods: foods,
    };

    const response = await fetch("http://localhost:8080/api/meals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mealData),
    });

    const savedMeal = await response.json();
    console.log(savedMeal);

    fetchMeals();

    setMealName("");
    setDate("");
    setFoods([]);
  }

  async function deleteMeal(id) {
  await fetch(`http://localhost:8080/api/meals/${id}`, {
    method: "DELETE",
  });

  fetchMeals();
}

  return (
    <div>
      <h1>Meals Page</h1>

      <h2>Add Meal</h2>

      <input
        type="text"
        placeholder="Meal Name"
        value={mealName}
        onChange={(e) => setMealName(e.target.value)}
      />

      <br /><br />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Food Name"
        value={foodNameInput}
        onChange={(e) => setFoodNameInput(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Calories"
        value={caloriesInput}
        onChange={(e) => setCaloriesInput(e.target.value)}
      />

      <br /><br />

      <button onClick={addFood}>Add Food</button>

      <br /><br />

      {foods.map((food, index) => (
        <div key={index}>
          {food.name} - {food.calories} kcal
        </div>
      ))}

      <br />

      <button onClick={handleAddMeal}>Add Meal</button>

      <br /><br />

      <h2>Meals</h2>

      {meals.map((meal) => (
        <div
          key={meal.id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{meal.mealName}</h3>

          <p>Date: {meal.date}</p>

          {meal.foods.map((food) => (
            <div key={food.id}>
              {food.name} - {food.calories} kcal
            </div>
          ))}

          

          <p>
            Total: {meal.foods.reduce((sum, food) => sum + food.calories, 0)} kcal
          </p>

            <button onClick={() => deleteMeal(meal.id)}>
  Delete Meal
</button>
        </div>
      ))}
    </div>
  );
}

export default MealsPage;
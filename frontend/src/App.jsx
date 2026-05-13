import { useState } from "react";

import MealsPage from "./pages/MealsPage";
import WorkoutsPage from "./pages/WorkoutsPage";

function App() {

  const [currentPage, setCurrentPage] = useState("meals");

  return (
    <div style={{ padding: "20px" }}>

      <button onClick={() => setCurrentPage("meals")}>
        Meals
      </button>

      <button onClick={() => setCurrentPage("workouts")}>
        Workouts
      </button>

      <hr />

      {currentPage === "meals" && <MealsPage />}

      {currentPage === "workouts" && <WorkoutsPage />}

    </div>
  );
}

export default App;
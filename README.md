# FitTrack - Fullstack Fitness & Nutrition Dashboard

A modern, responsive, and secure full-stack web application for tracking daily nutrition and workouts. Designed with a sleek glassmorphism UI, this application allows users to monitor their calorie intake, log their exercises, and stay on top of their fitness goals through a comprehensive dashboard.

![Dashboard Preview](https://via.placeholder.com/1000x500.png?text=Add+Your+Dashboard+Screenshot+Here)

## 🚀 Features

* **Secure Authentication:** JWT-based user registration and login system with encrypted passwords (Bcrypt).
* **Interactive Dashboard:** Dynamic daily overview with calorie goals, a visual progress ring, and a timeline of recent activities.
* **Nutrition Tracking:** Log daily meals, calculate total calories, and view history.
* **Workout Management:** Log exercise sets, reps, and weights. Weekly grid highlights workout days and tracks consistency.
* **Responsive Design:** A beautiful, custom CSS interface built with modern aesthetic principles (neon green accents, dark mode vibes, and glassmorphic cards).

## 💻 Tech Stack

### Frontend
* **React (Vite):** Fast and modern frontend framework.
* **Vanilla CSS:** Custom design system without relying on heavy UI libraries.
* **Lucide React:** Beautiful, consistent iconography.

### Backend
* **Java Spring Boot:** Robust REST API development.
* **Spring Security & JWT:** Stateless authentication and endpoint protection.
* **Spring Data JPA / Hibernate:** Object-relational mapping.
* **H2 Database (File-Based):** Zero-configuration, portable local database for seamless development and testing.

---

## 🛠️ Getting Started (Local Setup)

The project is configured to run effortlessly out-of-the-box thanks to the embedded H2 database. No external MySQL installation is required.

### Prerequisites
* **Java 21** or higher
* **Node.js** (v18+ recommended)
* **Maven** (or use the provided `mvnw` wrapper)

### 1. Running the Backend (Spring Boot)

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Start the Spring Boot server:
   ```bash
   mvn spring-boot:run
   ```
   *(The server will start on `http://localhost:8080`. The H2 database file will automatically be created in the `backend/data/` folder).*

### 2. Running the Frontend (React/Vite)

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *(The frontend will usually start on `http://localhost:5173`. Open this link in your browser).*

---

## 📂 Project Architecture

* `backend/`: Contains the Spring Boot application (Controllers, Entities, Repositories, Security Configurations).
* `frontend/`: Contains the React application (Pages, Contexts, Components, Assets).
* `backend/data/`: Auto-generated directory containing the local H2 database file (ignored in `.gitignore`).

## 👨‍💻 Developer

Developed by **[Your Name/Username]** - Open to backend/fullstack opportunities!

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import '../../styles/PlanDisplayPage.css';
import TraineeSidebar from '../../components/TraineeSidebar';
import TopNav from '../../components/TopNav';

const PlanDisplayPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Workout Schedule');

  // First check if we have state data
  if (!state) {
    navigate('/ai-plan');
    return null;
  }

  // Default user data (can be overridden by state)
  const userData = state?.userData || {
    weight: 70,
    height: 175,
    age: 30,
    gender: "male",
    fitnessGoal: "maintain",
    activityLevel: "moderate"
  };

  // AI Plan Generator
  const generateFitnessPlan = (data) => {
    // 1. Calculate BMI
    const heightInMeters = data.height / 100;
    const bmi = (data.weight / (heightInMeters * heightInMeters)).toFixed(1);
    let bmiCategory = "";
    if (bmi < 18.5) bmiCategory = "Underweight";
    else if (bmi < 25) bmiCategory = "Normal";
    else if (bmi < 30) bmiCategory = "Overweight";
    else bmiCategory = "Obese";

    // 2. Calculate Calories (Harris-Benedict)
    let bmr = data.gender === "male" 
      ? 88.362 + (13.397 * data.weight) + (4.799 * data.height) - (5.677 * data.age)
      : 447.593 + (9.247 * data.weight) + (3.098 * data.height) - (4.330 * data.age);

    const activityMultipliers = {
      sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9
    };
    let calories = Math.round(bmr * activityMultipliers[data.activityLevel]);

    // 3. Adjust for Goal
    if (data.fitnessGoal === "lose") calories -= 300;
    if (data.fitnessGoal === "gain") calories += 300;

    // 4. Macronutrients (40% protein, 30% carbs/fats)
    const protein = Math.round((calories * 0.4) / 4) + "g";
    const carbs = Math.round((calories * 0.3) / 4) + "g";
    const fats = Math.round((calories * 0.3) / 9) + "g";

    // 5. Generate Workouts
    const workoutPlan = {
      Monday: generateWorkout("strength", data.fitnessGoal),
      Tuesday: generateWorkout("cardio", data.fitnessGoal),
      Wednesday: generateWorkout("strength", data.fitnessGoal),
      Thursday: generateWorkout("rest", data.fitnessGoal),
      Friday: generateWorkout("hybrid", data.fitnessGoal),
      Saturday: generateWorkout("cardio", data.fitnessGoal),
      Sunday: generateWorkout("rest", data.fitnessGoal)
    };

    // 6. Meal Plan
    const mealPlan = [
      "Breakfast: 3 eggs + oatmeal + almonds",
      "Snack: Greek yogurt with berries",
      "Lunch: Grilled chicken + rice + veggies",
      "Snack: Protein shake + banana",
      "Dinner: Salmon + quinoa + asparagus"
    ];

    return {
      bmi, bmiCategory,
      nutritionPlan: { calories: `${calories} kcal`, macros: { protein, carbs, fats }, mealPlan },
      workoutPlan
    };
  };

  const generateWorkout = (type, goal) => {
    const exercises = {
      strength: [
        { name: "Squats", sets: 4, reps: 8 },
        { name: "Bench Press", sets: 4, reps: 8 },
        { name: "Rows", sets: 3, reps: 10 }
      ],
      cardio: [
        { name: "Running", duration: "30 mins" },
        { name: "Jump Rope", duration: "15 mins" }
      ],
      hybrid: [
        { name: "Burpees", sets: 3, reps: 15 },
        { name: "Kettlebell Swings", sets: 4, reps: 12 }
      ],
      rest: []
    };

    return {
      type: type === "strength" ? "Strength" 
            : type === "cardio" ? "Cardio" 
            : type === "hybrid" ? "HIIT" 
            : "Rest Day",
      exercises: exercises[type] || [],
      notes: goal === "gain" ? "Focus on heavy weights" 
            : goal === "lose" ? "Keep rest periods short" 
            : "Maintain consistency"
    };
  };

  // Generate the plan
  const plan = state?.plan || generateFitnessPlan(userData);

  if (!plan || !plan.workoutPlan || !plan.nutritionPlan) {
    return (
      <div className="trainee-dash">
        <div className="background-overlay"></div>
        <TraineeSidebar />
        <div className="main-content">
          <TopNav />
          <div className="content-container">
            <p>Loading plan or no plan available...</p>
            <button onClick={() => navigate('/ai-plan')}>Go Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="trainee-dash">
      <div className="background-overlay"></div>
      <TraineeSidebar />
      
      <div className="main-content">
        <TopNav />
        
        <div className="content-container">
          <button className="go-back-button" onClick={() => navigate('/ai-plan')}>
            <FaArrowLeft />
          </button>
          
          
          <div className="plandisplay-summary">
            <div className="plandisplaysummary-card">
              <h4>Body Metrics</h4>
              <p><strong>BMI:</strong> {plan.bmi} ({plan.bmiCategory})</p>
              <p><strong>Goal:</strong> {userData.fitnessGoal === 'lose' ? 'Fat Loss' : 
                                       userData.fitnessGoal === 'gain' ? 'Muscle Building' : 'Maintenance'}</p>
            </div>
            
            <div className="plandisplaysummary-card">
              <h4>Nutrition Targets</h4>
              <p><strong>Calories:</strong> {plan.nutritionPlan?.calories || 'Not specified'}</p>
              <p><strong>Protein:</strong> {plan.nutritionPlan?.macros?.protein || 'Not specified'}</p>
              <p><strong>Carbs:</strong> {plan.nutritionPlan?.macros?.carbs || 'Not specified'}</p>
              <p><strong>Fats:</strong> {plan.nutritionPlan?.macros?.fats || 'Not specified'}</p>
            </div>
          </div>
          
          <div className="plan-tabs">
            <button 
              className={`tab-btn ${activeTab === 'Workout Schedule' ? 'active' : ''}`}
              onClick={() => setActiveTab('Workout Schedule')}
            >
              Workout Schedule
            </button>
            <button 
              className={`tab-btn ${activeTab === 'Nutrition Plan' ? 'active' : ''}`}
              onClick={() => setActiveTab('Nutrition Plan')}
            >
              Nutrition Plan
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'Workout Schedule' && (
              <div className="workout-plan">
                <div className="workout-grid">
                  {Object.entries(plan.workoutPlan || {}).map(([day, workoutData = {}]) => (
                    <div key={day} className={`workout-card ${(workoutData.type || 'rest').toLowerCase().replace(' ', '-')}`}>
                      <h3>{day}</h3>
                      <p className="workout-type">{workoutData.type || 'Rest Day'}</p>
                      <ul className="exercise-list">
                        {(workoutData.exercises || []).map((ex = {}, i) => (
                          <li key={i}>
                            {ex.name || 'Exercise'}
                            {ex.sets && ` • ${ex.sets} sets`}
                            {ex.reps && ` × ${ex.reps} reps`}
                            {ex.duration && ` • ${ex.duration}`}
                          </li>
                        ))}
                      </ul>
                      {workoutData.notes && <p className="notes">{workoutData.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'Nutrition Plan' && (
              <div className="nutrition-plan">
                <div className="meal-plan">
                  <h3>Daily Meals</h3>
                  <ul>
                    {(plan.nutritionPlan?.mealPlan || []).map((meal, i) => (
                      <li key={i}>
                        <span className="meal-time">{meal.split(':')[0]}:</span>
                        <span className="meal-content">{meal.split(':').slice(1).join(':').trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="print-button" onClick={() => window.print()}>
                  Print Plan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDisplayPage;
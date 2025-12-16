import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/AIplan.css';
import TraineeSidebar from '../../components/TraineeSidebar';
import TopNav from '../../components/TopNav';
import { FaArrowLeft } from 'react-icons/fa';

const AIplan = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('maintain');
  const navigate = useNavigate();

  const generatePlan = () => {
    if (!weight || !height) {
      alert('Please enter weight and height');
      return;
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const bmi = weightNum / ((heightNum / 100) ** 2);

    let workoutPlan = {};
    let nutritionPlan = {};

    // Workout plans based on BMI and fitness goal
    if (bmi < 18.5) {
      workoutPlan = {
        Monday: {
          type: 'Cardio',
          exercises: [
            { name: 'Running', duration: '30 mins', intensity: 'Moderate' },
            { name: 'Cycling', duration: '30 mins', intensity: 'Moderate' }
          ],
          notes: 'Focus on endurance building'
        },
        Tuesday: {
          type: 'Strength Training',
          exercises: [
            { name: 'Squats', sets: 3, reps: 12, weight: 'Moderate' },
            { name: 'Deadlifts', sets: 3, reps: 12, weight: 'Moderate' }
          ],
          notes: 'Focus on compound movements'
        },
        Wednesday: { type: 'Rest', notes: 'Active recovery recommended' },
        Thursday: {
          type: 'HIIT',
          exercises: [
            { name: 'Burpees', duration: '20 mins', intervals: '30s work/30s rest' },
            { name: 'Jump Squats', duration: '20 mins', intervals: '30s work/30s rest' }
          ],
          notes: 'High intensity interval training'
        },
        Friday: {
          type: 'Strength Training',
          exercises: [
            { name: 'Bench Press', sets: 3, reps: 10, weight: 'Moderate' },
            { name: 'Pull-Ups', sets: 3, reps: 'Max', notes: 'Use bands if needed' }
          ],
          notes: 'Upper body focus'
        },
        Saturday: {
          type: 'Yoga',
          exercises: [
            { name: 'Sun Salutations', duration: '20 mins' },
            { name: 'Plank', duration: '1 min hold' }
          ],
          notes: 'Focus on flexibility and core'
        },
        Sunday: { type: 'Rest', notes: 'Full recovery day' }
      };

      nutritionPlan = {
        goal: 'Weight Gain',
        calories: `${weightNum * 35 + 300} kcal/day`,
        macros: {
          protein: `${weightNum * 2.2}g`,
          carbs: `${weightNum * 5}g`,
          fats: `${weightNum * 1}g`
        },
        mealPlan: [
          'Breakfast: Oatmeal with peanut butter, banana, and protein shake',
          'Snack: Greek yogurt with nuts and honey',
          'Lunch: Grilled chicken with rice and vegetables',
          'Snack: Cottage cheese with fruit',
          'Dinner: Salmon with sweet potatoes and avocado',
          'Before bed: Casein protein shake'
        ]
      };
    } else if (bmi >= 18.5 && bmi < 24.9) {
      workoutPlan = {
        Monday: {
          type: 'Cardio',
          exercises: [
            { name: 'Running', duration: '30 mins', intensity: 'Moderate' },
            { name: 'Cycling', duration: '30 mins', intensity: 'Moderate' }
          ],
          notes: 'Maintain cardiovascular health'
        },
        Tuesday: {
          type: 'Strength Training',
          exercises: [
            { name: 'Squats', sets: 3, reps: 12, weight: 'Moderate-Heavy' },
            { name: 'Deadlifts', sets: 3, reps: 12, weight: 'Moderate-Heavy' }
          ],
          notes: 'Focus on progressive overload'
        },
        Wednesday: { type: 'Rest', notes: 'Active recovery recommended' },
        Thursday: {
          type: 'HIIT',
          exercises: [
            { name: 'Burpees', duration: '20 mins', intervals: '30s work/30s rest' },
            { name: 'Jump Squats', duration: '20 mins', intervals: '30s work/30s rest' }
          ],
          notes: 'Maintain intensity'
        },
        Friday: {
          type: 'Strength Training',
          exercises: [
            { name: 'Bench Press', sets: 3, reps: 10, weight: 'Moderate-Heavy' },
            { name: 'Pull-Ups', sets: 3, reps: 'Max', notes: 'Add weight if possible' }
          ],
          notes: 'Upper body focus'
        },
        Saturday: {
          type: 'Yoga',
          exercises: [
            { name: 'Sun Salutations', duration: '20 mins' },
            { name: 'Plank', duration: '1 min hold' }
          ],
          notes: 'Maintain flexibility'
        },
        Sunday: { type: 'Rest', notes: 'Full recovery day' }
      };

      nutritionPlan = {
        goal: 'Maintenance',
        calories: `${weightNum * 30} kcal/day`,
        macros: {
          protein: `${weightNum * 1.8}g`,
          carbs: `${weightNum * 4}g`,
          fats: `${weightNum * 0.8}g`
        },
        mealPlan: [
          'Breakfast: Scrambled eggs with whole grain toast and avocado',
          'Snack: Protein bar or fruit with nuts',
          'Lunch: Grilled chicken salad with quinoa',
          'Snack: Greek yogurt with berries',
          'Dinner: Lean beef with roasted vegetables',
          'Before bed: Cottage cheese'
        ]
      };
    } else {
      workoutPlan = {
        Monday: {
          type: 'Cardio',
          exercises: [
            { name: 'Running', duration: '30 mins', intensity: 'Moderate-High' },
            { name: 'Cycling', duration: '30 mins', intensity: 'Moderate-High' }
          ],
          notes: 'Focus on fat burning'
        },
        Tuesday: {
          type: 'Strength Training',
          exercises: [
            { name: 'Squats', sets: 3, reps: 12, weight: 'Moderate' },
            { name: 'Deadlifts', sets: 3, reps: 12, weight: 'Moderate' }
          ],
          notes: 'Maintain muscle while losing fat'
        },
        Wednesday: { type: 'Rest', notes: 'Active recovery recommended' },
        Thursday: {
          type: 'HIIT',
          exercises: [
            { name: 'Burpees', duration: '20 mins', intervals: '30s work/30s rest' },
            { name: 'Jump Squats', duration: '20 mins', intervals: '30s work/30s rest' }
          ],
          notes: 'Maximize calorie burn'
        },
        Friday: {
          type: 'Strength Training',
          exercises: [
            { name: 'Bench Press', sets: 3, reps: 10, weight: 'Moderate' },
            { name: 'Pull-Ups', sets: 3, reps: 'Max', notes: 'Focus on form' }
          ],
          notes: 'Upper body focus'
        },
        Saturday: {
          type: 'Yoga',
          exercises: [
            { name: 'Sun Salutations', duration: '20 mins' },
            { name: 'Plank', duration: '1 min hold' }
          ],
          notes: 'Improve mobility'
        },
        Sunday: { type: 'Rest', notes: 'Full recovery day' }
      };

      nutritionPlan = {
        goal: 'Weight Loss',
        calories: `${weightNum * 25 - 300} kcal/day`,
        macros: {
          protein: `${weightNum * 2}g`,
          carbs: `${weightNum * 3}g`,
          fats: `${weightNum * 0.6}g`
        },
        mealPlan: [
          'Breakfast: Protein smoothie with spinach and berries',
          'Snack: Handful of almonds',
          'Lunch: Grilled fish with steamed vegetables',
          'Snack: Celery with hummus',
          'Dinner: Turkey breast with roasted Brussels sprouts',
          'Before bed: Herbal tea'
        ]
      };
    }

    // Adjust based on fitness goal
    if (fitnessGoal === 'build') {
      nutritionPlan.calories = `${parseInt(nutritionPlan.calories) + 300} kcal/day`;
      nutritionPlan.macros.protein = `${weightNum * 2.2}g`;
      workoutPlan.notes = 'Increased volume for muscle growth';
    } else if (fitnessGoal === 'cut') {
      nutritionPlan.calories = `${parseInt(nutritionPlan.calories) - 300} kcal/day`;
      workoutPlan.notes = 'Increased cardio for fat loss';
    }

    const generatedPlan = {
      bmi: bmi.toFixed(2),
      bmiCategory: bmi < 18.5 ? 'Underweight' : bmi < 24.9 ? 'Normal' : 'Overweight',
      workoutPlan,
      nutritionPlan,
      fitnessGoal
    };

    // Navigate to the plan display page with the generated plan
    navigate('/plan-display', { state: { plan: generatedPlan } });
  };

  return (
    <div className="trainee-dash">
      <div className="background-overlay"></div>
      <TraineeSidebar />
      
      <div className="main-content">
        <TopNav />
        
        <div className="content-container">
          <button className="go-back-button" onClick={() => navigate('/trainee-dashboard')}>
            <FaArrowLeft />
          </button>
          
          <h1>AI Personalized Workout & Nutrition Plan</h1>
          
          <div className="input-section">
            <div className="input-row">
              <div className="input-group">
                <label>Weight (kg)</label>
                <input 
                  type="number" 
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Enter your weight"
                />
              </div>
              <div className="input-group">
                <label>Height (cm)</label>
                <input 
                  type="number" 
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Enter your height"
                />
              </div>
              <div className="input-group">
                <label>Fitness Goal</label>
                <select 
                  value={fitnessGoal} 
                  onChange={(e) => setFitnessGoal(e.target.value)}
                >
                  <option value="maintain">Maintain Weight</option>
                  <option value="build">Build Muscle</option>
                  <option value="cut">Lose Fat</option>
                </select>
              </div>
            </div>
            <button onClick={generatePlan}>Generate Plan</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIplan;
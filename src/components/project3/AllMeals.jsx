import React, { useEffect, useState, lazy, Suspense, useRef } from "react";
import { useAxios } from "./useAxios";
import { motion, useInView, useAnimation } from "framer-motion";
const FetchData = lazy(() => import("./fetchData"));

const AllMeals = ({ category, onGoBack }) => {
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
  const [selectedMeal, setSelectedMeal] = useState(null);
  const popupRef = useRef(null);
  const { data, loading, error } = useAxios(url);
  selectedMeal ? onGoBack(true) : onGoBack(false);

  const meals = data ? data.meals : [];

  useEffect(() => {
    if (!meals) return;
    console.log(meals);
  }, [meals]);

  if (loading) return <h2>Loading Meals for {category}...</h2>;
  if (error) return <div>Error: {error.massage}</div>;
  return (
    // <div className={"container"}>
    <div>
      <div className="meals-container">
        {meals.map((meal) => {
          return (
            <div className="meal" key={meal.idMeal}>
              <img
                src={meal["strMealThumb"]}
                onClick={() => {
                  setSelectedMeal(meal.idMeal);
                }}
                className="meals-images"
              />
              <h3>{meal["strMeal"]}</h3>
            </div>
          );
        })}
      </div>
      <div
        className={
          selectedMeal ? "selected-meal-popup active" : "selected-meal-popup"
        }
      >
        {selectedMeal && (
          <Suspense fallback={<h2>Loading Recipes...</h2>}>
            <FetchData
              scrollRootRef={popupRef}
              id={selectedMeal}
              onGoBack={() => setSelectedMeal(null)}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default AllMeals;

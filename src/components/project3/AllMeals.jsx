import React, { useEffect } from "react";
import { useAxios } from "./useAxios";

const AllMeals = ({ category }) => {
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
  const { data, loading, error } = useAxios(url);

  const meals = data ? data.meals : [];

  useEffect(() => {
    if (!meals) return;
    console.log(meals);
  }, [meals]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.massage}</div>;
  return (
    <div>
      {meals.map((meal) => {
        return (
          <div style={{ display: "flex", flexWrap: "wrap" }} key={meal.idMeal}>
            <img
              style={{ width: "100px", height: "100px" }}
              src={meal["strMealThumb"]}
            />
            <h3>{meal["strMeal"]}</h3>
          </div>
        );
      })}
    </div>
  );
};

export default AllMeals;

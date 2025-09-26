import React, { useEffect, useState } from "react";
import { useAxios } from "./useAxios";

const Project3 = () => {
  const url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772";
  const { data, loading, error } = useAxios(url);
  const [ingredients, setIngredients] = useState([]);
  const [measures, setMeasures] = useState([]);
  

  const meal = data ? data.meals[0] : null;

  useEffect(() => {
    if (!meal) return;
    const ingredientsList = [];
    const measuresList = [];
    Object.keys(meal).forEach((key) => {
      if (key.startsWith("strIngredient") && meal[key]) {
        ingredientsList.push(meal[key]);
      }
      if (key.startsWith("strMeasure") && meal[key]) {
        measuresList.push(meal[key]);
      }
    });

    setIngredients(ingredientsList);
    setMeasures(measuresList);

  }, [meal]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  console.log(ingredients);
  console.log(measures);

  return <div>Hi</div>;
};

export default Project3;

import React, { useEffect, useState } from "react";
import { useAxios } from "./useAxios";

const FetchData = ({ id }) => {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
  const { data, loading, error } = useAxios(url);
  const [meal, setMeal] = useState({});

  const fetchedData = data ? data.meals[0] : null;

  useEffect(() => {
    if (!fetchedData) return;
    console.log(fetchedData);

    const {
      idMeal,
      strMeal,
      strCategory,
      strMealThumb,
      strInstructions,
      strYoutube,
      strTags,
    } = fetchedData;

    const ingredientsList = [];
    const measuresList = [];

    for (let i = 1; i <= 20; i++) {
      const ingredient = fetchedData[`strIngredient${i}`];
      const measure = fetchedData[`strMeasure${i}`];

      if (ingredient && ingredient.trim()) {
        ingredientsList.push(ingredient);
        measuresList.push(measure.trim() ? measure : "");
      } else {
        break;
      }
    }

    // const tagsList = [];
    // Object.keys(fetchedData).forEach((key) => {
    //   if (key.startsWith("strIngredient") && fetchedData[key]) {
    //     ingredientsList.push(fetchedData[key]);
    //   }
    //   if (key.startsWith("strMeasure") && fetchedData[key]) {
    //     measuresList.push(fetchedData[key]);
    //   }
    // if (key === "strTags" && fetchedData["strTags"]) {
    //   tagsList.push(...fetchedData["strTags"].split(","));} ---> the one under is better and more efficient
    // });
    const tagsList = strTags
      ? strTags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];
    const meal = {
      mealId: idMeal,
      mealName: strMeal,
      category: strCategory,
      ingredients: ingredientsList,
      measurements: measuresList,
      thumbnail: strMealThumb,
      instructions: strInstructions,
      Youtube: strYoutube,
      tags: tagsList,
    };
    console.log(meal);

    setMeal(meal);
  }, [fetchedData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1 style={{ display: "inline" }}>{meal.mealName}</h1>
      <h1 style={{ display: "inline", marginLeft: "50px" }}>{meal.category}</h1>
      <h1>
        <img src={meal.thumbnail} alt={meal.mealName} />
      </h1>
    </div>
  );
};

export default FetchData;

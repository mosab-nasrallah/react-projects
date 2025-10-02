import React, { useEffect, useRef, useState } from "react";
import { useAxios } from "./useAxios";
// import { motion, useInView, useAnimation } from "motion/react-client";
import { motion, useInView, useAnimation } from "framer-motion";
import { div } from "motion/react-client";

const FetchData = ({ id, onGoBack }) => {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
  const { data, loading, error } = useAxios(url);
  const [meal, setMeal] = useState({});
  const mainControls = useAnimation();

  const fetchedData = data ? data.meals[0] : null;

  //TODO popup handling
  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, []);

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

  useEffect(() => {
    if (!Object.keys(meal).length > 0) return;
    console.log("Meal data loaded, starting animation.");
    mainControls.start("visible");
    console.log("Meal data loaded, done animation.");
  }, [meal, fetchedData]);

  if (loading) return <h2>Loading Recipes...</h2>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={onGoBack}>Back</button>

      <h1 style={{ display: "inline" }}>{meal.mealName}</h1>
      <h1 style={{ display: "inline", marginLeft: "50px" }}>{meal.category}</h1>
      <img src={meal.thumbnail} alt={meal.mealName} />
      <p>{meal.instructions}</p>

      <div>
        <div>
          {meal.ingredients && meal.ingredients.length > 0 ? (
            meal.ingredients.map((ingredient, index) => (
              <div className="ingredient" key={index}>
                <motion.div
                  initial="hidden"
                  variants={{
                    hidden: { opacity: 0, y: 75 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  animate={mainControls}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <span>{ingredient} </span>
                  <span>{meal.measurements[index]}</span>
                </motion.div>
              </div>
            ))
          ) : (
            <p>Ingredients list not available.</p>
          )}
        </div>
        <div>{meal.Youtube}</div>
        <div>
          {meal.tags && meal.tags.length > 0 ? (
            meal.tags.map((tag, index) => <div key={index}>{tag}</div>)
          ) : (
            <p>tags list not available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FetchData;

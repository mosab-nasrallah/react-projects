import React, { useEffect, useRef, useState } from "react";
import { useAxios } from "./useAxios";
import { motion, useInView, useAnimation } from "framer-motion";

const FetchData = ({ id, onGoBack }) => {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
  const { data, loading, error } = useAxios(url);
  const [meal, setMeal] = useState({});
  const mainControls = useAnimation();
  const [hoverClass, setHoverClass] = useState(null);
  const increaseSize = () => {
    const timer = setTimeout(() => {
      setHoverClass("hover");
    }, 2000);
    return timer;
  };
  const resetSize = (timer) => {
    setHoverClass(null);
    clearTimeout(timer);
  };
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
    const YTID = strYoutube ? strYoutube.split("=")[1] : "";
    // console.log(YTID);
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
      YoutubeId: YTID,
      // YoutubeThumbNail: `https://img.youtube.com/vi/${YoutubeId}/default.jpg`,
    };

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
    <div className="popup-content">
      <nav>
        <button onClick={onGoBack}> ← Back To Main Course</button>
        <h1>{meal.mealName}</h1>
        <h1 className="category-name">{meal.category}</h1>
      </nav>

      <img className="meal-image" src={meal.thumbnail} alt={meal.mealName} />
      <main>
        <header className="ingredients-header">Ingredients</header>
        <header className="measurements-header">Measurements</header>
        <div className="ingredients-container">
          {meal.ingredients && meal.ingredients.length > 0 ? (
            meal.ingredients.map((ingredient, index) => (
              <div className="ingredient" key={index}>
                <span>{ingredient} </span>
                <span>{meal.measurements[index]}</span>
              </div>
            ))
          ) : (
            <p>Ingredients list not available.</p>
          )}
        </div>
      </main>
      <p
        onMouseEnter={increaseSize}
        onMouseLeave={() => resetSize(increaseSize)}
        className={hoverClass ? `instructions ${hoverClass}` : `instructions`}
      >
        {meal.instructions}
      </p>
      <aside className="youtube-video">
        <a href={meal.Youtube}>
          <div>
            <img
              className="youtube-link"
              src={`https://img.youtube.com/vi/${meal.YoutubeId}/maxresdefault.jpg`}
            />
            <h1>▶</h1>
          </div>
        </a>
        {/* <div className="tags">
          {meal.tags && meal.tags.length > 0 ? (
            meal.tags.map((tag, index) => (
              <div className="tag" key={index}>
                {tag}
              </div>
            ))
          ) : (
            <p>tags list not available.</p>
          )}
        </div> */}
      </aside>
    </div>
  );
};

export default FetchData;

import React, { useEffect, useState } from "react";
import { useAxios } from "./useAxios";
import axios from "axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const { data, loading, error } = useAxios(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  const fetchedCategories = data ? data.categories : null;

  useEffect(() => {
    if (!fetchedCategories) return;

    const filteredCategories = fetchedCategories.filter(
      (category) => category["strCategory"].trim() !== "Pork"
    );

    setCategories(filteredCategories);
  }, [fetchedCategories]);

  useEffect(() => {
    const formatCategoriesWithCount = async () => {
      const promiseArray = categories.map(async (category) => {
        const {
          strCategory,
          strCategoryThumb,
          idCategory,
          strCategoryDescription,
        } = category;

        try {
          const response = await axios.get(
            `https://www.themealdb.com/api/json/v1/1/filter.php?c=${strCategory}`
          );
          const mealsList = response.data.meals;
          const count = mealsList ? mealsList.length : 0;
          return {
            idCategory: idCategory,
            categoryId: idCategory,
            category: strCategory,
            categoryThumb: strCategoryThumb,
            categoryDescription: strCategoryDescription,
            numberOfMeals: count,
          };
        } catch (error) {
          console.error(`error fetching data for ${strCategory}`);
          return {
            idCategory: idCategory,
            categoryId: idCategory,
            category: strCategory,
            categoryThumb: strCategoryThumb,
            categoryDescription: strCategoryDescription,
            numberOfMeals: 0,
          };
        }
      });
      const formattedCategories = await Promise.all(promiseArray);
      setCategories(formattedCategories);
    };
    if (categories && categories.length > 0 && !categories[0].numberOfMeals) {
      //(!categories[0].numberOfMeals) this line is wierd but long-story-short,
      //it prevent an infinate loop by checking if the categories has a numberOfMeals,
      //when the component first renders, he categories state is populated with initial data that does not yet have the numberOfMeals property
      //Therefore, categories[0].numberOfMeals is undefined, and !categories[0].numberOfMeals is True. The async function runs.

      formatCategoriesWithCount();
    }
  }, [categories]);

  if (loading) return <div>Loading ...</div>;
  if (error) return <div>Error: {error.message}</div>;
  console.log(categories);

  return (
    <div>
      {categories.map((c) => {
        return (
          <div key={c.idCategory}>
            <img src={c["categoryThumb"]} />
            <div>{c["numberOfMeals"]}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Categories;

import React, { useEffect, useState, lazy, Suspense } from "react";
import { useAxios } from "./useAxios";
import axios from "axios";
import "./style.css";
import AllMeals from "./AllMeals.jsx";
// import "./categoriesStyle.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Seafood");
  const [popUpOpen, setPopUpOpen] = useState(false);
  const { data, loading, error } = useAxios(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  const fetchedCategories = data ? data.categories : null;

  useEffect(() => {
    if (!fetchedCategories) return;
    const bannedCategories = ["Pork", "Goat"];

    const filteredCategories = fetchedCategories.filter((category) => {
      const categoryName = category["strCategory"].trim();
      return !bannedCategories.includes(categoryName);
    });

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
            idCategory: idCategory, //react is dumb so we need to keep 2 IDs for the key prop, or Im the dumb one and dont know how to get around the error that I got
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

  if (loading) {
    return <h2>Loading Categories ...</h2>;
  }
  if (error) return <div>Error: {error.message}</div>;
  console.log(categories);

  return (
    <div className={popUpOpen ? "master hide" : "master"}>
      <div className="categories-container">
        <h1 className="Categories-title Header">Explore Categories</h1>
        {categories.map((c) => {
          return (
            <div className="category" key={c.idCategory}>
              <img
                className="category-image"
                src={c["categoryThumb"]}
                onClick={() => {
                  setSelectedCategory(c["category"]);
                }}
              />
              <div style={{ textAlign: "center" }}>
                <span className="category-name">{c["category"]}</span>
                <div className="category-count">({c["numberOfMeals"]})</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="meals-view">
        <h1 className="Meals-Title  Header">Main Course Meals</h1>
        <Suspense fallback={<h2>Loading Meals for {selectedCategory}...</h2>}>
          <AllMeals
            category={selectedCategory}
            onGoBack={(data) => setPopUpOpen(data)}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default Categories;

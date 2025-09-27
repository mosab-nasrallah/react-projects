import React, { useEffect, useState } from "react";
import { useAxios } from "./useAxios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const { data, loading, error } = useAxios(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  const fetchedCategories = data ? data.categories : null;
  useEffect(() => {
    if (!fetchedCategories) return;
    setCategories(
      fetchedCategories.filter(
        (category) => category["strCategory"].trim() !== "Pork"
      )
    );
  }, [fetchedCategories]);
  console.log(categories);

  if (loading) return <div>Loading ...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {categories.map((c) => {
        // if (c["strCategory"].trim() === "Beef") {
        return <img key={c.idCategory} src={c["strCategoryThumb"]} />;
        // }
      })}
    </div>
  );
};

export default Categories;

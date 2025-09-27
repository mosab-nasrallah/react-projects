import React from "react";
import FetchData from "./fetchData";
import Categories from "./Categories";
import AllMeals from "./AllMeals";

const Project3 = () => {
  const id = 52772;
  const category = "Seafood";
  return (
    <div>
      {/* <FetchData id={id} /> */}
      {/* <Categories /> */}
      <AllMeals category={category} />
    </div>
  );
};

export default Project3;

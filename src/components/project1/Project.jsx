import React, { useState } from "react";
import "./project1.css";
const Project = () => {
  const [count, setCount] = useState(0);

  const handleDecrease = () => {
    setCount(count - 1);
  };
  const handleInecrease = () => {
    setCount(count + 1);
  };
  return (
    <div className="container">
      <div onClick={handleDecrease} className="counter before">
        {count - 1}
      </div>
      <div className="counter current">{count}</div>
      <div onClick={handleInecrease} className="counter next">
        {count + 1}
      </div>
      <div className="buttons-container">
        <button className="button add" onClick={handleInecrease}>
          Add
        </button>
        <button className="button delete" onClick={handleDecrease}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default Project;

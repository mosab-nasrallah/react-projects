import React, { useState } from "react";
import "../project2/todo.css";
const TodoList = () => {
  const timeOnly = "Time";
  const dateOnly = "Date";
  const all = "all";

  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [showTimeOrDate, setShowTimeOrDate] = useState(all);

  const handleDisplayTiming = (e) => {
    setShowTimeOrDate(e.target.value);
  };

  //   console.log(todos.indexOf("asd"));
  const done = {
    textDecoration: "line-through",
  };
  const hanldeInput = (e) => {
    const value = e.target.value;
    if (value.trim() !== "") {
      setInput(value);
    } else {
      setInput("");
    }
  };
  const addTodos = (e) => {
    e.preventDefault();
    const uniqueId = new Date().getTime();
    if (input && input.trim() !== "") {
      setTodos((todo) =>
        todo.concat({
          item: input,
          id: uniqueId,
          completed: false,
          timeAdded: getTimeAdded(),
        })
      );
      setInput("");
    }
  };

  const markAsDone = (id) => {
    setTodos((Prevtodos) => {
      return Prevtodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });
    });
  };
  const getTimeAdded = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");

    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const time = `${hours}:${minutes}:${seconds}`;
    const date = `${day}-${month}-${year}`;
    return { time, date };
  };

  const deleteTodo = (id) => {
    setTodos((todo) => todo.filter((d) => d.id !== id));
    // setTodos((todo) => todo.filter((d) => todos.indexOf(d) !== index));
  };

  return (
    <div className="container">
      <div className="settings">
        <input
          type="radio"
          value={all}
          name="Options"
          onChange={(e) => handleDisplayTiming(e)}
        />
        <label htmlFor="settings">All</label>
        <br />
        <input
          type="radio"
          value={timeOnly}
          name="Options"
          onChange={(e) => handleDisplayTiming(e)}
        />
        <label htmlFor="settings">Time Only</label>
        <br />
        <input
          type="radio"
          value={dateOnly}
          name="Options"
          onChange={(e) => handleDisplayTiming(e)}
        />
        <label htmlFor="settings">Date Only</label>
        <br />
      </div>
      <h1 className="title">TODO APP</h1>
      {/* <div className="progressive-blur top" /> */}
      <div className="todos">
        {/* <div className="sticky" /> */}

        {todos.map(({ item, id, completed, timeAdded }) => (
          <div key={id} className="todo">
            {showTimeOrDate === all ? (
              <div className="time-added">
                {timeAdded.date} - {timeAdded.time}
              </div>
            ) : showTimeOrDate === timeOnly ? (
              <div className="time-added">{timeAdded.time}</div>
            ) : (
              <div className="time-added">{timeAdded.date}</div>
            )}
            <div className="todo-item">
              <input
                type="checkbox"
                onChange={() => markAsDone(id)}
                checked={completed}
              />
              <h2 className={completed ? "done-text" : ""}>{item}</h2>
            </div>
            <button onClick={() => deleteTodo(id)} className="delete">
              X
            </button>
          </div>
        ))}
      </div>
      {/* <div className="progressive-blur bottom" /> */}
      <form onSubmit={addTodos}>
        <div className="inputArea">
          <input
            onChange={hanldeInput}
            className="input"
            type="text"
            value={input}
          />
          {/* <input type="submit" /> */}
          <button type="submit" className="add">
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoList;

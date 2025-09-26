# 🛑 React Rules of Hooks Violation Debugging Log 🛑

This document analyzes and resolves a complex **Rules of Hooks** violation encountered during the development of the recipe application.

## 📝 The Error: Changing Hook Order

The primary error occurred because the number of Hooks called changed between the initial component render (when loading) and subsequent renders (when data was available).

**Error Message:**

> `React has detected a change in the order of Hooks called by Project3. This will lead to bugs and errors if not fixed.`

|   #    | Previous Render (Loading) | Next Render (Data Ready) |
| :----: | :-----------------------: | :----------------------: |
|   1.   |        `useState`         |        `useState`        |
|   2.   |        `useState`         |        `useState`        |
|   3.   |        `useState`         |        `useState`        |
|   4.   |        `useEffect`        |       `useEffect`        |
|   5.   |        `useState`         |        `useState`        |
| **6.** |      **`undefined`**      |     **`useEffect`**      |

The component called **5 Hooks** on the first render, but **6 Hooks** on the second, violating the rule that Hooks must be called in the exact same order every time.

---

## 🔬 Root Cause: Conditional Hook Execution

The error stemmed from placing a conditional return _before_ the final `useEffect`. The conditional return prevented the `useEffect` from running on the first render.

### ❌ The Problem Code Structure

```javascript
const Project3 = () => {
  // Hooks 1-5 (useAxios and useState) are called correctly
  const { data, loading, error } = useAxios(url);
  const [ingredients, setIngredients] = useState([]);

  // 🛑 PROBLEM: This returns early when loading is TRUE
  if (loading) return <div>Loading...</div>;

  // This code is SKIPPED on the first render
  const meal = data.meals[0];

  // 🛑 HOOK 6 IS NEVER CALLED ON FIRST RENDER
  useEffect(() => {
    // ... ingredient processing logic ...
  }, [meal]);

  // ... rest of the component
};
```

import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import TagCategoryList from "./pages/TagCategoryList/TagCategoryList";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <TagCategoryList />
    </>
  );
}

export default App;

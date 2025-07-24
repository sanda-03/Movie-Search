import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.js";
import StarRating from "./StarRating";

function Test() {
  const [rating, setRating] = useState(0);
  return (
    <div>
      <StarRating
        maxrating={10}
        color={"#FFD700"}
        size={48}
        defaultrating={1}
        onsetRating={setRating}
      />
      <p>This movie is rated {rating} stars</p>
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import UnderConstruction from "./pages/UnderConstruction.jsx";

const under_construction = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {under_construction ? <UnderConstruction /> : <App />}
  </React.StrictMode>
);

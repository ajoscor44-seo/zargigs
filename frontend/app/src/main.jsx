import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import UnderConstruction from "./pages/UnderConstruction.jsx";
import { registerServiceWorker } from "./serviceWorker.js";

const under_construction = false;
useEffect(() => {
  registerServiceWorker();
}, []);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {under_construction ? <UnderConstruction /> : <App />}
  </React.StrictMode>
);

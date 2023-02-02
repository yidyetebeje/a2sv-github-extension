import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
const idx = document.getElementById("root");
if (idx) {
  ReactDOM.createRoot(idx).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}


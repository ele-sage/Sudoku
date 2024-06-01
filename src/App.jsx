import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/styles.css";

import App from "./components/Sudoku";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
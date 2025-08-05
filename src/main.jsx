import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Configure PDF worker before any components are rendered
import { configurePDFWorker } from "./utils/pdfLoader";
configurePDFWorker();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

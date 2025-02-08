/* eslint-disable no-unused-vars */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { UserView } from "./components/UserView.jsx";
import { NotFound } from "./components/NotFound.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<UserView />} />
        <Route path="/admin" element={<App />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  </StrictMode>
);

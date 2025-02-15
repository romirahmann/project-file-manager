/* eslint-disable no-unused-vars */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

import { UserView } from "./components/UserView.jsx";
import { NotFound } from "./components/NotFound.jsx";
import { Login } from "./components/Login.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <UserView />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  </StrictMode>
);

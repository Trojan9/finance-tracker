import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import TransactionsPage from "../pages/TransactionsPage";
import LandingPage from "../pages/LandingPage";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";

const AppRouter: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Unprotected Routes */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/transactions" element={<TransactionsPage />} />

        {/* Grouped Dashboard Routes */}
        <Route path="/dashboard/*" element={<DashboardPage />} />
        
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
  );
};

export default AppRouter;

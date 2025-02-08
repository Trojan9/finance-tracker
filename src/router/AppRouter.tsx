import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import TransactionsPage from '../pages/TransactionsPage';
import LandingPage from '../pages/LandingPage';
import Register from '../pages/Register';
import Login from '../pages/Login';

const AppRouter: React.FC = () => {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/transactions" element={<TransactionsPage />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;


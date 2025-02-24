import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import RecentExpenses from "../components/Dashboard/RecentExpenses";
import QuickAccess from "../components/Dashboard/QuickAccess";
import Home from "../features/dashboard/Home";
import Expenses from "../components/Dashboard/Expenses";
import Trips from "../components/Dashboard/Trips";
import Settings from "../components/Dashboard/Settings";
import Support from "../components/Dashboard/Support";
import Appointments from "../components/Dashboard/Appointments";
import Portfolio from "../components/portfolio/Portfolio";
import Services from "../components/Scheduling/Services";

const DashboardPage: React.FC = () => {
  console.log("DashboardPage");
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-900 text-white p-8">
        <div className="flex-1 bg-gray-900 text-white p-8">
          <Routes>
            {/* Redirect dashboard to dashboard/home */}
            <Route
              path="/"
              element={<Navigate to="/dashboard/home" replace />}
            />

            <Route path="/home" element={<Home />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/services" element={<Services />} />
            <Route path="//portfolio" element={<Portfolio />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/support" element={<Support />} />
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

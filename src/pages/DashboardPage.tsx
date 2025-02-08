import React from "react";
import Sidebar from "../components/Sidebar";
import RecentExpenses from "../components/RecentExpenses";
import QuickAccess from "../components/QuickAccess";


const DashboardPage: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-900 text-white p-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Pending Tasks</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Pending Approvals: 5</li>
              <li>New Trips Registered: 1</li>
              <li>Unreported Expenses: 4</li>
              <li>Upcoming Expenses: 0</li>
            </ul>
          </div>
          <RecentExpenses />
        </div>
        <QuickAccess />
      </div>
    </div>
  );
};

export default DashboardPage;

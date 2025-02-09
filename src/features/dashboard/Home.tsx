import React from "react";
import { FaCheck, FaPlane, FaFileAlt, FaMoneyBill, FaClipboard, FaReceipt, FaFile, FaPlaneDeparture } from "react-icons/fa";
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const spendingData = [
  { name: "P3", value: 60000 },
  { name: "S3", value: 40000 },
  { name: "MB", value: 80000 },
  { name: "IS", value: 20000 },
  { name: "DW", value: 30000 },
  { name: "N3", value: 50000 },
  { name: "BS", value: 100000 },
];

const dayToDayData = [
  { category: "Accommodation", percentage: 30 },
  { category: "Comms", percentage: 20 },
  { category: "Services", percentage: 50 },
  { category: "Food", percentage: 40 },
  { category: "Fuel", percentage: 25 },
];

const Home: React.FC = () => {
  return (
    <div className="p-6 md:p-8 bg-gray-900 text-white">
      {/* Pending Tasks and Recent Expenses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Pending Tasks */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">Pending Tasks</h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex justify-between items-center">
              <span className="flex items-center space-x-2">
                <FaCheck className="text-blue-500" />
                <span>Pending Approvals</span>
              </span>
              <span>5</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="flex items-center space-x-2">
                <FaPlane className="text-purple-500" />
                <span>New Trips Registered</span>
              </span>
              <span>1</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="flex items-center space-x-2">
                <FaFileAlt className="text-pink-500" />
                <span>Unreported Expenses</span>
              </span>
              <span>4</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="flex items-center space-x-2">
                <FaMoneyBill className="text-green-500" />
                <span>Upcoming Expenses</span>
              </span>
              <span>0</span>
            </li>
          </ul>
        </div>

        {/* Recent Expenses */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">Recent Expenses</h3>
          <div className="text-sm text-gray-400 space-y-4">
            <div className="flex justify-between">
              <span>Office Supplies</span>
              <span className="text-gray-200">€150</span>
            </div>
            <div className="flex justify-between">
              <span>Business Lunch</span>
              <span className="text-gray-200">€75.50</span>
            </div>
            <div className="flex justify-between">
              <span>Travel Expenses</span>
              <span className="text-gray-200">€450.25</span>
            </div>
            <div className="flex justify-between">
              <span>Client Dinner</span>
              <span className="text-gray-200">€120</span>
            </div>
            <div className="flex justify-between">
              <span>Hotel</span>
              <span className="text-gray-200">€275.75</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 flex justify-between items-center space-x-4">
        <button className="bg-purple-600 px-4 py-2 rounded-lg shadow-md text-sm hover:bg-purple-500 flex items-center space-x-2">
          <FaClipboard />
          <span>+ New Expense</span>
        </button>
        <button className="bg-blue-600 px-4 py-2 rounded-lg shadow-md text-sm hover:bg-blue-500 flex items-center space-x-2">
          <FaReceipt />
          <span>+ New Appointment</span>
        </button>
        <button className="bg-green-600 px-4 py-2 rounded-lg shadow-md text-sm hover:bg-green-500 flex items-center space-x-2">
          <FaFile />
          <span>+ Create Report</span>
        </button>
        <button className="bg-red-600 px-4 py-2 rounded-lg shadow-md text-sm hover:bg-red-500 flex items-center space-x-2">
          <FaPlaneDeparture />
          <span>+ Create Trip</span>
        </button>
      </div>

      {/* Monthly Report */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team Spending Trend */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">Team Spending Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={spendingData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Day-to-Day Expenses */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">Day-to-Day Expenses</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dayToDayData}>
              <XAxis dataKey="category" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="percentage" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Home;

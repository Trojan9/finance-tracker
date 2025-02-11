
import React, { useState } from "react";
import { FaCheck, FaPlane, FaFileAlt, FaMoneyBill, FaClipboard, FaReceipt, FaFile, FaPlaneDeparture, FaUpload } from "react-icons/fa";
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
// import { Transaction } from "../../context/types";
import { Transaction, CategorySpending } from "../../constants"; 
// Initial Graph Data (empty)
const initialSpendingData = [
  { date: "01 Feb 25", amount: 0 },
  { date: "02 Feb 25", amount: 0 },
  { date: "03 Feb 25", amount: 0 },
  { date: "04 Feb 25", amount: 0 },
  { date: "05 Feb 25", amount: 0 },
  { date: "06 Feb 25", amount: 0 },
  { date: "07 Feb 25", amount: 0 },
];

const initialCategoryData = [
  { category: "Accommodation", amount: 0 },
  { category: "Comms", amount: 0 },
  { category: "Services", amount: 0 },
  { category: "Food", amount: 0 },
  { category: "Fuel", amount: 0 },
];

const Home: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categoryData, setCategoryData] = useState<CategorySpending[]>([]);

  
  // Handle File Upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch("https://aidev.glmrs.space/api/v1/extract", {
        method: "POST",
        headers: {
            "Accept": "application/json",  // Ensures JSON response
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRpbW15YmFqb0BnbWFpbC5jb20iLCJwYXNzd29yZCI6IjEyMzQ1Njc4OTAiLCJpYXQiOjE2OTM1OTc3MjF9.kBEnsor_zKbrhtL8i0yI2b9Jtz-3POBj9vQYF4SLyVk"
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload PDF");
      }
  
      const result = await response.json();
      console.log(result);
      const extractedData = result.data; // Get transactions from API response
  
      // Process transactions into required format
      parseTransactionsFromAPI(extractedData);
    } catch (error) {
      console.error("Error processing PDF:", error);
    }
  };
  
  // Function to Parse Transactions from API response
  const parseTransactionsFromAPI = (transactions: any[]) => {
    const newTransactions: Transaction[] = [];
    const newCategoryData: CategorySpending[] = [];
  
    transactions.forEach((transaction) => {
      const { date, details, money_out, money_in } = transaction;
      const amount = money_out > 0 ? money_out : money_in; // Determine transaction amount
  
      newTransactions.push({ date, amount });
  
      // Process category spending
      const category = details.toLowerCase();
      const existingCategory = newCategoryData.find((c) => category.includes(c.category.toLowerCase()));
      if (existingCategory) {
        existingCategory.amount += amount;
      } else {
        newCategoryData.push({ category, amount });
      }
    });
  
    setTransactions(newTransactions);
    setCategoryData(newCategoryData);
  };

  return (
    <div className="p-6 md:p-8 bg-gray-900 text-white">
        {/* Upload Button */}
        <div className="flex justify-end mb-4">
        <label className="bg-blue-600 px-4 py-2 rounded-lg shadow-md text-sm cursor-pointer flex items-center space-x-2 hover:bg-blue-500">
          <FaUpload />
          <span>Upload Bank Statement</span>
          <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>
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

     {/* Spending Per Day Chart */}
     <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h3 className="text-lg font-bold mb-4">Day-to-Day Spending This Month</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={transactions}>
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#6366F1" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category-wise Spending Chart */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-4">Category-Wise Spending This Month</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={categoryData}>
            <XAxis dataKey="category" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Bar dataKey="amount" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      </div>
  
  );
};

export default Home;

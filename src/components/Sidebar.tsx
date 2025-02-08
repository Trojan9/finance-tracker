import React from "react";
import { FaHome, FaWallet, FaPlane, FaClipboardCheck, FaCog, FaPhone } from "react-icons/fa";


const Sidebar: React.FC = () => {
  return (
    <div className="h-screen bg-gray-900 text-white w-64 p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-4 mb-8">
          <img
            src="https://via.placeholder.com/50"
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="text-lg font-bold">Janice Chandler</h3>
          </div>
        </div>
        <nav className="space-y-6">
          <a href="#" className="flex items-center space-x-4 hover:text-blue-500">
            <FaHome />
            <span>Home</span>
          </a>
          <a href="#" className="flex items-center space-x-4 hover:text-blue-500">
            <FaWallet />
            <span>Expenses</span>
          </a>
          <a href="#" className="flex items-center space-x-4 hover:text-blue-500">
            <FaPlane />
            <span>Trips</span>
          </a>
          <a href="#" className="flex items-center space-x-4 hover:text-blue-500">
            <FaClipboardCheck />
            <span>Approvals</span>
          </a>
          <a href="#" className="flex items-center space-x-4 hover:text-blue-500">
            <FaCog />
            <span>Settings</span>
          </a>
          <a href="#" className="flex items-center space-x-4 hover:text-blue-500">
            <FaPhone />
            <span>Support</span>
          </a>
        </nav>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-400">Expensio</p>
      </div>
    </div>
  );
};

export default Sidebar;

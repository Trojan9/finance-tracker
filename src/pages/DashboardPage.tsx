import React, { useEffect, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };
  
  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (startX !== null) {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      if (startX - clientX > 50) {
        setMenuOpen(false);
        setStartX(null);
      }
    }
  };
  
  const handleMouseUp = () => {
    setStartX(null);
  };
  
  // Event listeners are added only when the menu is open
  useEffect(() => {
    if (menuOpen) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleMouseUp);
    }
  
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [menuOpen, startX]);
  return (
    <div className="flex">
      <div className="hidden lg:block">
        <Sidebar setMenuOpen={setMenuOpen} />
      </div>

{/* menu bar */}
      <div className="flex-1 bg-gray-900 text-white ">
        <div className="block lg:hidden px-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none text-2xl md:text-3xl p-3 bg-gray-700 rounded-lg"
          >
            ☰
          </button>
        </div>
        {menuOpen && (
            <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            className={`fixed inset-y-0 left-0 z-50 bg-gray-800 transition-transform duration-300 ${
              menuOpen ? "translate-x-0 w-64" : "-translate-x-full w-0"
            } lg:relative lg:translate-x-0 lg:w-64`}
          >
            <Sidebar setMenuOpen={setMenuOpen} />
          </div>
        )}
        <Routes>
          {/* Redirect dashboard to dashboard/home */}
          <Route path="/" element={<Navigate to="/dashboard/home" replace />} />

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
  );
};

export default DashboardPage;

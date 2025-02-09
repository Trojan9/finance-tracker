import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaWallet,
  FaPlane,
  FaClipboardCheck,
  FaCog,
  FaPhone,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../utils/firebaseConfig"; // Assuming firebaseConfig exports initialized `auth` and `db`
import { doc, getDoc } from "firebase/firestore";
const Sidebar: React.FC = () => {
  const [userName, setUserName] = useState<string>(localStorage.getItem("userName") || "User");
  const [userInitials, setUserInitials] = useState<string>("U");

  useEffect(() => {
    const fetchUserData = async (userId: string) => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          console.log("User data:", userDoc.data());
          const fullName = userDoc.data().name || "User";
          setUserName(fullName);
          localStorage.setItem("userName", fullName); // Cache the user's name
          setUserInitials(
            fullName
              .split(" ")
              .map((word:any) => word[0])
              .join("")
              .toUpperCase()
          );
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("User state changed to:", user);
      if (user) {
        fetchUserData(user.uid);
      } else {
        setUserName("User");
        setUserInitials("U");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      console.log("User logged out");
      localStorage.removeItem("userName");
    });
  };
  return (

    <div className="min-h-screen bg-gray-900 text-white w-64 p-4 flex flex-col justify-between">
      <div>
        {/* Circular Avatar with Initials */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
          {userInitials}
          </div>
          <div>
            <h3 className="text-lg font-bold">{userName}</h3>
          </div>
        </div>



        {/* Navigation Links */}
        <nav className="space-y-6">
          <NavLink
            to="/dashboard/home"
            className={({ isActive }) =>
              `flex items-center space-x-4 hover:text-blue-500 ${
                isActive ? "text-blue-500" : "text-gray-300"
              }`
            }
          >
            <FaHome />
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/dashboard/expenses"
            className={({ isActive }) =>
              `flex items-center space-x-4 hover:text-blue-500 ${
                isActive ? "text-blue-500" : "text-gray-300"
              }`
            }
          >
            <FaWallet />
            <span>Expenses</span>
          </NavLink>
          <NavLink
            to="/dashboard/trips"
            className={({ isActive }) =>
              `flex items-center space-x-4 hover:text-blue-500 ${
                isActive ? "text-blue-500" : "text-gray-300"
              }`
            }
          >
            <FaPlane />
            <span>Trips</span>
          </NavLink>
          <NavLink
            to="/dashboard/approvals"
            className={({ isActive }) =>
              `flex items-center space-x-4 hover:text-blue-500 ${
                isActive ? "text-blue-500" : "text-gray-300"
              }`
            }
          >

            <FaClipboardCheck />
            <span>Appointments</span>
          </NavLink>
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              `flex items-center space-x-4 hover:text-blue-500 ${
                isActive ? "text-blue-500" : "text-gray-300"
              }`
            }
          >
            <FaCog />
            <span>Settings</span>
          </NavLink>
          <NavLink
            to="/dashboard/support"
            className={({ isActive }) =>
              `flex items-center space-x-4 hover:text-blue-500 ${
                isActive ? "text-blue-500" : "text-gray-300"
              }`
            }
          >
            <FaPhone />
            <span>Support</span>
          </NavLink>
        </nav>
      </div>

      {/* Logout Button */}
      <div>
        <a
          href="#"
          className="flex items-center space-x-4 text-gray-300 hover:text-red-500 transition"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;

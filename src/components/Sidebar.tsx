import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaWallet,
  FaPlane,
  FaClipboardCheck,
  FaCog,
  FaPhone,
  FaSignOutAlt,
  FaBriefcase,
  FaChevronUp,
  FaChevronDown,
  FaBoxOpen,
  FaUsers,
  FaRobot,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../utils/firebaseConfig"; // Assuming firebaseConfig exports initialized `auth` and `db`
import { doc, getDoc } from "firebase/firestore";
const Sidebar = ({setMenuOpen}:any) => {
  const [userName, setUserName] = useState<string>(
    localStorage.getItem("userName") || "User"
  );
  const [userInitials, setUserInitials] = useState<string>("U");
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);

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
              .map((word: any) => word[0])
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
            onClick={() => {
              if (window.innerWidth < 1024) { // Example: Only close if screen is smaller than 1024px
                setMenuOpen(false);
              }
            }}
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
            onClick={() => {
              if (window.innerWidth < 1024) { // Example: Only close if screen is smaller than 1024px
                setMenuOpen(false);
              }
            }}
            className={({ isActive }) =>
              `flex items-center space-x-4 hover:text-blue-500 ${
                isActive ? "text-blue-500" : "text-gray-300"
              }`
            }
          >
            <FaWallet />
            <span>Transaction</span>
          </NavLink>
          <NavLink
            to="/dashboard/trips"
            onClick={() => {
              if (window.innerWidth < 1024) { // Example: Only close if screen is smaller than 1024px
                setMenuOpen(false);
              }
            }}
            className={({ isActive }) =>
              `flex items-center space-x-4 hover:text-blue-500 ${
                isActive ? "text-blue-500" : "text-gray-300"
              }`
            }
          >
            <FaPlane />
            <span>Trips</span>
          </NavLink>

          {/* <NavLink
            to="/dashboard/appointments"
            className={({ isActive }) =>
              `flex items-center space-x-4 hover:text-blue-500 ${
                isActive ? "text-blue-500" : "text-gray-300"
              }`
            }
          >

            <FaClipboardCheck />
            <span>Appointments</span>
          </NavLink> */}


          <div>
            <button
              onClick={() => setIsSchedulingOpen(!isSchedulingOpen)}
              className="flex items-center space-x-4 w-full text-left hover:text-blue-500"
            >
              <FaClipboardCheck />
              <span>Scheduling</span>
              {isSchedulingOpen ? (
                <FaChevronUp className="ml-auto" />
              ) : (
                <FaChevronDown className="ml-auto" />
              )}
            </button>
            {isSchedulingOpen && (
              <div className="pl-6 space-y-2 mt-2">
                <NavLink
                  to="/dashboard/appointments"
                  onClick={() => {
                    if (window.innerWidth < 1024) { // Example: Only close if screen is smaller than 1024px
                      setMenuOpen(false);
                    }
                  }}
                  className={({ isActive }) =>
                    `flex items-center space-x-4 p-2 rounded-md hover:text-blue-500 ${
                      isActive ? "text-blue-500" : "text-gray-300"
                    }`
                  }
                >
                  <FaClipboardCheck />
                  <span>Appointments</span>
                </NavLink>
                <NavLink
                  to="/dashboard/services"
                  onClick={() => {
                    if (window.innerWidth < 1024) { // Example: Only close if screen is smaller than 1024px
                      setMenuOpen(false);
                    }
                  }}
                  className={({ isActive }) =>
                    `flex items-center space-x-4 p-2 rounded-md hover:text-blue-500 ${
                      isActive ? "text-blue-500" : "text-gray-300"
                    }`
                  }
                >
                  <FaBoxOpen />
                  <span>Services</span>
                </NavLink>
                <NavLink
                  to="/dashboard/clients"
                  onClick={() => {
                    if (window.innerWidth < 1024) { // Example: Only close if screen is smaller than 1024px
                      setMenuOpen(false);
                    }
                  }}
                  className={({ isActive }) =>
                    `flex items-center space-x-4 p-2 rounded-md hover:text-blue-500 ${
                      isActive ? "text-blue-500" : "text-gray-300"
                    }`
                  }
                >
                  <FaUsers />
                  <span>Clients</span>
                </NavLink>
                <NavLink
                  to="/dashboard/copilot"
                  onClick={() => {
                    if (window.innerWidth < 1024) { // Example: Only close if screen is smaller than 1024px
                      setMenuOpen(false);
                    }
                  }}
                  className={({ isActive }) =>
                    `flex items-center space-x-4 p-2 rounded-md hover:text-blue-500 ${
                      isActive ? "text-blue-500" : "text-gray-300"
                    }`
                  }
                >
                  <FaRobot />
                  <span>CoPilot</span>
                </NavLink>
              </div>
            )}
          </div>

          <NavLink
            to="/dashboard/portfolio"
            onClick={() => {
              if (window.innerWidth < 1024) { // Example: Only close if screen is smaller than 1024px
                setMenuOpen(false);
              }
            }}
            className={({ isActive }) =>
              `flex items-center space-x-4 hover:text-blue-500 ${
                isActive ? "text-blue-500" : "text-gray-300"
              }`
            }
          >
            <FaBriefcase />
            <span>Portfolio</span>
          </NavLink>
          <NavLink
            to="/dashboard/settings"
            onClick={() => {
              if (window.innerWidth < 1024) { // Example: Only close if screen is smaller than 1024px
                setMenuOpen(false);
              }
            }}
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
            onClick={() => {
              if (window.innerWidth < 1024) { // Example: Only close if screen is smaller than 1024px
                setMenuOpen(false);
              }
            }}
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

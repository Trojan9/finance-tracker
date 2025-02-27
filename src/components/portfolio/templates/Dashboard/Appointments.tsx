import React, { useState, useEffect, useRef } from "react";
import { FaCalendarAlt, FaPlus } from "react-icons/fa";
import { collection, query, where, getDocs } from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db, auth, storage } from "../../../../utils/firebaseConfig";
const Appointments: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState(auth.currentUser);
  const navigate = useNavigate();
  useEffect(() => {
    // ✅ Ensure auth state is initialized before running Firestore queries
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser); // ✅ Store the authenticated user
      } else {
        console.error("User not authenticated.");
        navigate("/login");
        // router.push("/login"); // ✅ Redirect to login page if no user
      }
    });

    return () => unsubscribeAuth(); // ✅ Cleanup listener on unmount
  }, []);
  useEffect(() => {
    const fetchAppointments = async () => {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const q = query(collection(db, "appointments"), where("date", "==", formattedDate));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAppointments(data);
    };
    fetchAppointments();
  }, [selectedDate,user]);


  const getCurrentTimePosition = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const totalMinutes = (currentHour) * 60 + currentMinutes;
    return ((totalMinutes) / 720) * 100; // Percentage of the total timeline
  };


  const scrollToCurrentTime = () => {
    if (timelineRef.current) {
      const currentTimePosition = (getCurrentTimePosition() / 100) * timelineRef.current.scrollHeight;
      timelineRef.current.scrollTop = currentTimePosition - timelineRef.current.clientHeight / 2;
    }
  };

  useEffect(() => {
    scrollToCurrentTime();
    const interval = setInterval(scrollToCurrentTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="h-screen overflow-y-auto p-6 md:p-8 bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <FaCalendarAlt className="text-xl text-blue-500" />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => date && setSelectedDate(date)}
            className="bg-gray-700 text-white p-2 rounded-md"
          />
        </div>
        <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600">
          <FaPlus className="mr-2" /> New Appointment
        </button>
      </div>

      {/* Timeline */}
      <div
        ref={timelineRef}
        className="relative w-full bg-gray-800 p-4 rounded-lg shadow-lg overflow-y-auto h-[600px]"
      >

        {/* Horizontal Red Line for Current Time */}
        <div
          className="absolute left-0 w-full h-0.5 bg-red-500 "
          style={{ top: `${getCurrentTimePosition()+1.5}%` }}
        >
          <span className="absolute left-2 -top-3 bg-red-500 text-white text-xs px-1 rounded">
            Now
          </span>
        </div>

        {/* Hour Slots */}
        {Array.from({ length: 24 }, (_, index) => {
          const hour = 0 + index;

          return (
            <div key={hour} className="relative border-b border-gray-600 py-6">
              <span className="absolute left-0 -top-3 text-gray-400">{hour}:00</span>

              {/* Appointment Blocks */}
              {appointments
                .filter((appt) => appt.startTime.split(":")[0] == hour)
                .map((appt) => (
                  <div
                    key={appt.id}
                    className={`absolute left-12 w-4/5 p-2 rounded-md text-sm font-semibold shadow-md ${
                      appt.type === "Consultation"
                        ? "bg-blue-500"
                        : appt.type === "Checkup"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                    style={{
                      top: `${(parseInt(appt.startTime.split(":")[1]) / 60) * 100}%`,
                      height: `${(appt.duration / 60) * 100}%`,
                    }}
                  >
                    {appt.client} - {appt.type}
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Appointments;

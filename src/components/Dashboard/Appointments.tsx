import React, { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { db } from "../../utils/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Appointments: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const q = query(collection(db, "appointments"), where("date", "==", formattedDate));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAppointments(data);
    };
    fetchAppointments();
  }, [selectedDate]);

  const getCurrentTimePosition = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const totalMinutes = (currentHour - 8) * 60 + currentMinutes;
    return (totalMinutes / 720) * 100; // Percentage of the total timeline
  };

  return (
    <div className="p-6 md:p-8 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <FaCalendarAlt className="text-xl text-blue-500" />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => date && setSelectedDate(date)}
            className="bg-gray-700 text-white p-2 rounded-md"
          />
        </div>
        <h1 className="text-2xl font-bold">Appointments</h1>
      </div>

      <div className="relative w-full bg-gray-800 p-4 rounded-lg shadow-lg overflow-y-auto h-[600px]">
        <div className="absolute left-4 top-0 w-px bg-red-500 h-full" style={{ top: `${getCurrentTimePosition()}%` }} />

        {Array.from({ length: 12 }, (_, index) => {
          const hour = 8 + index;
          return (
            <div key={hour} className="relative border-b border-gray-600 py-6">
              <span className="absolute left-0 -top-3 text-gray-400">{hour}:00</span>
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


import React, { useState, useEffect } from "react";
import { FaPlaneDeparture, FaPlane, FaPlus, FaMoneyBill, FaMapMarkerAlt, FaSpinner, FaFileUpload, FaFileInvoice, FaTimes } from "react-icons/fa";
import { db, auth } from "../../utils/firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import countries from "../../constants/countries";

const TripsPage: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [newTrip, setNewTrip] = useState({ destination: "", date: "", budget: "" });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<any | null>(null); // Selected trip details

  
  useEffect(() => {
    const fetchTrips = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(collection(db, "trips"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const tripsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTrips(tripsData);
      setLoading(false);
    };
    fetchTrips();
  }, []);

  const handleAddTrip = async () => {
    setAdding(true);
    const user = auth.currentUser;
    if (!user) return;
  
    const newTripData = {
      ...newTrip,
      userId: user.uid,
      createdAt: new Date(),
    };
  
    const docRef = await addDoc(collection(db, "trips"), newTripData);
  
    setTrips((prevTrips) => [...prevTrips, { id: docRef.id, ...newTripData }]); // Update state instead of reloading
    setNewTrip({ destination: "", date: "", budget: "" });
    setAdding(false);
  };
  

  return (
    <div className="p-6 md:p-8 bg-gray-900 text-white relative">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <FaPlaneDeparture className="mr-2" /> My Trips
      </h1>

      {/* Add New Trip */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h3 className="text-lg font-bold mb-4">Plan a New Trip</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="p-2 rounded bg-gray-700 text-white"
            value={newTrip.destination}
            onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
          >
            <option value="">Select Destination</option>
            {countries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          <input
            type="date"
            className="p-2 rounded bg-gray-700 text-white"
            value={newTrip.date}
            onChange={(e) => setNewTrip({ ...newTrip, date: e.target.value })}
          />
          <input
            type="number"
            placeholder="Budget"
            className="p-2 rounded bg-gray-700 text-white"
            value={newTrip.budget}
            onChange={(e) => setNewTrip({ ...newTrip, budget: e.target.value })}
          />
          <button className="bg-blue-600 px-4 py-2 rounded-lg shadow-md hover:bg-blue-500 flex items-center justify-center" onClick={handleAddTrip} disabled={adding}>
            {adding ? <FaSpinner className="animate-spin" /> : <><FaPlus className="mr-2" /> Add Trip</>}
          </button>
        </div>
      </div>

      {/* Upcoming & Recent Trips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Upcoming Trips */}
             <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">Upcoming Trips</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            trips.filter((trip) => new Date(trip.date) >= new Date()).map((trip) => (
              <div key={trip.id} className="text-gray-400 border-b py-2 flex justify-between items-center">
                <div>
                  <FaMapMarkerAlt className="inline mr-2 text-blue-500" /> {trip.destination} - {trip.date}
                </div>
                <button onClick={() => setSelectedTrip(trip)} className="text-blue-400 hover:text-blue-300">
                  View Details
                </button>
              </div>
            ))
          )}
        </div>

        {/* Recent Trips */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">Recent Trips</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            trips.filter((trip) => new Date(trip.date) < new Date()).map((trip) => (
              <div key={trip.id} className="text-gray-400 border-b py-2 flex justify-between items-center">
                <div>
                  <FaPlane className="inline mr-2 text-green-500" /> {trip.destination} - {trip.date}
                </div>
                <div className="flex space-x-2">
                  <button className="text-green-400 hover:text-green-300 flex items-center">
                    <FaFileInvoice className="mr-1" /> View Report
                  </button>
                  <button className="text-gray-400 hover:text-gray-300 flex items-center">
                    <FaFileUpload className="mr-1" /> Upload Receipt
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Trip Expense Trend & Spending Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">Trip Expense Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trips}>
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="budget" stroke="#6366F1" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">Spending Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trips}>
              <XAxis dataKey="destination" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="budget" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Trip Details Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Trip Details</h2>
              <button onClick={() => setSelectedTrip(null)} className="text-gray-400 hover:text-gray-200">
                <FaTimes />
              </button>
            </div>
            <p><strong>Destination:</strong> {selectedTrip.destination}</p>
            <p><strong>Date:</strong> {selectedTrip.date}</p>
            <p><strong>Budget:</strong> €{selectedTrip.budget}</p>
            <p><strong>Status:</strong> Pending</p>
            <div className="mt-4">
              <button className="bg-blue-600 px-4 py-2 rounded-lg shadow-md hover:bg-blue-500 flex items-center">
                <FaMoneyBill className="mr-2" /> View Expenses
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripsPage;

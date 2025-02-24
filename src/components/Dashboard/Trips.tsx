import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  FaPlaneDeparture,
  FaPlane,
  FaPlus,
  FaMoneyBill,
  FaMapMarkerAlt,
  FaSpinner,
  FaFileUpload,
  FaFileInvoice,
  FaTimes,
  FaImage,
  FaTrash,
} from "react-icons/fa";
import { db, auth, storage } from "../../utils/firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import countries from "../../constants/countries";
import { useNavigate } from "react-router-dom";

const TripsPage: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [user, setUser] = useState(auth.currentUser);
  const [newTrip, setNewTrip] = useState({
    destination: "",
    date: "",
    budget: "",
  });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<any | null>(null); // Selected trip details
  const [uploading, setUploading] = useState(false);
  const [uploadingString, setUploadingString] = useState<string | null>(null);
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
    const fetchTrips = async () => {
      
      if (!user) return;
      const q = query(collection(db, "trips"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const tripsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTrips(tripsData);
      setLoading(false);
    };
    fetchTrips();
  }, [user]);

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
  const handleDeleteFile = async (
    fileURL: string,
    type: "receipts" | "memories"
  ) => {
    if (!selectedTrip) return;
    const fileRef = ref(storage, fileURL);
    await deleteObject(fileRef);

    const updatedTrip = {
      ...selectedTrip,
      [type]: selectedTrip[type].filter((url: string) => url !== fileURL),
    };

    await updateDoc(doc(db, "trips", selectedTrip.id), {
      [type]: updatedTrip[type],
    });
    setSelectedTrip(updatedTrip);
  };

  const handleFileUpload = async (
    file: File,
    type: "receipts" | "memories"
  ) => {
    if (!selectedTrip) return;

    setUploadingString(type);
    const storageRef = ref(
      storage,
      `trips/${selectedTrip.id}/${type}/${file.name}`
    );
    await uploadBytes(storageRef, file);
    const fileURL = await getDownloadURL(storageRef);

    const updatedTrip = {
      ...selectedTrip,
      [type]: [...(selectedTrip[type] || []), fileURL],
    };

    await updateDoc(doc(db, "trips", selectedTrip.id), {
      [type]: updatedTrip[type],
    });
    setSelectedTrip(updatedTrip);
    setUploadingString(null);
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
            onChange={(e) =>
              setNewTrip({ ...newTrip, destination: e.target.value })
            }
          >
            <option value="">Select Destination</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
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
          <button
            className="bg-blue-600 px-4 py-2 rounded-lg shadow-md hover:bg-blue-500 flex items-center justify-center"
            onClick={handleAddTrip}
            disabled={adding}
          >
            {adding ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <>
                <FaPlus className="mr-2" /> Add Trip
              </>
            )}
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
            trips
              .filter((trip) => new Date(trip.date) >= new Date())
              .map((trip) => (
                <div
                  key={trip.id}
                  className="text-gray-400 border-b py-2 flex justify-between items-center"
                >
                  <div>
                    <FaMapMarkerAlt className="inline mr-2 text-blue-500" />{" "}
                    {trip.destination} - {trip.date}
                  </div>
                  <button
                    onClick={() => setSelectedTrip(trip)}
                    className="text-blue-400 hover:text-blue-300"
                  >
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
            trips
              .filter((trip) => new Date(trip.date) < new Date())
              .map((trip) => (
                <div
                  key={trip.id}
                  className="text-gray-400 border-b py-2 flex justify-between items-center"
                >
                  <div>
                    <FaPlane className="inline mr-2 text-green-500" />{" "}
                    {trip.destination} - {trip.date}
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
              <Line
                type="monotone"
                dataKey="budget"
                stroke="#6366F1"
                strokeWidth={3}
              />
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
      {/* Trip Details Modal */}
      {selectedTrip && (
        <>
          <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
            <div className="relative w-[90%] my-6 mx-auto max-w-3xl md:w-[50%]">
              {/* Content */}
              <div className="border-0 rounded-lg shadow-lg flex flex-col w-full bg-[#0C222D] p-6 max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="items-end ">
                  <button
                    className="bg-white border-0 text-white float-right rounded-full"
                    onClick={() => setSelectedTrip(null)}
                  >
                    <span className="text-black h-7 w-6 text-xl block mt-0 py-0 rounded-full items-center">
                      x
                    </span>
                  </button>
                </div>

                {/* Grid View */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p>
                    <strong>Destination:</strong> {selectedTrip.destination}
                  </p>
                  <p>
                    <strong>Date:</strong> {selectedTrip.date}
                  </p>
                  <p>
                    <strong>Budget:</strong> £{selectedTrip.budget}
                  </p>
                  <p>
                    <strong>Status:</strong> Pending
                  </p>
                </div>

                {/* Receipts Section */}
                {selectedTrip.receipts?.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-bold">Receipts</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedTrip.receipts.map(
                        (receipt: string, index: number) => (
                          <div key={index} className="relative">
                            <img
                              src={receipt}
                              alt={`Receipt ${index + 1}`}
                              className="rounded-lg shadow-md"
                            />
                            <button
                              onClick={() =>
                                handleDeleteFile(receipt, "receipts")
                              }
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Memories Section */}
                {selectedTrip.memories?.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-bold">Memories</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedTrip.memories.map(
                        (memory: string, index: number) => (
                          <div key={index} className="relative">
                            <img
                              src={memory}
                              alt={`Memory ${index + 1}`}
                              className="rounded-lg shadow-md"
                            />
                            <button
                              onClick={() =>
                                handleDeleteFile(memory, "memories")
                              }
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Upload Buttons */}
                <div className="mt-4 flex justify-between">
                  <label
                    htmlFor="upload-receipt"
                    className="bg-green-600 px-4 py-2 rounded-lg shadow-md hover:bg-green-500 flex items-center cursor-pointer"
                  >
                    {uploadingString === "receipts" ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : (
                      <FaFileUpload className="mr-2" />
                    )}
                    Upload Receipt
                  </label>
                  <input
                    type="file"
                    onChange={(e) =>
                      e.target.files &&
                      handleFileUpload(e.target.files[0], "receipts")
                    }
                    className="hidden"
                    id="upload-receipt"
                  />

                  <label
                    htmlFor="upload-memories"
                    className="bg-purple-600 px-4 py-2 rounded-lg shadow-md hover:bg-purple-500 flex items-center cursor-pointer"
                  >
                    {uploadingString === "memories" ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : (
                      <FaImage className="mr-2" />
                    )}
                    Upload Memories
                  </label>
                  <input
                    type="file"
                    onChange={(e) =>
                      e.target.files &&
                      handleFileUpload(e.target.files[0], "memories")
                    }
                    className="hidden"
                    id="upload-memories"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TripsPage;

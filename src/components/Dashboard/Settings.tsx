import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaSpinner, FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { db, auth } from "../../utils/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";

const Settings = () => {
  const [user, setUser] = useState(auth.currentUser);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [schedulesSetInFirebase, setSchedulesSetInFirebase] = useState(false);

  // ✅ Dynamic Schedule
  const [selectedDate, setSelectedDate] = useState(""); // Selected date for scheduling

  // Fixed Schedule (Monday - Sunday)
  const [fixedSchedule, setFixedSchedule] = useState(
    [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ].map((day) => ({ day, start: "00:00", end: "23:00" }))
  );

  // Dynamic Schedule (Selected Days)
  const [dynamicSchedule, setDynamicSchedule] = useState<
    { date: string; start: string; end: string }[]
  >([]);

  // Salon Form
  const [showSalonForm, setShowSalonForm] = useState(false);
  const [salonDetails, setSalonDetails] = useState({
    name: "",
    email: user?.email || "",
    about: "",
    address: "",
    country: "",
    postalCode: "",
    state: "",
    phone: "",
    socialMedia: {
      instagram: "",
      facebook: "",
      tiktok: "",
      twitter: "",
      pinterest: "",
      yelp: "",
    },
    photos: [],
  });

  // Handle Auth State
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        fetchSchedules(firebaseUser.uid);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Fetch User's Schedules
  const fetchSchedules = async (userId: string) => {
    setLoading(true);
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists() && userDoc.data().fixedSchedule) {
      const data = userDoc.data();
      setFixedSchedule(data.fixedSchedule || fixedSchedule);
      setDynamicSchedule(data.dynamicSchedule || []);
      setSchedulesSetInFirebase(true); // ✅ Firebase has schedules
    } else {
      setSchedulesSetInFirebase(false); // ❌ No schedules in Firebase yet
    }
    setLoading(false);
  };

  // Save Schedule Changes
  const saveChanges = async () => {
    if (!user) return;
    setSaving(true);

    try {
      await updateDoc(doc(db, "users", user.uid), {
        fixedSchedule,
        dynamicSchedule,
      });
      setHasUnsavedChanges(false);
      toast.success("Schedules saved successfully!");
    } catch (error) {
      console.error("Error saving schedules:", error);
    }

    setSaving(false);
  };

  return (
    <div className="h-screen overflow-y-auto min-h-screen bg-gray-900 text-white p-6 md:p-12">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Fixed Schedule */}
      <div className="mb-6 bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Fixed Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day, index) => (
            <div key={day} className="flex flex-col bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium">{day}</h3>
              <div className="flex space-x-2 mt-2">
                <input
                  type="time"
                  className="p-2 rounded bg-gray-600 text-white"
                  value={fixedSchedule[index].start}
                  onChange={(e) => {
                    const newSchedule = [...fixedSchedule];
                    newSchedule[index] = {
                      ...newSchedule[index],
                      start: e.target.value,
                    };
                    setFixedSchedule(newSchedule);
                    setHasUnsavedChanges(true);
                  }}
                />
                <input
                  type="time"
                  className="p-2 rounded bg-gray-600 text-white"
                  value={fixedSchedule[index].end}
                  onChange={(e) => {
                    const newSchedule = [...fixedSchedule];
                    newSchedule[index] = {
                      ...newSchedule[index],
                      end: e.target.value,
                    };
                    setFixedSchedule(newSchedule);
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Dynamic Schedule */}
      <div className="mb-6 bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Dynamic Schedule</h2>

        {/* Date Picker & Add Button */}
        <div className="flex items-center gap-3">
          <input
            type="date"
            className="p-2 rounded bg-gray-800 text-white flex-grow border border-gray-600"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center justify-center whitespace-nowrap"
            onClick={() => {
              if (!selectedDate) return; // Prevent empty date
              if (
                dynamicSchedule.some(
                  (schedule) => schedule.date === selectedDate
                )
              ) {
                toast.error("Schedule for this date already exists!");
                return;
              }

              setDynamicSchedule([
                ...dynamicSchedule,
                { date: selectedDate, start: "00:00", end: "23:00" },
              ]);
              setHasUnsavedChanges(true);

              // Ensure UI resets properly
              setTimeout(() => setSelectedDate(""), 0);
            }}
          >
            Add Schedule
          </button>
        </div>

        {/* List of Scheduled Dates */}
        <div className="mt-4">
          {dynamicSchedule.map((schedule, idx) => (
            <div
              key={idx}
              className="bg-gray-700 p-4 rounded flex flex-col md:flex-row md:items-center justify-between mb-2"
            >
              <span className="font-medium">{schedule.date}</span>
              <div className="flex space-x-2">
                <input
                  type="time"
                  className="p-2 rounded bg-gray-600 text-white"
                  value={schedule.start}
                  onChange={(e) => {
                    const newSchedule = [...dynamicSchedule];
                    newSchedule[idx].start = e.target.value;
                    setDynamicSchedule(newSchedule);
                    setHasUnsavedChanges(true);
                  }}
                />
                <input
                  type="time"
                  className="p-2 rounded bg-gray-600 text-white"
                  value={schedule.end}
                  onChange={(e) => {
                    const newSchedule = [...dynamicSchedule];
                    newSchedule[idx].end = e.target.value;
                    setDynamicSchedule(newSchedule);
                    setHasUnsavedChanges(true);
                  }}
                />
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => {
                    setDynamicSchedule(
                      dynamicSchedule.filter((_, i) => i !== idx)
                    );
                    setHasUnsavedChanges(true);
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Toast Container for Notifications */}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar
        />
      </div>

      {/* Show Save Button only if edits exist or schedules are not set */}
      {(hasUnsavedChanges || !schedulesSetInFirebase) && (
        <div className="flex justify-center w-full mt-4">
          <button
            onClick={saveChanges}
            className="bg-blue-500 px-6 py-3 rounded-lg flex items-center justify-center w-full max-w-md shadow-md hover:bg-blue-600 transition text-white font-semibold"
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      )}

      {/* Salon Creation Card */}
      <div className="bg-gradient-to-r from-orange-600 to-gray-800 p-6 rounded-lg text-center mt-6">
        <h2 className="text-2xl font-semibold mb-2">Create a Salon</h2>
        <p className="text-sm mb-4">
          Set up your salon and add stylists to manage all their appointments.
        </p>
        <button
          onClick={() => setShowSalonForm(!showSalonForm)}
          className="bg-blue-500 px-6 py-2 rounded-lg"
        >
          Create Salon
        </button>
      </div>

      {/* Salon Form (Hidden by Default) */}
      {/* Salon Form */}
      {showSalonForm && (
        <div className="bg-gray-800 p-6 mt-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Salon Details</h2>
          <input
            type="text"
            placeholder="Salon Name"
            className="p-2 rounded bg-gray-700 text-white w-full mb-2"
            value={salonDetails.name}
            onChange={(e) =>
              setSalonDetails({ ...salonDetails, name: e.target.value })
            }
          />
          <input
            type="email"
            className="p-2 rounded bg-gray-700 text-white w-full mb-2"
            value={salonDetails.email}
            disabled
          />
          <textarea
            placeholder="About Salon"
            className="p-2 rounded bg-gray-700 text-white w-full mb-2"
            value={salonDetails.about}
            onChange={(e) =>
              setSalonDetails({ ...salonDetails, about: e.target.value })
            }
          ></textarea>
          <input
            type="text"
            placeholder="Address"
            className="p-2 rounded bg-gray-700 text-white w-full mb-2"
            value={salonDetails.address}
            onChange={(e) =>
              setSalonDetails({ ...salonDetails, address: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Country"
            className="p-2 rounded bg-gray-700 text-white w-full mb-2"
            value={salonDetails.country}
            onChange={(e) =>
              setSalonDetails({ ...salonDetails, country: e.target.value })
            }
          />

          <button className="bg-green-500 px-4 py-2 rounded w-full mt-4">
            Save Salon
          </button>
        </div>
      )}
    </div>
  );
};

export default Settings;

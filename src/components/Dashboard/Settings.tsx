import React, { useEffect, useRef, useState } from "react";
import { FaPlus, FaTrash, FaSpinner, FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { db, auth, storage } from "../../utils/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import { getFileFromBlobURL } from "../../api/portfolioAPI";

const Settings = () => {
  const [user, setUser] = useState(auth.currentUser);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [schedulesSetInFirebase, setSchedulesSetInFirebase] = useState(false);

  const [salonExists, setSalonExists] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<string[]>([]); // Store selected files
  const [photosUploading, setPhotosUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [salonId, setSalonId] = useState<string | null>(null);
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
    photos: [], // Store only final uploaded URLs here
  });

  // Handle Auth State
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        fetchSchedules(firebaseUser.uid);
        checkSalonExists(firebaseUser.uid);
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

  // Check if user already has a salon profile
  const checkSalonExists = async (userId: string) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists() && userDoc.data()?.salonId) {
      setSalonExists(true);
      setSalonId(userDoc.data().salonId);
      await fetchSalonDetails(userDoc.data().salonId);
    }
  };

  // Handle salon creation
  const createSalon = async () => {
    if (!salonDetails.name.trim()) {
      toast.error("Salon Name is required!");
      return;
    }

    setLoading(true);
    try {
      // Upload only new photos (blob URLs)
      const uploadedUrls = await uploadNewPhotos();

      // Save salon details in Firestore
      const salonRef = await addDoc(collection(db, "salons"), {
        ...salonDetails,
        photos: uploadedUrls, // Use uploaded photo URLs
        createdBy: user?.uid,
        createdAt: new Date().toISOString(),
      });

      // Add salonId to user profile
      await updateDoc(doc(db, "users", user?.uid!), { salonId: salonRef.id });

      setSalonExists(true);
      toast.success("Salon created successfully!");
    } catch (error) {
      toast.error("Error creating salon. Try again.");
      console.error(error);
    }
    setLoading(false);
  };

  // Fetch salon details
  const fetchSalonDetails = async (salonId: string) => {
    const salonDoc = await getDoc(doc(db, "salons", salonId));
    if (salonDoc.exists()) {
      setSalonDetails(salonDoc.data() as typeof salonDetails);
      setPhotoFiles(salonDoc.data().photos || []);
      setShowSalonForm(true);
    }
  };

  // Handle salon creation/update
  const saveSalon = async () => {
    if (!salonDetails.name.trim()) {
      toast.error("Salon Name is required!");
      return;
    }

    setLoading(true);
    try {
      // Upload only new photos (blob URLs)
      const uploadedUrls = await uploadNewPhotos();

      let updatedSalonId = salonId; // Ensure we store the correct salonId

      if (salonExists && salonId) {
        // **Updating Existing Salon**
        const salonRef = doc(db, "salons", salonId);
        await setDoc(
          salonRef,
          { ...salonDetails, photos: uploadedUrls },
          { merge: true }
        );
        toast.success("Salon updated successfully!");
      } else {
        // **Creating New Salon**
        const newSalonRef = await addDoc(collection(db, "salons"), {
          ...salonDetails,
          photos: uploadedUrls,
          createdBy: user?.uid,
        });

        updatedSalonId = newSalonRef.id; // Update salonId after creation
        setSalonId(updatedSalonId);

        // **Now update the salon document with its own ID**
        await updateDoc(newSalonRef, { salonId: updatedSalonId });

        // Update user profile with `salonId`
        await setDoc(
          doc(db, "users", user?.uid!),
          { salonId: updatedSalonId },
          { merge: true }
        );

        setSalonExists(true);
        toast.success("Salon created successfully!");
      }
    } catch (error) {
      toast.error("Error saving salon. Try again.");
      console.error(error);
    }
    setLoading(false);
  };

  // Upload only new photos to Firebase Storage
  const uploadNewPhotos = async () => {
    const uploadedUrls: string[] = [];

    for (const file of photoFiles) {
      if (file.startsWith("blob:")) {
        // Convert blob URL to File object before upload
        const newFile = await getFileFromBlobURL(
          file,
          `${new Date().getTime()}.png`
        );
        const storageRef = ref(
          storage,
          `salon_photos/${user?.uid}/${newFile.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, newFile);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => {
              console.error("Upload error:", error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              uploadedUrls.push(downloadURL);
              resolve(downloadURL);
            }
          );
        });
      } else {
        // It's already uploaded, keep the same URL
        uploadedUrls.push(file);
      }
    }

    return uploadedUrls;
  };

  // Handle file selection (for preview)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPhotoFiles((prev) => [...prev, ...newPreviews]); // Append instead of replacing
    }
  };

  // Remove selected photo
  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photoFiles[index]); // Revoke blob URL to free memory
    setPhotoFiles(photoFiles.filter((_, i) => i !== index));
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
            <div
              key={day}
              className="flex flex-col bg-gray-700 p-4 rounded-lg justify-center"
            >
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
              {/* Date + Time Inputs */}
              <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between">
                {/* Date (More space on large screens) */}
                <span className="font-medium md:flex-grow">
                  {schedule.date}
                </span>

                {/* Time Inputs (Stacked on small, Space Between on Large) */}
                <div className="flex flex-col md:flex-row w-full md:w-auto md:justify-between md:space-x-4">
                  <input
                    type="time"
                    className="p-2 rounded bg-gray-600 text-white w-full md:w-32"
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
                    className="p-2 rounded bg-gray-600 text-white w-full md:w-32"
                    value={schedule.end}
                    onChange={(e) => {
                      const newSchedule = [...dynamicSchedule];
                      newSchedule[idx].end = e.target.value;
                      setDynamicSchedule(newSchedule);
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>
              </div>

              {/* Delete Button */}
              <button
                className="text-red-500 hover:text-red-700 mt-2 md:mt-0 md:ml-4 self-end md:self-center"
                onClick={() => {
                  setDynamicSchedule(
                    dynamicSchedule.filter((_, i) => i !== idx)
                  );
                  setHasUnsavedChanges(true);
                }}
              >
                <FaTrash size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Toast Container for Notifications */}
      </div>

      {/* Show Save Button only if edits exist or schedules are not set */}
      {(hasUnsavedChanges || !schedulesSetInFirebase) && (
        <div className="flex justify-center w-full mt-4 mb-5">
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

      {!salonExists && (
        <div className="bg-gradient-to-r from-orange-600 to-gray-800 p-6 rounded-lg text-center mt-6">
          <h2 className="text-2xl font-semibold mb-2">Create a Salon</h2>
          <p className="text-sm mb-4">
            Set up your salon and add stylists to manage appointments.
          </p>
          <button
            onClick={() => setShowSalonForm(true)}
            className="bg-blue-500 px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Create Salon
          </button>
        </div>
      )}

      {showSalonForm && (
        <div className="bg-gray-800 p-6 mt-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            {salonExists ? "Edit Salon" : "Salon Details"}
          </h2>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "name",
              "about",
              "address",
              "country",
              "postalCode",
              "state",
              "phone",
            ].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="p-2 rounded bg-gray-700 text-white w-full"
                value={
                  salonDetails[field as keyof typeof salonDetails] as string
                }
                onChange={(e) =>
                  setSalonDetails({ ...salonDetails, [field]: e.target.value })
                }
              />
            ))}
          </div>

          {/* Social Media Section */}
          <h3 className="text-lg font-semibold mt-4 mb-2">
            Social Media Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(salonDetails.socialMedia).map((platform) => (
              <input
                key={platform}
                type="text"
                placeholder={`${
                  platform.charAt(0).toUpperCase() + platform.slice(1)
                } URL`}
                className="p-2 rounded bg-gray-700 text-white w-full"
                value={
                  salonDetails.socialMedia[
                    platform as keyof typeof salonDetails.socialMedia
                  ]
                }
                onChange={(e) =>
                  setSalonDetails({
                    ...salonDetails,
                    socialMedia: {
                      ...salonDetails.socialMedia,
                      [platform]: e.target.value,
                    },
                  })
                }
              />
            ))}
          </div>

          {/* Photo Upload Section */}
          <h3 className="text-lg font-semibold mt-6 mb-2">Business Photos</h3>

          {/* Upload Button & Preview */}
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            {/* Add Image Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center space-x-2 hover:bg-blue-600 transition md:w-auto w-full"
            >
              <FaUpload />
              <span>Add Image</span>
            </button>

            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>

          {/* Preview Selected Photos */}
          {photoFiles.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
              {photoFiles.map((file, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={file}
                    className="w-full h-20 object-cover rounded"
                  />
                  <button
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={saveSalon}
            className="bg-green-500 px-6 py-2 rounded w-full md:w-auto mt-4 hover:bg-green-600 transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Saving...
              </>
            ) : (
              "Save Salon"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Settings;

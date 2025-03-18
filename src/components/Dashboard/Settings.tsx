import React, { useEffect, useRef, useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaSpinner,
  FaUpload,
  FaUserPlus,
  FaUser,
  FaShieldAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { db, auth, storage } from "../../utils/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  setDoc,
  arrayUnion,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import { getFileFromBlobURL } from "../../api/portfolioAPI";
import { set } from "react-datepicker/dist/date_utils";

const Settings = () => {
  const possiblePermissions = [
    "editAppointment",
    "createAppointment",
    "viewAppointment",
    "deleteAppointment",
    "createService",
    "editService",
    "viewService",
    "createCustomer",
    "editCustomer",
    "deleteCustomer",
  ];

  const [user, setUser] = useState(auth.currentUser);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedStylist, setSelectedStylist] = useState<{
    id: string;
    fullName?: string;
    name?: string;
    role: {
      role: string;
      description: string;
      permissions: string[];
    };
    pending: boolean;
  } | null>(null);

  const [newRoleForStylist, setNewRoleForStylist] = useState("");
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [schedulesSetInFirebase, setSchedulesSetInFirebase] = useState(false);
  const [stylists, setStylists] = useState<
    {
      id: string;
      fullName?: string;
      name?: string;
      role: {
        role: string;
        description: string;
        permissions: string[];
      };
      pending: boolean;
    }[]
  >([]);
  const [salonExists, setSalonExists] = useState(false);
  const [showRoleChangeModal, setShowRoleChangeModal] = useState(false);
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

    roles: [
      {
        role: "Stylist",
        description: "Can manage appointments and clients",
        permissions: [
          "createAppointment",
          "editAppointment",
          "viewAppointment",
        ],
      },
      {
        role: "Manager",
        description: "Can manage staff and reports",
        permissions: ["createService", "editService", "viewService"],
      },
      {
        role: "Owner",
        description: "Full access to salon settings",
        permissions: possiblePermissions,
      },
    ],
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

  const [currentPage, setCurrentPage] = useState(0);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [inviteData, setInviteData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    role: {
      role: "",
      description: "",
      permissions: [],
    },
  });
  const [newRole, setNewRole] = useState<{
    role: string;
    description: string;
    permissions: string[];
  }>({
    role: "",
    description: "",
    permissions: [],
  });
  const [roles, setRoles] = useState<any[]>([]);

  const inviteMemberToSalon = async () => {
    if (
      !inviteData.fullName ||
      !inviteData.email ||
      !inviteData.phoneNumber ||
      !inviteData.role
    )
      return;
    setSaving(true);
    try {
      const inviteRef = collection(db, "salonInvite");
      const q = query(
        inviteRef,
        where("salonId", "==", salonId),
        where("email", "==", inviteData.email)
      );
      const existingInvite = await getDocs(q);

      if (!existingInvite.empty) {
        console.log("Invite already sent.");
        setSaving(false);
        return;
      }

      await addDoc(inviteRef, {
        salonId,
        fullName: inviteData.fullName,
        email: inviteData.email,
        phoneNumber: inviteData.phoneNumber,
        role: inviteData.role,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setShowInviteModal(false);
      setInviteData({
        fullName: "",
        email: "",
        phoneNumber: "",
        role: {
          role: "",
          description: "",
          permissions: [],
        },
      });
    } catch (error) {
      console.error("Error sending invitation:", error);
    }
    setSaving(false);
  };
  const togglePermission = (permission: any) => {
    if (!selectedRole) return;
    setSelectedRole((prevRole: any) => {
      const updatedPermissions = prevRole.permissions.includes(permission)
        ? prevRole.permissions.filter((perm: any) => perm !== permission)
        : [...prevRole.permissions, permission];
      return { ...prevRole, permissions: updatedPermissions };
    });
  };

  const togglePermissionNewRole = (permission: any) => {
    setNewRole((prevRole: any) => {
      const updatedPermissions = prevRole.permissions.includes(permission)
        ? prevRole.permissions.filter((perm: any) => perm !== permission)
        : [...prevRole.permissions, permission];
      return { ...prevRole, permissions: updatedPermissions };
    });
  };

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
  useEffect(() => {
    const fetchStylists = async () => {
      const invitedQuery = query(
        collection(db, "salonInvite"),
        where("salonId", "==", salonId)
      );
      const invitedSnapshot = await getDocs(invitedQuery);
      const invitedStylists = invitedSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        pending: true,
      })) as {
        id: string;
        fullName?: string;
        role: { role: string; description: string; permissions: string[] };
        pending: boolean;
      }[];

      const userQuery = query(
        collection(db, "users"),
        where("salonId", "==", salonId)
      );
      const userSnapshot = await getDocs(userQuery);
      const existingStylists = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        pending: false,
      })) as {
        id: string;
        name?: string;
        role: { role: string; description: string; permissions: string[] };
        pending: boolean;
      }[];

      setStylists([...existingStylists, ...invitedStylists]);
    };
    fetchStylists();
    checkSalonExists(user?.uid!);
  }, [salonId, saving]);

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

  const saveRolesToFirestore = async () => {
    if (!selectedRole) return;
    setSaving(true);

    try {
      const salonRef = doc(db, "salons", salonId!);
      const updatedRoles = roles.map((role) =>
        role.role === selectedRole.role ? selectedRole : role
      );
      await updateDoc(salonRef, { roles: updatedRoles });

      // Update roles in 'users' collection
      const userQuery = query(
        collection(db, "users"),
        where("salonId", "==", salonId),
        where("role.role", "==", selectedRole.role)
      );
      const userSnapshot = await getDocs(userQuery);
      userSnapshot.forEach(async (userDoc) => {
        const userRef = doc(db, "users", userDoc.id);
        await updateDoc(userRef, {
          role: updatedRoles.find((role) => role.role === selectedRole.role),
        });
      });

      // Update roles in 'salonInvite' collection
      const inviteQuery = query(
        collection(db, "salonInvite"),
        where("salonId", "==", salonId),
        where("role.role", "==", selectedRole.role)
      );
      const inviteSnapshot = await getDocs(inviteQuery);
      inviteSnapshot.forEach(async (inviteDoc) => {
        const inviteRef = doc(db, "salonInvite", inviteDoc.id);
        await updateDoc(inviteRef, {
          role: updatedRoles.find((role) => role.role === selectedRole.role),
        });
      });

      setRoles(updatedRoles);
      setSelectedRole(null);
    } catch (error) {
      console.error("Error updating role permissions:", error);
    }
    setSaving(false);
  };

  const saveNewRoleToFirestore = async () => {
    if (!newRole.role.trim()) return;
    setSaving(true);
    try {
      const salonRef = doc(db, "salons", salonId!); // Replace with actual salon ID
      await updateDoc(salonRef, {
        roles: arrayUnion(newRole),
      });

      setRoles([...roles, newRole]);
      setShowCreateRoleModal(false);
      setNewRole({ role: "", description: "", permissions: [] });
    } catch (error) {
      console.error("Error saving role:", error);
    }
    setSaving(false);
  };

  // Fetch salon details
  const fetchSalonDetails = async (salonId: string) => {
    const salonDoc = await getDoc(doc(db, "salons", salonId));
    if (salonDoc.exists()) {
      setSalonDetails(salonDoc.data() as typeof salonDetails);
      setPhotoFiles(salonDoc.data().photos || []);
      setShowSalonForm(true);
      setRoles(salonDoc.data().roles || []);
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
          {
            salonId: updatedSalonId,
            role: {
              role: "Owner",
              description: "Full access to salon settings",
              permissions: possiblePermissions,
            },
          },
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

  const changeStylistRole = async () => {
    if (!selectedStylist || !newRoleForStylist) return;
    setSaving(true);
    try {
      const stylistRef = doc(
        db,
        selectedStylist.pending ? "salonInvite" : "users",
        selectedStylist.id
      );
      await updateDoc(stylistRef, {
        role: roles.find((role) => role.role === newRoleForStylist),
      });
      setShowRoleChangeModal(false);
      setNewRoleForStylist("");
    } catch (error) {
      console.error("Error updating stylist role:", error);
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
            className="bg-green-500 px-6 py-2 rounded w-full mt-4 hover:bg-green-600 transition flex items-center justify-center"
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

      {/* Team Management Section */}
      {roles.length > 0 && (
        <div className="mt-6 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Team Management</h2>
          <div className="flex justify-center mb-4 bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setCurrentPage(0)}
              className={`px-6 py-3 w-1/2 text-center rounded-lg transition-transform duration-200 ${
                currentPage === 0
                  ? "bg-blue-500 text-white shadow-lg transform scale-105"
                  : "bg-gray-600 text-gray-300"
              }`}
            >
              Stylists
            </button>
            <button
              onClick={() => setCurrentPage(1)}
              className={`px-6 py-3 w-1/2 text-center rounded-lg transition-transform duration-200 ${
                currentPage === 1
                  ? "bg-blue-500 text-white shadow-lg transform scale-105"
                  : "bg-gray-600 text-gray-300"
              }`}
            >
              Roles
            </button>
          </div>

          {currentPage === 0 ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Stylists</h2>
              <ul>
                {stylists.map((stylist, index) => (
                  <li
                    key={index}
                    className="bg-gray-700 p-4 rounded mb-2 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <FaUser className="mr-3 text-blue-400" />
                      <div>
                        <p className="font-medium">
                          {stylist.fullName || stylist.name}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {stylist.role.role}
                        </p>
                      </div>
                    </div>

                    {!stylist.pending && (
                      <button
                        onClick={() => {
                          setSelectedStylist(stylist);
                          setShowRoleChangeModal(true);
                        }}
                        className="bg-blue-500 px-4 py-2 rounded text-white"
                      >
                        Change Role
                      </button>
                    )}
                    {stylist.pending && (
                      <span className="text-yellow-400">Invite Pending</span>
                    )}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setShowInviteModal(true)}
                className="bg-green-500 px-6 py-2 rounded mt-4 flex items-center"
              >
                <FaUserPlus className="mr-2" /> Invite Stylist
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">Roles</h2>
              <ul>
                {roles.map((role, index) => (
                  <li
                    key={index}
                    className="bg-gray-700 p-4 rounded mb-2 flex items-center cursor-pointer"
                    onClick={() => setSelectedRole(role)}
                  >
                    <FaShieldAlt className="mr-3 text-orange-400" />
                    <div>
                      <p className="font-medium">{role.role}</p>
                      <p className="text-gray-400 text-sm">
                        {role.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setShowCreateRoleModal(true)}
                className="bg-orange-500 px-6 py-2 rounded mt-4 flex items-center"
              >
                <FaPlus className="mr-2" /> Create New Role
              </button>
            </div>
          )}
        </div>
      )}

      {/* Role Permissions Modal */}
      {selectedRole && (
        <Modal
          isOpen={!!selectedRole}
          onRequestClose={() => setSelectedRole(null)}
          className="bg-white p-6 rounded-lg w-96 mx-auto mt-20 max-h-[80vh] overflow-y-auto"
          overlayClassName="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center"
        >
          <h2 className="text-xl font-semibold mb-4">
            {selectedRole.role} Permissions
          </h2>
          <ul>
            {possiblePermissions.map((permission, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-200 p-2 rounded mb-2"
              >
                <span className="text-gray-800">{permission}</span>
                <input
                  type="checkbox"
                  checked={selectedRole.permissions.includes(permission)}
                  onChange={() => togglePermission(permission)}
                  className="h-5 w-5"
                />
              </li>
            ))}
          </ul>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setSelectedRole(null)}
              className="bg-gray-500 px-4 py-2 rounded text-white mr-2"
            >
              Close
            </button>
            <button
              onClick={saveRolesToFirestore}
              className="bg-blue-500 px-6 py-2 rounded text-white flex items-center"
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </Modal>
      )}

      {/* Create Role Modal */}
      <Modal
        isOpen={showCreateRoleModal}
        onRequestClose={() => setShowCreateRoleModal(false)}
        className="bg-white p-6 rounded-lg w-96 mx-auto mt-20 max-h-[80vh] overflow-y-auto"
        overlayClassName="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-semibold mb-4">Create New Role</h2>
        <input
          type="text"
          placeholder="Role Name"
          className="w-full p-2 mb-2 border rounded"
          value={newRole.role}
          onChange={(e) => setNewRole({ ...newRole, role: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          className="w-full p-2 mb-2 border rounded"
          value={newRole.description}
          onChange={(e) =>
            setNewRole({ ...newRole, description: e.target.value })
          }
        />
        <h3 className="text-lg font-semibold mt-4 mb-2">Assign Permissions</h3>
        <ul>
          {possiblePermissions.map((permission, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-200 p-2 rounded mb-2"
            >
              <span className="text-gray-800">{permission}</span>
              <input
                type="checkbox"
                checked={newRole.permissions.includes(permission)}
                onChange={() => togglePermissionNewRole(permission)}
                className="h-5 w-5"
              />
            </li>
          ))}
        </ul>
        <button
          onClick={saveNewRoleToFirestore}
          className="bg-blue-500 px-6 py-2 rounded text-white flex items-center mt-4"
        >
          {saving ? (
            <>
              <FaSpinner className="animate-spin mr-2" /> Saving...
            </>
          ) : (
            <>
              <FaPlus className="mr-2" /> Create Role
            </>
          )}
        </button>
      </Modal>
      {/* Invite Stylist Modal */}
      <Modal
        isOpen={showInviteModal}
        onRequestClose={() => setShowInviteModal(false)}
        className="bg-white p-6 rounded-lg w-96 mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-semibold mb-4">Invite Stylist</h2>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 mb-2 border rounded"
          value={inviteData.fullName}
          onChange={(e) =>
            setInviteData({ ...inviteData, fullName: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-2 border rounded"
          value={inviteData.email}
          onChange={(e) =>
            setInviteData({ ...inviteData, email: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="w-full p-2 mb-2 border rounded"
          value={inviteData.phoneNumber}
          onChange={(e) =>
            setInviteData({ ...inviteData, phoneNumber: e.target.value })
          }
        />
        <select
          className="w-full p-2 mb-2 border rounded"
          value={inviteData.role["role"]}
          onChange={(e) =>
            setInviteData({
              ...inviteData,
              role: roles.filter((le) => le.role == e.target.value)[0],
            })
          }
        >
          <option value="">Select Role</option>
          {roles.map((role, index) => (
            <option key={index} value={role.role}>
              {role.role}
            </option>
          ))}
        </select>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setShowInviteModal(false)}
            className="bg-gray-500 px-4 py-2 rounded text-white mr-2"
          >
            Cancel
          </button>
          <button
            onClick={inviteMemberToSalon}
            className="bg-blue-500 px-4 py-2 rounded text-white flex items-center"
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Sending...
              </>
            ) : (
              "Send Invite"
            )}
          </button>
        </div>
      </Modal>

      {/* Change Stylist Role Modal */}
      <Modal
        isOpen={showRoleChangeModal}
        onRequestClose={() => setShowRoleChangeModal(false)}
        className="bg-white p-6 rounded-lg w-96 mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-semibold mb-4">Change Stylist Role</h2>
        <select
          className="w-full p-2 mb-2 border rounded"
          value={newRoleForStylist}
          onChange={(e) => setNewRoleForStylist(e.target.value)}
        >
          <option value="">Select New Role</option>
          {roles.map((role, index) => (
            <option key={index} value={role.role}>
              {role.role}
            </option>
          ))}
        </select>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setShowRoleChangeModal(false)}
            className="bg-gray-500 px-4 py-2 rounded text-white mr-2"
          >
            Cancel
          </button>
          <button
            onClick={changeStylistRole}
            className="bg-blue-500 px-4 py-2 rounded text-white flex items-center"
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;

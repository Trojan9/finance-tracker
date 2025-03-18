import React, { useEffect, useState } from "react";
import { db, auth } from "../../utils/firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { Service } from "../../api/models/service";
import { Category } from "../../api/models/category";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import ColorPickerModal from "../../components/colorPickerModal"; // Color Picker Component
import {
  FaPalette,
  FaTrash,
  FaEdit,
  FaTimes,
  FaPlus,
  FaSpinner,
} from "react-icons/fa";
import { ToastContainer } from "react-toastify";

const Services = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [salonId, setSalonId] = useState<string | null>(null);
  const [loadingServiceId, setLoadingServiceId] = useState<string | null>(null);
  const [user, setUser] = useState(auth.currentUser);
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    userId: "",
  });
  const [serviceFormData, setServiceFormData] = useState({
    name: "",
    price: 0.0,
    duration: 0,
    description: "",
    salonId: salonId,
    categoryId: "",
    color: "#03A9F4",
    processingTimeEnabled: false,
    processingTimes: { start: 0, processing: 0, end: 0 },
    stylistServiceMap:{}
  });
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editedServices, setEditedServices] = useState<{
    [key: string]: Service;
  }>({});

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );

  // Open Color Picker for a specific service
  const openColorPicker = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setShowColorPicker(true);
  };

  // Update color in state (does not save to Firebase yet)
  const handleColorSelect = (color: string) => {
    if (selectedServiceId) {
      handleEditChange(selectedServiceId, "color", color);
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async(firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setSalonId(userDoc.data()?.salonId);
        }
      } else {
        console.error("User not authenticated.");
        navigate("/login");
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);
  

  useEffect(() => {
    if (!user) return;
    fetchCategories();
    fetchServices();
  }, [user]);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const data = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Category)
      );
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "services"));
      const data = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Service)
      );
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const createCategory = async () => {
    if (!categoryFormData.name.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "categories"), {
        ...categoryFormData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user?.uid,
      });

      setCategoryFormData({ name: "", userId: "" });
      fetchCategories();
    } catch (error) {
      console.error("Error creating category:", error);
    }
    setLoading(false);
  };

  const saveUpdatedService = async (id: string) => {
    const updatedService = services.find((service) => service.id === id);

    if (!updatedService) return; // Ensure the service exists
    setLoading(true);
    setLoadingServiceId(id); // Show progress for this service

    try {
      // Update Firebase with the latest local changes
      await updateDoc(doc(db, "services", id), updatedService);

      // Remove the service from the `editedServices` state after saving
      setEditedServices((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });

      setEditingServiceId(null);
      fetchServices(); // Refresh the UI with latest Firebase data
    } catch (error) {
      console.error("Error updating service:", error);
    }

    setLoading(false);
    setLoadingServiceId(null); // Remove progress indicator
  };

  const deleteCategory = async (id: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "categories", id));

      // Delete associated services
      const serviceQuery = query(
        collection(db, "services"),
        where("categoryId", "==", id)
      );
      const serviceSnapshot = await getDocs(serviceQuery);
      for (const serviceDoc of serviceSnapshot.docs) {
        await deleteDoc(doc(db, "services", serviceDoc.id));
      }

      fetchCategories();
      fetchServices();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
    setLoading(false);
  };

  const createOrUpdateService = async () => {
    if (!serviceFormData.name.trim()) return;
    setLoading(true);
    try {
      if (editingServiceId) {
        await updateDoc(doc(db, "services", editingServiceId), {
          ...serviceFormData,
          updatedAt: new Date().toISOString(),
        });
        setEditingServiceId(null);
      } else {
        await addDoc(collection(db, "services"), {
          ...serviceFormData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          salonIdId: salonId,
          stylistServiceMap :{
            [user?.uid!]: {
              duration: serviceFormData.duration,
              price: serviceFormData.price,
              processingTimeEnabled: serviceFormData.processingTimeEnabled,
              processingTimes: serviceFormData.processingTimes,
            }
          }
        });
      }

      setServiceFormData({
        name: "",
        price: 0.0,
        duration: 0,
        description: "",
        salonId: salonId,
        categoryId: "",
        color: "#03A9F4",
        processingTimeEnabled: false,
        processingTimes: { start: 0, processing: 0, end: 0 },
        stylistServiceMap:{}
      });

      setShowServiceModal(false);
      fetchServices();
    } catch (error) {
      console.error("Error adding/updating service:", error);
    }
    setLoading(false);
  };

  const deleteService = async (id: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "services", id));
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
    setLoading(false);
  };

  const handleEditChange = (id: string, field: keyof Service, value: any) => {
    setEditedServices((prev) => ({
      ...prev,
      [id]: {
        ...prev[id], // Keep previous edits
        [field]: value, // Update the specific field
      },
    }));

    // Update `services` state with edited data
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.id === id
          ? { ...service, [field]: value } // Apply the edit locally
          : service
      )
    );
  };

  const updateService = async (id: string, updatedData: Partial<Service>) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "services", id), updatedData);
      fetchServices();
    } catch (error) {
      console.error("Error updating service:", error);
    }
    setLoading(false);
  };

  return (
    <div className="h-screen overflow-y-auto p-6 md:p-8 bg-gray-900 text-white min-h-screen">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <h1 className="text-2xl font-bold mb-6">Manage Services</h1>
      {/* Create Category Section - Full Width */}
      {/* Create Category Section - Full Width */}
      <div className="mb-6 w-full">
        <h2 className="text-xl font-semibold mb-4 text-center md:text-left">
          Create Category
        </h2>

        <div className="flex flex-col md:flex-row items-center md:items-stretch w-full space-y-3 md:space-y-0 md:space-x-4">
          {/* Input Field */}
          <input
            type="text"
            value={categoryFormData.name}
            onChange={(e) =>
              setCategoryFormData({ ...categoryFormData, name: e.target.value })
            }
            placeholder="Category Name"
            className="p-3 rounded bg-gray-700 text-white flex-grow w-full md:w-auto"
          />

          {/* Add Button */}
          <button
            onClick={createCategory}
            className="bg-blue-500 hover:bg-blue-600 px-5 py-2 text-white font-medium rounded shadow-md transition w-full md:w-auto"
          >
            Add Category
          </button>
        </div>
      </div>

      {/* Categories List */}
      {categories.map((category) => (
        <>  
        {/* //desktop view */}
        <div key={category.id} className="mb-6 p-4 bg-gray-800 rounded-lg">

          <h2 className="text-xl font-bold flex justify-between">
            {category.name}
            <button
              onClick={() => deleteCategory(category.id)}
              className="text-red-400"
            >
              <FaTrash />
            </button>
          </h2>

          {/* Services List - Styled as Input Fields */}
          {services
            .filter((service) => service.categoryId === category.id)
            .map((service) => (
              <div key={service.id} className="bg-gray-700 p-4 rounded-lg mt-4">
                <input
                  type="text"
                  value={service.name}
                  onChange={(e) =>
                    handleEditChange(service.id, "name", e.target.value)
                  }
                  className="w-full p-2 rounded bg-gray-800 text-white mb-2"
                  placeholder="Service Name"
                />
                <input
                  type="number"
                  min="0"
                  value={service.price}
                  onChange={(e) =>
                    handleEditChange(service.id, "price", e.target.value)
                  }
                  className="w-full p-2 rounded bg-gray-800 text-white mb-2"
                  placeholder="Price (€)"
                />
                <input
                  type="number"
                  min="0"
                  value={service.duration}
                  onChange={(e) =>
                    handleEditChange(service.id, "duration", e.target.value)
                  }
                  className="w-full p-2 rounded bg-gray-800 text-white mb-2"
                  placeholder="Duration (min)"
                />
                <textarea
                  value={service.description}
                  onChange={(e) =>
                    handleEditChange(service.id, "description", e.target.value)
                  }
                  className="w-full p-2 rounded bg-gray-800 text-white mb-2"
                  placeholder="Description"
                ></textarea>

                {/* Processing Time Toggle */}
                <div className="flex items-center space-x-2 pb-4">
                  <label className="text-gray-300 text-sm">
                    Processing Time:
                  </label>
                  <input
                    type="checkbox"
                    checked={service.processingTimeEnabled || false} // Ensure default value
                    onChange={(e) => {
                      const isChecked = e.target.checked;

                      console.log("Service ID:", service.id);
                      console.log(
                        "Previous State:",
                        service.processingTimeEnabled
                      );
                      console.log("New Checked State:", isChecked);

                      // Update the service's processingTimeEnabled state
                      setServices((prevServices) =>
                        prevServices.map((s) =>
                          s.id === service.id
                            ? {
                                ...s,
                                processingTimeEnabled: isChecked,
                                processingTimes: isChecked
                                  ? s.processingTimes
                                  : { start: 0, processing: 0, end: 0 }, // Reset if unchecked
                              }
                            : s
                        )
                      );
                    }}
                    className="w-4 h-4 cursor-pointer"
                  />
                </div>

                {/* Processing Time Inputs */}
                {service.processingTimeEnabled && (
                  <>
                    <input
                      type="number"
                      min="0"
                      value={service.processingTimes?.start ?? ""}
                      onChange={(e) =>
                        handleEditChange(service.id, "processingTimes", {
                          start: e.target.value || "0",
                          processing:
                            service.processingTimes?.processing ?? "0",
                          end: service.processingTimes?.end ?? "0",
                        })
                      }
                      className="w-full p-2 rounded bg-gray-800 text-white mb-2"
                      placeholder="Start Processing Time"
                    />

                    <input
                      type="number"
                      min="0"
                      value={service.processingTimes?.processing ?? ""}
                      onChange={(e) =>
                        handleEditChange(service.id, "processingTimes", {
                          start: service.processingTimes?.start ?? "0",
                          processing: e.target.value || "0",
                          end: service.processingTimes?.end ?? "0",
                        })
                      }
                      className="w-full p-2 rounded bg-gray-800 text-white mb-2"
                      placeholder="Processing Time"
                    />

                    <input
                      type="number"
                      min="0"
                      value={service.processingTimes?.end ?? ""}
                      onChange={(e) =>
                        handleEditChange(service.id, "processingTimes", {
                          start: service.processingTimes?.start ?? "0",
                          processing:
                            service.processingTimes?.processing ?? "0",
                          end: e.target.value || "0",
                        })
                      }
                      className="w-full p-2 rounded bg-gray-800 text-white mb-2"
                      placeholder="End Processing Time"
                    />
                  </>
                )}

                {/* Color Picker */}
                <button
                  onClick={() => openColorPicker(service.id)}
                  className="px-4 py-2 rounded flex items-center border border-gray-600"
                  style={{
                    backgroundColor: service.color || "#6B46C1",
                    color: "#fff",
                  }} // Default to purple if no color
                >
                  <FaPalette className="mr-2" />{" "}
                  {service.color ? "Change Color" : "Pick Color"}
                </button>

                {/* Save Update Button */}
                {editedServices[service.id] && (
                  <button
                    onClick={() => saveUpdatedService(service.id)}
                    className="bg-blue-500 px-4 py-2 rounded mt-2 w-full flex items-center justify-center"
                  >
                    {loadingServiceId === service.id ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" /> Updating...
                      </>
                    ) : (
                      "Save Update"
                    )}
                  </button>
                )}

                {/* Delete Service */}
                <button
                  onClick={() => deleteService(service.id)}
                  className="bg-red-500 px-4 py-2 rounded mt-2 w-full flex items-center justify-center"
                >
                  <FaTrash className="mr-2" /> Delete Service
                </button>
              </div>
            ))}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => {
                setServiceFormData({
                  name: "",
                  price: 0.0,
                  duration: 0,
                  description: "",
                  salonId: salonId || "",
                  categoryId: category.id,
                  color: "#03A9F4",
                  processingTimeEnabled: false,
                  processingTimes: { start: 0, processing: 0, end: 0 },
                  stylistServiceMap: {}
                });
                setShowServiceModal(true);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center justify-center w-auto shadow-md hover:bg-green-600 transition"
            >
              <FaPlus className="mr-2" /> Add Service
            </button>
          </div>
        </div>

      </>
      ))}
      {/* Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg relative">
            <button
              onClick={() => setShowServiceModal(false)}
              className="absolute top-2 right-2 text-white text-xl"
            >
              <FaTimes />
            </button>
            <input
              type="text"
              placeholder="Service Name"
              value={serviceFormData.name}
              onChange={(e) =>
                setServiceFormData({ ...serviceFormData, name: e.target.value })
              }
              className="p-2 rounded bg-gray-700 text-white w-full mb-2"
            />
            <input
              type="number"
              placeholder="Price (€)"
              value={serviceFormData.price}
              onChange={(e) =>
                setServiceFormData({
                  ...serviceFormData,
                  price: parseInt(e.target.value),
                })
              }
              className="p-2 rounded bg-gray-700 text-white w-full mb-2"
            />
            <input
              type="number"
              placeholder="Duration (min)"
              value={serviceFormData.duration}
              onChange={(e) =>
                setServiceFormData({
                  ...serviceFormData,
                  duration: parseInt(e.target.value),
                })
              }
              className="p-2 rounded bg-gray-700 text-white w-full mb-2"
            />
            <textarea
              placeholder="Description"
              value={serviceFormData.description}
              onChange={(e) =>
                setServiceFormData({
                  ...serviceFormData,
                  description: e.target.value,
                })
              }
              className="p-2 rounded bg-gray-700 text-white w-full mb-2"
            ></textarea>

            <div className="flex items-center space-x-2">
              <label>Processing Time:</label>
              <input
                type="checkbox"
                checked={serviceFormData.processingTimeEnabled}
                onChange={(e) =>
                  setServiceFormData({
                    ...serviceFormData,
                    processingTimeEnabled: e.target.checked,
                  })
                }
              />
            </div>

            {serviceFormData.processingTimeEnabled && (
              <>
                <div className="mb-2">
                  <label className="block text-gray-300 mb-1">
                    Start Processing Time
                  </label>
                  <input
                    type="number"
                    placeholder="Start Processing Time"
                    value={serviceFormData.processingTimes.start}
                    onChange={(e) =>
                      setServiceFormData({
                        ...serviceFormData,
                        processingTimes: {
                          ...serviceFormData.processingTimes,
                          start: parseInt(e.target.value),
                        },
                      })
                    }
                    className="p-2 rounded bg-gray-700 text-white w-full"
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-gray-300 mb-1">
                    Processing Time
                  </label>
                  <input
                    type="number"
                    placeholder="Processing Time"
                    value={serviceFormData.processingTimes.processing}
                    onChange={(e) =>
                      setServiceFormData({
                        ...serviceFormData,
                        processingTimes: {
                          ...serviceFormData.processingTimes,
                          processing: parseInt(e.target.value),
                        },
                      })
                    }
                    className="p-2 rounded bg-gray-700 text-white w-full"
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-gray-300 mb-1">
                    End Processing Time
                  </label>
                  <input
                    type="number"
                    placeholder="End Processing Time"
                    value={serviceFormData.processingTimes.end}
                    onChange={(e) =>
                      setServiceFormData({
                        ...serviceFormData,
                        processingTimes: {
                          ...serviceFormData.processingTimes,
                          end: parseInt(e.target.value),
                        },
                      })
                    }
                    className="p-2 rounded bg-gray-700 text-white w-full"
                  />
                </div>
              </>
            )}

            <button
              onClick={createOrUpdateService}
              className="bg-green-500 px-4 py-2 rounded mt-4 w-full"
            >
              Save Service
            </button>
          </div>
        </div>
      )}
      {/* // Show Color Picker Modal */}

      {showColorPicker && (
        <ColorPickerModal
          initialColor={services.find((s) => s.id === selectedServiceId)?.color}
          onSelect={handleColorSelect}
          onClose={() => setShowColorPicker(false)}
        />
      )}
    </div>
  );
};

export default Services;

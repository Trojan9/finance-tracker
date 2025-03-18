import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaPhone,
  FaSms,
  FaUserSlash,
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaSpinner,
} from "react-icons/fa";
import { auth, db } from "../../utils/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
  deleteDoc,
  doc,
  getDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import Modal from "react-modal";
import { Client } from "../../api/models/client";
import { onAuthStateChanged } from "firebase/auth";
import { set } from "react-datepicker/dist/date_utils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { c } from "framer-motion/dist/types.d-6pKw1mTI";

// Modal.setAppElement("#root"); // Required for accessibility

const Customers: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [statsPopup, setStatsPopup] = useState<{
    title: string;
    clients: Client[];
  } | null>(null);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [addingClient, setAddingClient] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Client>>({});
  const [user, setUser] = useState(auth.currentUser);
  const [salonId, setSalonId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        console.error("User not authenticated.");
        navigate("/login");
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);
  useEffect(() => {
    if (!user) return;
    checkSalonExists(user!.uid);
  }, [user]);
  // ✅ This runs AFTER `salonId` is updated
useEffect(() => {
    if (salonId) {
        console.log("Updated salonId:", salonId);
        fetchClients(true);
    }
}, [salonId]); // ✅ This will trigger when `salonId` updates
  // Check if user already has a salon profile
  const checkSalonExists = async (userId: string) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists() && userDoc.data()?.salonId) {
        console.log("salonId");
        console.log(userDoc.data().salonId);
      setSalonId(userDoc.data().salonId);
      console.log(salonId)
    //   await fetchClients(userDoc.data().salonId);
    }
  };
  const fetchClients = async (nextPage = false) => {
    setLoading(true);
    console.log("Fetching clients...");
    console.log(salonId);
    const q = query(
      collection(db, "clients"),
      where("salonId", "==", salonId), // ✅ Filter by salon
      orderBy("createdAt", "desc"), // ✅ Ensure "createdAt" is indexed in Firestore
      limit(50)
    );

    // Fetch clients
    const snapshot = await getDocs(q);
    const clientList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Client[];

    console.log(clientList);
    console.log(clientList);

    setClients(nextPage ? [...clients, ...clientList] : clientList);
    setFilteredClients(clientList);
    setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
    setHasMore(snapshot.docs.length === 50);
    setLoading(false);
  };

  const searchClients = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredClients(clients);
    } else {
      setFilteredClients(
        clients.filter(
          (client) =>
            client.name.toLowerCase().includes(query.toLowerCase()) ||
            (client.email &&
              client.email.toLowerCase().includes(query.toLowerCase())) ||
            (client.phone && client.phone.includes(query))
        )
      );
    }
  };

  const fetchClientsByCondition = async (
    field: string,
    condition: any,
    title: string
  ) => {
    const q = query(collection(db, "clients"), where(field, "==", condition));
    const snapshot = await getDocs(q);
    const clientList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Client[];
    setStatsPopup({ title, clients: clientList });
  };

  const handleDeleteClient = async (id: string) => {
    await deleteDoc(doc(db, "clients", id));
    setClients(clients.filter((client) => client.id !== id));
    setFilteredClients(filteredClients.filter((client) => client.id !== id));
    setSelectedClient(null);
  };

  const handleAddClient = async () => {
    if (!salonId) return alert("No salon linked!");
    setAddingClient(true);
    // **Prevent Duplicate Clients in the Salon**
    const q = query(
      collection(db, "clients"),
      where("salonId", "==", salonId),
      where("email", "==", formData.email || "")
    );
    const existingSnapshot = await getDocs(q);
    if (!existingSnapshot.empty) {
      toast.error("Client with this email already exists!");
      setAddingClient(false);
      return;
    }

    const newClient: Client = {
      id: "", // Firestore will generate this
      salonId,
      name: formData.name || "",
      phone: formData.phone || "",
      email: formData.email || "",
      avatar: formData.avatar || "",
      dateOfBirth: formData.dateOfBirth || "",
      gender: formData.gender || "prefer not to say",
      address: formData.address || {},
      appointmentHistory: [],
      preferences: {},
      blocked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "clients"), newClient);
    newClient.id = docRef.id;
    await updateDoc(doc(db, "clients", docRef.id), newClient);
    
    setClients([...clients, newClient]);
    setFilteredClients([...filteredClients, newClient]);
    setShowClientForm(false);
    setAddingClient(false);
    toast.success("Client added successfully!");
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      {/* Header & Search */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clients ({clients.length})</h1>

        {/* Updated Search Section with Wider Input */}
        <div className="relative flex-grow max-w-lg">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => searchClients(e.target.value)}
            className="w-full bg-gray-700 p-3 rounded-md text-white pl-10"
          />
          <FaSearch className="absolute left-3 top-4 text-gray-400" />
        </div>

        <button
          className="bg-blue-500 px-4 py-2 rounded-md shadow-md hover:bg-blue-600 flex items-center"
          onClick={() => setShowClientForm(true)}
        >
          <FaUserPlus className="mr-2" /> Add Client
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          {
            label: "Today's Appointments",
            field: "hasTodayAppointment",
            condition: true,
          },
          {
            label: "Upcoming Birthdays",
            field: "isBirthdaySoon",
            condition: true,
          },
          { label: "New Clients", field: "isNew", condition: true },
          { label: "Blocked Clients", field: "blocked", condition: true },
          { label: "Inactive Clients", field: "inactive", condition: true },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-gray-800 p-4 rounded-md cursor-pointer hover:bg-gray-700"
            onClick={() =>
              fetchClientsByCondition(stat.field, stat.condition, stat.label)
            }
          >
            <h2 className="text-lg font-semibold">{stat.label}</h2>
          </div>
        ))}
      </div>

      {/* Client List */}
      <div className="bg-gray-800 p-4 rounded-md">
        {loading ? (
          <p>Loading...</p>
        ) : (
          filteredClients.map((client) => (
            <div
              key={client.id}
              className="flex justify-between items-center p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-700"
              onClick={() => setSelectedClient(client)}
            >
              <div>
                <h2 className="text-lg">{client.name}</h2>
                <p className="text-gray-400">{client.email || client.phone}</p>
              </div>
              <FaUserSlash
                className={`text-red-500 ${
                  client.blocked ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          ))
        )}
        {hasMore && (
          <button
            onClick={() => fetchClients(true)}
            className="w-full mt-4 text-blue-500"
          >
            Load More
          </button>
        )}
      </div>


      {/* Client Info Modal */}
      {selectedClient && (
        <Modal
          isOpen
          onRequestClose={() => setSelectedClient(null)}
          className="bg-gray-800 p-6 rounded-lg w-96 mx-auto mt-20 text-white"
          overlayClassName="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center"
        >
          <h2 className="text-xl font-bold">{selectedClient.name}</h2>
          <p className="text-gray-400">
            {selectedClient.email || selectedClient.phone}
          </p>
          <div className="flex gap-4 mt-4">
            <button className="bg-red-500 p-2 rounded-full">
              <FaUserSlash />
            </button>
            <button className="bg-green-500 p-2 rounded-full">
              <FaPhone />
            </button>
            <button className="bg-blue-500 p-2 rounded-full">
              <FaSms />
            </button>
          </div>
          <div className="mt-4">
            <p>Upcoming Appointments: 3</p>
            <p>Completed: 10</p>
            <p>No-Shows: 2</p>
            <p>Last Visit: 2 weeks ago</p>
          </div>
          <div className="flex gap-4 mt-4">
            <button className="bg-yellow-500 px-4 py-2 rounded-md">
              <FaEdit /> Edit
            </button>
            <button
              className="bg-red-500 px-4 py-2 rounded-md"
              onClick={() => handleDeleteClient(selectedClient.id)}
            >
              <FaTrash /> Delete
            </button>
          </div>
        </Modal>
      )}

      {/* Stats Popup */}
      {statsPopup && (
        <Modal
          isOpen
          onRequestClose={() => setStatsPopup(null)}
          className="bg-blue-900 p-6 rounded-lg w-96 mx-auto mt-20 text-white"
          overlayClassName="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center"
        >
          <h2 className="text-xl font-bold">{statsPopup.title}</h2>
          {statsPopup.clients.map((client) => (
            <p key={client.id}>{client.name}</p>
          ))}
        </Modal>
      )}

      {/* Add Client Form Modal */}

      {showClientForm && (
        <Modal
          isOpen
          onRequestClose={() => setShowClientForm(false)}
          className="bg-blue-900 p-6 rounded-lg w-96 mx-auto mt-20 text-white"
          overlayClassName="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center"
        >
          <h2 className="text-xl font-bold mb-4">Add New Client</h2>

          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 bg-gray-800 text-white rounded-md mt-2"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <input
            type="text"
            placeholder="Email"
            className="w-full p-2 bg-gray-800 text-white rounded-md mt-2"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Phone"
            className="w-full p-2 bg-gray-800 text-white rounded-md mt-2"
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />

          {/* Gender Selection */}
          <select
            className="w-full p-2 bg-gray-800 text-white rounded-md mt-2"
            onChange={(e) =>
              setFormData({
                ...formData,
                gender: e.target.value as
                  | "male"
                  | "female"
                  | "non-binary"
                  | "prefer not to say",
              })
            }
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-Binary</option>
            <option value="prefer not to say">Prefer not to say</option>
          </select>

          {/* Date of Birth Input */}
          <input
            type="date"
            placeholder="Date of Birth"
            className="w-full p-2 bg-gray-800 text-white rounded-md mt-2"
            onChange={(e) =>
              setFormData({ ...formData, dateOfBirth: e.target.value })
            }
          />

          <button
            className="bg-green-500 px-4 py-2 rounded-md mt-4 w-full flex items-center justify-center"
            onClick={handleAddClient}
            disabled={addingClient}
          >
            {addingClient ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </Modal>
      )}
    </div>
  );
};

export default Customers;

import React, { useState, useEffect, useRef } from "react";
import { FaCalendarAlt, FaPlus, FaFilter, FaSpinner } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../../utils/firebaseConfig";
import { Client } from "../../../api/models/client";
import { Service } from "../../../api/models/service";
import Modal from "react-modal";
import { Appointment } from "../../../api/models/appointments";
import { toast, ToastContainer } from "react-toastify";
import AppointmentDetails from "./AppointmentDetails";
import { useDrag } from "react-dnd";
import {AppointmentBlock, RescheduleModal, StylistColumn, TimeSlot, WeekDayColumn, handleDrop, handleRescheduleConfirm } from "./timeline";

const Appointments: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [stylists, setStylists] = useState<
    {
      id: string;
      name?: string;
      role: { role: string; description: string; permissions: string[] };
    }[]
  >([]);
  const [filteredStylists, setFilteredStylists] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState("day");
  const [user, setUser] = useState<any>(null);
  const [salonId, setSalonId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null!);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedStylist, setSelectedStylist] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [rescheduleData, setRescheduleData] = useState<{
    appointmentId: string;
    newTime: string;
    newStylistId?: string;
  } | null>(null); // Stores appointment being rescheduled
  
  const [showRescheduleModal, setShowRescheduleModal] = useState(false); // Controls modal visibility
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setSalonId(userDoc.data()?.salonId);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (salonId) {
      fetchAppointments();
      fetchServices();
      fetchStylists();
    }
  }, [selectedDate, salonId]);

  const fetchStylists = async () => {
    const userQuery = query(
      collection(db, "users"),
      where("salonId", "==", salonId)
    );
    const userSnapshot = await getDocs(userQuery);
    const existingStylists = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as {
      id: string;
      name?: string;
      role: { role: string; description: string; permissions: string[] };
    }[];

    setStylists([...existingStylists]);
  };

  useEffect(() => {
    const fetchClients = async () => {
      const q = query(
        collection(db, "clients"),
        where("salonId", "==", salonId)
      );
      const snapshot = await getDocs(q);
      setClients(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Client[]
      );
    };

    if (salonId) {
      fetchClients();
    }
  }, [salonId]);

  const fetchAppointments = async () => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    const q = query(
      collection(db, "appointments"),
      where("appointmentDate", "==", formattedDate)
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setAppointments(data);
  };

  const handleAddAppointment = async () => {
    if (
      !selectedClient ||
      !selectedStylist ||
      !selectedService ||
      !appointmentDate ||
      !appointmentTime
    ) {
      toast.error("Please fill all fields!");
      return;
    }

    setLoading(true);

    // Get Service & Stylist Data
    const selectedServiceData = services.find((s) => s.id === selectedService);
    const selectedStylistData = stylists.find(
      (stylist) => stylist.id === selectedStylist
    );

    if (!selectedServiceData || !selectedStylistData) {
      toast.error("Invalid stylist or service selected!");
      setLoading(false);
      return;
    }

    // Convert appointment time to ISO format
    const startTimestamp = new Date(`${appointmentDate}T${appointmentTime}:00`);
    const endTimestamp = new Date(
      new Date(startTimestamp).getTime() + selectedServiceData.duration * 60000
    );

    // Build appointment data
    const newAppointment: Appointment = {
      id: "", // Firestore generates this
      salonId: salonId || "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Get user timezone
      price: selectedServiceData.price,
      duration: selectedServiceData.duration,
      appointmentDate,
      appointmentType: "service", // Could be "block" if it's a blocked time slot
      serviceStylistAppointments: [
        {
          stylist: {
            id: selectedStylistData.id,
            name: selectedStylistData.name!,
          },
          service: {
            id: selectedServiceData.id,
            name: selectedServiceData.name,
            price: selectedServiceData.price,
            duration: selectedServiceData.duration,
            color: selectedServiceData.color,
          },
          startTimestamp,
          endTimestamp,
        },
      ],
      client: {
        id: selectedClient,
        name: clients.find((c) => c.id === selectedClient)?.name!, // Get client
        phone: clients.find((c) => c.id === selectedClient)?.phone!, // Get client phone
        email: clients.find((c) => c.id === selectedClient)?.email!, // Get client email
      }, // Get client details
      status: "scheduled",
      notes: "",
      createdAt: new Date(),

      updatedAt: new Date(),
    };

    try {
      const docRef = await addDoc(
        collection(db, "appointments"),
        newAppointment
      );
      setShowAppointmentForm(false);
      toast.success("Appointment added successfully!");
    } catch (error) {
      console.error("Error adding appointment:", error);
      toast.error("Failed to add appointment.");
    } finally {
      setLoading(false);
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

  const TIMELINE_TOP_OFFSET = 80; // Adjust this to match your actual top padding

  const getCurrentTimePosition = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return hours * 90 + minutes * 1.5 + TIMELINE_TOP_OFFSET;
  };

  useEffect(() => {
    scrollToCurrentTime();
    const interval = setInterval(scrollToCurrentTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const scrollToCurrentTime = () => {
    if (timelineRef.current) {
      const position = getCurrentTimePosition();
      timelineRef.current.scrollTop =
        position - timelineRef.current.clientHeight / 2;
    }
  };

  const visibleStylists = filteredStylists.length
    ? stylists.filter((s) => filteredStylists.includes(s.id))
    : stylists;
  const timelineWidth = visibleStylists.length <= 3 ? "w-full" : "w-[200%]";

  const TIMELINE_HOUR_HEIGHT = 90; // Each hour represents 90px

  const getAppointmentPosition = (startTimestamp: any, duration: number) => {
    let startTime = startTimestamp instanceof Date
      ? startTimestamp
      : new Date(startTimestamp.seconds * 1000);
  
    const startHours = startTime.getHours();
    const startMinutes = startTime.getMinutes();
    const TIMELINE_HOUR_HEIGHT = 90; // Each hour = 90px
    const TIMELINE_TOP_OFFSET = 0; // Adjust this if needed
  
    const topPosition =
      (startHours * TIMELINE_HOUR_HEIGHT) +
      ((startMinutes / 60) * TIMELINE_HOUR_HEIGHT) +
      TIMELINE_TOP_OFFSET+25;
  

    console.log("startTime:", startTime.toISOString());
    console.log("startHours:", startHours);
    console.log("startMinutes:", startMinutes);
    console.log("Calculated Top Position:", topPosition);
  
    return {
      top: topPosition,
      height: (duration / 60) * TIMELINE_HOUR_HEIGHT,
    };
  };

  const getAppointmentWeekPosition = (startTimestamp: any, duration: number) => {
    console.log(startTimestamp);
    const startTime = new Date(startTimestamp.seconds * 1000);
    const startHours = startTime.getHours();
    const startMinutes = startTime.getMinutes();
    console.log(startHours, startMinutes);
    console.log(duration);
    console.log("srartHours", startHours);
    console.log("startTime", startTime);
    return {
      top:
        startHours * TIMELINE_HOUR_HEIGHT +
        (startMinutes / 60) * TIMELINE_HOUR_HEIGHT +
        TIMELINE_TOP_OFFSET,
      height: (duration / 60) * TIMELINE_HOUR_HEIGHT,
    };
  };
  
  

  const stackAppointments = (appointments: any[]) => {
    let sortedAppointments = [...appointments].sort(
      (a, b) =>
        new Date(a.startTimestamp.seconds * 1000).getTime() -
        new Date(b.startTimestamp.seconds * 1000).getTime()
    );

    let processedAppointments: any[] = [];

    return sortedAppointments.map((appt) => {
      let apptStart = new Date(appt.startTimestamp.seconds * 1000);
      let apptEnd = new Date(appt.endTimestamp.seconds * 1000);

      // Find all previous appointments that overlap with this one
      let overlappingAppointments = processedAppointments.filter((prevAppt) => {
        let prevStart = new Date(prevAppt.startTimestamp.seconds * 1000);
        let prevEnd = new Date(prevAppt.endTimestamp.seconds * 1000);
        return apptStart >= prevStart && apptStart < prevEnd;
      });
      // Determine stack level
      if (overlappingAppointments.length === 0) {
        appt.stackLevel = 0; // No overlap, start at 0
      } else {
        let maxStackLevel = Math.max(
          ...overlappingAppointments.map((o) => o.stackLevel)
        );
        appt.stackLevel = maxStackLevel + 1; // Set stack level to highest + 1
      }

      processedAppointments.push(appt); // Store processed appointment

      return appt;
    });
  };
  return (
    <div className="h-screen bg-gray-900 text-white p-6">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="sticky top-0 z-30 bg-gray-900 py-2 flex justify-between px-4">
          <div className="relative">
            <FaCalendarAlt className="text-xl text-blue-500 absolute left-3 top-2.5" />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => date && setSelectedDate(date)}
              className="bg-gray-700 text-white p-2 rounded-md pl-10"
              popperPlacement="top-start"
            />
          </div>
        </div>

        {/* View Selector */}
        <div className="space-x-2">
          {["day", "week", "month"].map((mode) => (
            <button
              key={mode}
              className={`px-4 py-2 rounded-md ${
                viewMode === mode
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
              onClick={() => setViewMode(mode)}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
        {/* Add Appointment */}
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center bg-blue-500 px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
          >
            <FaPlus className="mr-2" /> Add Appointment
          </button>

          {showAddMenu && (
            <div className="absolute top-12 right-0 bg-gray-800 p-4 rounded shadow-lg w-48 z-50">
              <button className="block w-full text-left p-2 hover:bg-gray-700 rounded">
                Block Time
              </button>
              <button
                className="block w-full text-left p-2 hover:bg-gray-700 rounded"
                onClick={() => {
                  setShowAddMenu(false);
                  setShowAppointmentForm(true); // Show modal
                }}
              >
                Create Appointment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      {/* Day View */}
      {viewMode === "day" && (
        <div
          ref={timelineRef}
          className="relative bg-gray-800 p-4 rounded-lg shadow-lg overflow-auto h-[600px]"
        >

          {/* Current Time Indicator */}
          <div
            className="absolute left-0 w-full h-0.5 bg-red-500"
            style={{ top: `${getCurrentTimePosition()}px` }}
          >
            <span className="absolute left-2 -top-3 bg-red-500 text-white text-xs px-1 rounded">
              Now
            </span>
          </div>

          {/* Timeline Grid */}
          <div className="flex">
            {/* Time Column */}
            <div className="w-16 pt-7 border-r border-gray-600 text-gray-400">

              {Array.from({ length: 24 }).map((_, index) => (
                <TimeSlot key={index} handleDrop={handleDrop} time={`${index}:00`} setRescheduleData= {setRescheduleData} setShowRescheduleModal={setShowRescheduleModal} timelineRef={timelineRef}/>
              ))}
            </div>

{/* Stylist Columns */}
<div className={`flex space-x-4 ${timelineWidth} overflow-x-auto`}>
  {visibleStylists.map((stylist) => {
    let stylistAppointments = appointments
      .filter((appt) => appt.serviceStylistAppointments.some((s: any) => s.stylist.id === stylist.id))
      .flatMap((appt) =>
        appt.serviceStylistAppointments.map((serviceAppt: any) => ({
          ...serviceAppt,
          client: appt.client,
          status: appt.status,
          notes: appt.notes,
          appointmentId: appt.id,
          price: serviceAppt.service?.price || appt.price,
          duration: serviceAppt.service?.duration || appt.duration,
          appointmentDate: appt.appointmentDate,
          salonId: appt.salonId,
          createdAt: appt.createdAt,
          updatedAt: appt.updatedAt,
        }))
      );

    stylistAppointments = stackAppointments(stylistAppointments);

    return (
      <StylistColumn
        key={stylist.id}
        stylist={stylist}
        appointments={stylistAppointments}
        getAppointmentPosition={getAppointmentPosition}
        setRescheduleData={setRescheduleData}
        setShowRescheduleModal={setShowRescheduleModal}
        handleDrop={handleDrop}
        timelineRef={timelineRef}
        setSelectedAppointment={setSelectedAppointment}
      />
    );
  })}

    {/* Show Appointment Details Modal if an appointment is selected */}
    {selectedAppointment && (
    <AppointmentDetails
      appointment={selectedAppointment}
      onClose={() => setSelectedAppointment(null)}
    />
  )}
</div>




          </div>
          {/* Show Reschedule Confirmation Modal */}
     
        </div>
      )}
      {viewMode === "week" && (
        <WeekView
          selectedDate={selectedDate}
          salonId={salonId}
          appointments={appointments}
          getAppointmentWeekPosition={getAppointmentWeekPosition}
          stackAppointments={stackAppointments}
        />
      )}
      {viewMode === "month" && (
        <MonthView
          selectedDate={selectedDate}
          salonId={salonId}
          appointments={appointments}
          visibleStylists={visibleStylists}
          stackAppointments={stackAppointments}
          getAppointmentPosition={getAppointmentPosition}
        />
      )}

      {showAppointmentForm && (
        <Modal
          isOpen
          onRequestClose={() => setShowAppointmentForm(false)}
          className="bg-gray-900 p-6 rounded-lg w-96 mx-auto mt-20 text-white"
          overlayClassName="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center"
        >
          <h2 className="text-xl font-bold mb-4">Create Appointment</h2>

          {/* Client Selection */}
          <select
            className="w-full p-2 bg-gray-800 text-white rounded-md mt-2"
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value="">Select Client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>

          {/* Stylist Selection */}
          <select
            className="w-full p-2 bg-gray-800 text-white rounded-md mt-2"
            onChange={(e) => setSelectedStylist(e.target.value)}
          >
            <option value="">Select Stylist</option>
            {stylists.map((stylist) => (
              <option key={stylist.id} value={stylist.id}>
                {stylist.name}
              </option>
            ))}
          </select>

          {/* Service Selection */}
          <select
            className="w-full p-2 bg-gray-800 text-white rounded-md mt-2"
            onChange={(e) => setSelectedService(e.target.value)}
          >
            <option value="">Select Service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>

          {/* Date & Time Selection */}
          <input
            type="date"
            className="w-full p-2 bg-gray-800 text-white rounded-md mt-2"
            onChange={(e) => setAppointmentDate(e.target.value)}
          />

          <input
            type="time"
            className="w-full p-2 bg-gray-800 text-white rounded-md mt-2"
            onChange={(e) => setAppointmentTime(e.target.value)}
          />

          <button
            className="bg-green-500 px-4 py-2 rounded-md mt-4 w-full flex items-center justify-center"
            onClick={handleAddAppointment}
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Saving...
              </>
            ) : (
              "Save Appointment"
            )}
          </button>
        </Modal>
      )}
       {showRescheduleModal && (
        <RescheduleModal
          rescheduleData={rescheduleData}
          onClose={() => setShowRescheduleModal(false)}
          onConfirm={handleRescheduleConfirm}
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </div>
  );
};

export default Appointments;

const WeekView = ({
  selectedDate,
  salonId,
  appointments,
  stackAppointments,
  getAppointmentWeekPosition,
}: any) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [rescheduleData, setRescheduleData] = useState<any>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  return (
    <div className="relative bg-gray-800 rounded-lg shadow-lg">
      {/* Scrollable Timeline Grid */}
      <div className="flex h-[600px] overflow-auto" ref={timelineRef}>
        {/* Sticky Time Column */}
        <div className="sticky left-0 z-10 bg-gray-800 w-16">
          <div className="border-r border-gray-600 text-center text-sm p-2 w-16 bg-gray-800">
            Time
          </div>
          {Array.from({ length: 24 }).map((_, index) => (
            <div
              key={index}
              className="h-[90px] flex items-center justify-center text-gray-400"
            >
              {index}:00
            </div>
          ))}
        </div>

        {/* Scrollable Week Section */}
        <div className="grid grid-cols-7 flex-1">
          {daysOfWeek.map((day, dayIndex) => {
            const dayDate = new Date(
              startOfWeek.getTime() + dayIndex * 86400000
            )
              .toISOString()
              .split("T")[0];

            let dayAppointments = appointments
              .filter((appt:any) => appt.appointmentDate === dayDate)
              .flatMap((appt:any) =>
                appt.serviceStylistAppointments.map((serviceAppt: any) => ({
                  ...serviceAppt,
                  client: appt.client,
                  status: appt.status,
                  notes: appt.notes,
                  id: appt.id,
                  appointmentDate: appt.appointmentDate,
                  createdAt: appt.createdAt,
                  updatedAt: appt.updatedAt,
                  salonId: appt.salonId,
                }))
              );

            dayAppointments = stackAppointments(dayAppointments);


            return (
              <WeekDayColumn
                key={dayIndex}
                day={day}
                dayIndex={dayIndex}
                dayAppointments={dayAppointments}
                getAppointmentWeekPosition={getAppointmentWeekPosition}
                handleDrop={handleDrop}
                setRescheduleData={setRescheduleData}
                setShowRescheduleModal={setShowRescheduleModal}
                timelineRef={timelineRef}
                setSelectedAppointment={setSelectedAppointment}
              />
            );
          })}
        </div>
      </div>

      {/* Show Reschedule Modal */}
      {showRescheduleModal && (
        <RescheduleModal
          rescheduleData={rescheduleData}
          onClose={() => setShowRescheduleModal(false)}
          onConfirm={() => {
            console.log("Reschedule confirmed:", rescheduleData);
            setShowRescheduleModal(false);
          }}
        />
      )}

      {/* Show Appointment Details Modal */}
      {selectedAppointment && (
        <AppointmentDetails
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
};


const MonthView = ({
  selectedDate,
  salonId,
  appointments,
  visibleStylists,
  stackAppointments,
  getAppointmentPosition,
}: {
  selectedDate: Date;
  salonId: string | null;
  appointments: Appointment[];
  visibleStylists: {
    id: string;
    name?: string;
    role: {
      role: string;
      description: string;
      permissions: string[];
    };
  }[];
  stackAppointments: (appointments: any[]) => any[];
  getAppointmentPosition: (startTimestamp: any, duration: number) => { top: number; height: number };
}) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentMonth = selectedDate.getMonth();
  const firstDayOfMonth = new Date(
    selectedDate.getFullYear(),
    currentMonth,
    1
  ).getDay();
  const daysInMonth = new Date(
    selectedDate.getFullYear(),
    currentMonth + 1,
    0
  ).getDate();
  let daysArray = Array(firstDayOfMonth)
    .fill(null)
    .concat([...Array(daysInMonth).keys()].map((i) => i + 1));

  // State for managing modals
  const [selectedDayAppointments, setSelectedDayAppointments] = useState<
    Appointment[] | null
  >(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  return (
    <div className="grid grid-cols-7 gap-1 p-2">
      {/* Weekday Headers */}
      {daysOfWeek.map((day) => (
        <div key={day} className="text-center font-bold text-gray-300">
          {day}
        </div>
      ))}

      {/* Calendar Grid */}
      {daysArray.map((day, index) => {
        const dayDate = `${selectedDate.getFullYear()}-${String(
          currentMonth + 1
        ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        // Filter appointments for this day
        const dayAppointments = appointments.filter(
          (appt) => appt.appointmentDate === dayDate
        );

        return (
          <div
            key={index}
            className="border border-gray-600 p-2 h-24 bg-gray-800 relative"
          >
            {day && (
              <span className="absolute top-1 left-1 text-sm font-bold">{day}</span>
            )}

            {/* Show up to 2 appointments */}
            {dayAppointments.slice(0, 2).map((appt) =>
              appt.serviceStylistAppointments.map((serviceAppt) => (
                <div
                  key={`${appt.id}-${serviceAppt.service?.id}`}
                  className="bg-blue-500 text-xs rounded p-1 mt-1 cursor-pointer"
                  onClick={() => setSelectedAppointment(appt)} // Open details
                >
                  {new Date((serviceAppt.startTimestamp as any).seconds *1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" "}
                  {serviceAppt.service?.name}
                </div>
              ))
            )}

            {/* Show "X more..." link if more than 2 appointments */}
            {dayAppointments.length > 2 && (
              <div
                className="text-sm text-blue-400 cursor-pointer mt-1"
                onClick={() => setSelectedDayAppointments(dayAppointments)}
              >
                and {dayAppointments.length - 2} more...
              </div>
            )}
          </div>
        );
      })}



      {/* Modal for displaying all appointments of a day */}
      {selectedDayAppointments && (
  <div className="fixed inset-0 bg-transparent bg-opacity-500 flex items-center justify-center">
    <div className="bg-gray-500 p-6 rounded-lg w-96 max-h-[80vh] overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">
          {selectedDayAppointments.length} Appointments
        </h2>
        <button onClick={() => setSelectedDayAppointments(null)} className="text-gray-600">
          ✕
        </button>
      </div>

      <div className="overflow-y-auto max-h-[60vh]">
        {selectedDayAppointments.map((appt) =>
          appt.serviceStylistAppointments.map((serviceAppt) => (
            <div
              key={`${appt.id}-${serviceAppt.service?.id}`}
              className="p-2 rounded text-white cursor-pointer"
              style={{ backgroundColor: serviceAppt.service?.color || "#3b82f6" }}
              onClick={() => {
                setSelectedAppointment(appt);
                setSelectedDayAppointments(null);
              }}
            >
              {new Date((serviceAppt.startTimestamp as any).seconds * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" "}
              {serviceAppt.service?.name}
            </div>
          ))
        )}
      </div>
    </div>
  </div>
)}


      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <AppointmentDetails
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
};




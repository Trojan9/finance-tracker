import { toast } from "react-toastify";
import React, { useState, useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../utils/firebaseConfig";
import { c } from "framer-motion/dist/types.d-6pKw1mTI";
import { FaSpinner } from "react-icons/fa";

export const AppointmentBlock = ({ 
    serviceAppt, 
    getAppointmentPosition, 
    setSelectedAppointment 
  }: any) => {
      const { top, height } = getAppointmentPosition(
          serviceAppt.startTimestamp,
          serviceAppt.service?.duration || 60
      );
  
      const maxWidth = 100;
      const overlapOffset = 15;
      const adjustedWidth = maxWidth - serviceAppt.stackLevel * overlapOffset;
  
      const [{ isDragging }, drag] = useDrag(() => ({
          type: "APPOINTMENT",
          item: {
              appointmentId: serviceAppt.appointmentId,
              stylistId: serviceAppt.stylist.id,
              service: serviceAppt.service,
              client: serviceAppt.client,
              startTimestamp: serviceAppt.startTimestamp,
              appointmentDate: serviceAppt.appointmentDate,
          },
          collect: (monitor) => ({
              isDragging: !!monitor.isDragging(),
          }),
      }));
  
      const ref = useRef<HTMLDivElement>(null); 
      drag(ref); 
  
      return (
          <div
              key={`${serviceAppt.stylist.id}-${serviceAppt.service?.id}`}
              className={`absolute p-2 rounded-md text-sm font-semibold text-white shadow-md ${
                  isDragging ? "opacity-50" : ""
              }`}
              ref={ref}
              style={{
                  top: `${top}px`,
                  height: `${height}px`,
                  left: `calc(100% - ${adjustedWidth}%)`,
                  width: `${adjustedWidth}%`,
                  backgroundColor: serviceAppt.service?.color || "#3b82f6",
              }}
              onClick={() => {
                  if (typeof setSelectedAppointment === "function") {
                      setSelectedAppointment({
                          id: serviceAppt.appointmentId,
                          timezone: "UTC",
                          price: serviceAppt.service?.price || 0,
                          duration: serviceAppt.service?.duration || 0,
                          appointmentDate: serviceAppt.appointmentDate,
                          appointmentType: "service",
                          serviceStylistAppointments: [
                              {
                                  stylist: {
                                      id: serviceAppt.stylist.id,
                                      name: serviceAppt.stylist.name,
                                  },
                                  service: serviceAppt.service
                                      ? {
                                            id: serviceAppt.service.id,
                                            name: serviceAppt.service.name,
                                            price: serviceAppt.service.price,
                                            duration: serviceAppt.service.duration,
                                            color: serviceAppt.service.color,
                                        }
                                      : null,
                                  startTimestamp: serviceAppt.startTimestamp,
                                  endTimestamp: serviceAppt.endTimestamp,
                              },
                          ],
                          client: serviceAppt.client || undefined,
                          status: serviceAppt.status,
                          notes: serviceAppt.notes || "",
                          createdAt: serviceAppt.createdAt || new Date(),
                          updatedAt: serviceAppt.updatedAt || new Date(),
                          salonId: serviceAppt.salonId,
                      });
                  } else {
                      console.error("setSelectedAppointment is not a function");
                  }
              }}
          >
              {serviceAppt.client?.name || "No Client"} - {serviceAppt.service?.name}
          </div>
      );
  };
  
  


  export const TimeSlot = ({ handleDrop, time, setRescheduleData, setShowRescheduleModal, timelineRef }: { 
    handleDrop: any; 
    time: string;
    setShowRescheduleModal: any; 
    setRescheduleData: any; 
    timelineRef: React.RefObject<HTMLDivElement>; // ✅ Accept timelineRef
  }) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: "APPOINTMENT",
      drop: (item, monitor) => {
        const offset = monitor.getClientOffset(); // Get drop position on screen
        if (!offset) return;
  
        // Get dropY relative to the timeline container
        const timelineTop = timelineRef.current?.getBoundingClientRect().top || 0;
        const dropY = offset.y - timelineTop;
  
        // Pass dropY to handleDrop
        handleDrop(item, dropY, setRescheduleData, setShowRescheduleModal);

      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }));
  
    const ref = useRef<HTMLDivElement>(null);
    drop(ref);
    return (
        <div
          ref={ref}
          className={`border-b border-gray-600 h-[90px] text-center ${
            isOver ? "bg-gray-500" : ""
          }`}
        >
          {time}
        </div>
      ); 

  };
  

  

  
  export const handleDrop = (appointment: any, dropY: number,setRescheduleData:any,setShowRescheduleModal:any, newStylistId?: string,day?:any) => {
    const TIMELINE_HOUR_HEIGHT = 90; // Each hour is 90px in height
    const minutesPerPixel = 60 / TIMELINE_HOUR_HEIGHT; // Calculate minutes per pixel
  
    // Convert `dropY` position to the exact time
    const totalMinutes = (dropY / TIMELINE_HOUR_HEIGHT) * 60;
    const hours = Math.trunc(totalMinutes / 60)-1;
    const minutes = Math.round(totalMinutes % 60); // Preserve minutes instead of rounding to hour
  
    console.log(`Reschedule to ${hours}:${minutes}`);
    // Construct the new timestamp
    const today = new Date();
    const newTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
  
    // Show reschedule modal with accurate time
    setRescheduleData({
      appointment,
      newTime, // Now contains exact HH:MM
      newStylistId,
    });
    setShowRescheduleModal(true);
  };
   

  export const RescheduleModal = ({ rescheduleData, onClose, onConfirm,loading,setLoading }: any) => {
    if (!rescheduleData) return null;

    console.log(rescheduleData);
  
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex justify-center items-center">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-white border border-gray-700">
          <h2 className="text-lg font-bold mb-2">Reschedule Appointment</h2>
          <p className="text-gray-300">Do you want to move this appointment?</p>
  

          {/* Appointment Details */}
          {/* {rescheduleData.appointment?.serviceStylistAppointments.map((appt:any) => { */}

          <div className="mt-4 p-3 bg-blue-600 rounded-md text-white">
            {rescheduleData.appointment?.client?.name || "Unknown Client"} -{" "}
            {rescheduleData.appointment?.service?.name || "Service"}
          </div>

        
          {/* New Time & Stylist */}
          <div className="mt-4">
            <p>
              <span className="font-semibold text-gray-400">New Time: </span>
              {new Date(rescheduleData.newTime).toLocaleTimeString()}
            </p>
            {rescheduleData.newStylistId && (
              <p>
                <span className="font-semibold text-gray-400">New Stylist: </span>
                {rescheduleData.newStylistName || rescheduleData.newStylistId}
              </p>
            )}
          </div>
  
          {/* Buttons */}
          <div className="mt-4 flex gap-2">
            <button className="bg-red-500 text-white px-4 py-2 rounded-md w-full" onClick={onClose}>
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-400 transition-all"
              onClick={() => onConfirm(rescheduleData)}
            disabled={loading} // Disable while loading
          >
            {loading ? <FaSpinner className="animate-spin mr-2" /> : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    );
  };
  

 export const handleRescheduleConfirm = async (data: any,setLoading:any,setShowRescheduleModal:any) => {
    const { appointmentId, previousTime, newTime, newStylistId } = data;
  
    // Convert times to ISO format for Firestore
    const previousTimestamp = new Date(previousTime).toISOString();
    const newTimestamp = new Date(newTime).toISOString();
  
    setLoading(true); // ⏳ Show loading indicator
  
    const result = await updateAppointment(appointmentId, previousTimestamp, newTimestamp, newStylistId);
  
    setLoading(false); // ✅ Stop loading
  
    if (result.success) {
      toast.success("Appointment successfully rescheduled!");
      setShowRescheduleModal(false);
    } else {
      toast.error("Failed to reschedule appointment.");
    }
  };
  

  export const StylistColumn = ({
    stylist,
    appointments,
    getAppointmentPosition,
    setRescheduleData,
    setShowRescheduleModal,
    handleDrop,
    timelineRef, // Reference to the timeline container
    setSelectedAppointment,
  }: any) => {
    const TIMELINE_HOUR_HEIGHT = 90; // 90px per hour
    const TIMELINE_TOP_OFFSET = 0; // No extra padding adjustment needed
  
    const [{ isOver }, drop] = useDrop({
      accept: "APPOINTMENT",
      drop: (item: any, monitor) => {
        if (!timelineRef.current) return;
  
        const offset = monitor.getClientOffset(); // Absolute Y position on screen
        if (!offset) return;
  
        // Get timeline's position and scroll offset
        const timelineTop = timelineRef.current.getBoundingClientRect().top;
        const scrollOffset = timelineRef.current.scrollTop;
  
        // Calculate Y relative to the timeline
        const dropY = offset.y - timelineTop + scrollOffset - TIMELINE_TOP_OFFSET;
        console.log("Dropped at Y:", dropY);

  

        // Convert drop position to time
        let dropHour = Math.floor(dropY-TIMELINE_HOUR_HEIGHT / TIMELINE_HOUR_HEIGHT);
        const dropMinutes = Math.round(((dropY % TIMELINE_HOUR_HEIGHT) / TIMELINE_HOUR_HEIGHT) * 60);
  dropHour = dropHour-1;
        // Ensure the time stays within valid ranges
        const adjustedHour = Math.max(0, Math.min(23, dropHour));
        const adjustedMinutes = Math.max(0, Math.min(59, dropMinutes));
  
        const newTime = `${adjustedHour.toString().padStart(2, "0")}:${adjustedMinutes.toString().padStart(2, "0")}`;
        console.log("Converted time:", newTime);
  
        // Call reschedule function

        handleDrop(item, dropY, setRescheduleData, setShowRescheduleModal, stylist.id);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    });
  
    const ref = useRef<HTMLDivElement>(null);
    drop(ref); // Attach drop function to ref
  
    return (
      <div
        ref={ref}
        className={`w-1/3 min-w-[300px] border-r border-gray-600 relative ${isOver ? "bg-gray-700" : ""}`}
      >
        <h3 className="text-center text-sm font-bold bg-gray-700 p-2">{stylist.name}</h3>
  
        {/* Appointments */}
        {appointments.map((serviceAppt: any) => (
          <AppointmentBlock
            key={serviceAppt.appointmentId}
            serviceAppt={serviceAppt} 
   getAppointmentPosition={getAppointmentPosition} 
   setSelectedAppointment={setSelectedAppointment} 
          />
        ))}
      </div>
    );
  };
  
  export const WeekAppointmentBlock = ({
    serviceAppt,
    getAppointmentWeekPosition,
    setSelectedAppointment,
  }: any) => {
    const { top, height } = getAppointmentWeekPosition(
      serviceAppt.startTimestamp,
      serviceAppt.service?.duration || 60
    );
  
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "APPOINTMENT",
      item: {
        appointmentId: serviceAppt.appointmentId,
              stylistId: serviceAppt.stylist.id,
              service: serviceAppt.service,
              client: serviceAppt.client,
              startTimestamp: serviceAppt.startTimestamp,
              appointmentDate: serviceAppt.appointmentDate,
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));
    const ref = useRef<HTMLDivElement>(null);
    drag(ref); // Attach drop function to ref 


    return (
      <div
        ref={ref}
        className={`absolute p-2 rounded-md text-sm font-semibold text-white shadow-md cursor-pointer ${
          isDragging ? "opacity-50" : ""
        }`}
        style={{
          top: `${top}px`,
          height: `${height}px`,
          left: `${serviceAppt.stackLevel * 15}px`,
          width: `${100 - serviceAppt.stackLevel * 10}%`,
          backgroundColor: serviceAppt.service?.color || "#3b82f6",
        }}
        onClick={() => {
            if (typeof setSelectedAppointment === "function") {
                setSelectedAppointment({
                    id: serviceAppt.appointmentId,
                    timezone: "UTC",
                    price: serviceAppt.service?.price || 0,
                    duration: serviceAppt.service?.duration || 0,
                    appointmentDate: serviceAppt.appointmentDate,
                    appointmentType: "service",
                    serviceStylistAppointments: [
                        {
                            stylist: {
                                id: serviceAppt.stylist.id,
                                name: serviceAppt.stylist.name,
                            },
                            service: serviceAppt.service
                                ? {
                                      id: serviceAppt.service.id,
                                      name: serviceAppt.service.name,
                                      price: serviceAppt.service.price,
                                      duration: serviceAppt.service.duration,
                                      color: serviceAppt.service.color,
                                  }
                                : null,
                            startTimestamp: serviceAppt.startTimestamp,
                            endTimestamp: serviceAppt.endTimestamp,
                        },
                    ],
                    client: serviceAppt.client || undefined,
                    status: serviceAppt.status,
                    notes: serviceAppt.notes || "",
                    createdAt: serviceAppt.createdAt || new Date(),
                    updatedAt: serviceAppt.updatedAt || new Date(),
                    salonId: serviceAppt.salonId,
                });
            } else {
                console.error("setSelectedAppointment is not a function");
            }
        }}
      >
        {serviceAppt.client?.name || "No Client"} - {serviceAppt.service?.name}
      </div>
    );
  };

  export const WeekDayColumn = ({
    day,
    dayIndex,
    dayAppointments,
    getAppointmentWeekPosition,
    handleDrop,
    setShowRescheduleModal,
    setRescheduleData,
    timelineRef,
    setSelectedAppointment
  }: any) => {
    const TIMELINE_HOUR_HEIGHT = 90; // 90px per hour
    const TIMELINE_TOP_OFFSET = 0; // No extra padding adjustment needed

    const [{ isOver }, drop] = useDrop({
      accept: "APPOINTMENT",
      drop: (item: any, monitor) => {
        if (!timelineRef.current) return;
  
        const offset = monitor.getClientOffset(); // Absolute Y position on screen
        if (!offset) return;
  
        // Get timeline's position and scroll offset
        const timelineTop = timelineRef.current.getBoundingClientRect().top;
        const scrollOffset = timelineRef.current.scrollTop;
  
        // Calculate Y relative to the timeline
        const dropY = offset.y - timelineTop + scrollOffset - TIMELINE_TOP_OFFSET;
        console.log("Dropped at Y:", dropY);

  

        // Convert drop position to time
        let dropHour = Math.floor(dropY-TIMELINE_HOUR_HEIGHT / TIMELINE_HOUR_HEIGHT);
        const dropMinutes = Math.round(((dropY % TIMELINE_HOUR_HEIGHT) / TIMELINE_HOUR_HEIGHT) * 60);
  dropHour = dropHour-1;
        // Ensure the time stays within valid ranges
        const adjustedHour = Math.max(0, Math.min(23, dropHour));
        const adjustedMinutes = Math.max(0, Math.min(59, dropMinutes));
  
        const newTime = `${adjustedHour.toString().padStart(2, "0")}:${adjustedMinutes.toString().padStart(2, "0")}`;
        console.log("Converted time:", newTime);
  
        // Trigger reschedule modal
        handleDrop(
          item,
          dropY,
          setRescheduleData,
          setShowRescheduleModal,
          day={day}
        );
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    });
    const ref = useRef<HTMLDivElement>(null);
    drop(ref); // Attach drop function to ref  

    return (
      <div
        ref={ref}
        className={`relative border-r border-gray-600 flex-1 ${
          isOver ? "bg-gray-700" : ""
        }`}
      >
        <div className="border-r border-gray-600 text-center text-sm font-bold p-3 bg-gray-700">
          {day}
        </div>
        <div className="pt-9">
          {Array.from({ length: 24 }).map((_, hourIndex) => (
            <div key={hourIndex} className="border-b border-gray-600 h-[90px] w-full"></div>
          ))}
        </div>
  
        {/* Appointments */}
        {dayAppointments.map((serviceAppt: any) => (
          <WeekAppointmentBlock
            key={serviceAppt.id}
            serviceAppt={serviceAppt}
            getAppointmentWeekPosition={getAppointmentWeekPosition}
            setSelectedAppointment={setSelectedAppointment}
          />
        ))}
      </div>
    );
  };

  export const updateAppointment = async (
    appointmentId: string,
    previousTimestamp: string, // ISO string of the old time e.g. "2025-03-17T15:30:00Z"
    newTimestamp: string, // ISO string of the new time e.g. "2025-03-18T10:00:00Z"
    newStylistId: string | null // New stylist ID (if changed)
  ) => {
    try {
      const appointmentRef = doc(db, "appointments", appointmentId);
      const appointmentDoc = await getDoc(appointmentRef);
  
      if (!appointmentDoc.exists()) {
        throw new Error("Appointment not found.");
      }
  
      const appointmentData = appointmentDoc.data();
  
      // 🔍 Find the correct serviceStylistAppointment by matching the old timestamp
      const updatedServiceAppointments = appointmentData.serviceStylistAppointments.map(
        (serviceAppt: any) => {
          if (new Date(serviceAppt.startTimestamp).toISOString() === previousTimestamp) {
            return {
              ...serviceAppt,
              startTimestamp: new Date(newTimestamp), // Update the start time
              stylist: {
                ...serviceAppt.stylist,
                id: newStylistId || serviceAppt.stylist.id, // Keep same stylist if unchanged
              },
            };
          }
          return serviceAppt;
        }
      );
  
      // 📝 Log only the new timestamp into `updateHistory`
      const updateLog = newTimestamp; // Only store the new timestamp
  
      // 🔄 Update Firestore with the new appointment details
      await updateDoc(appointmentRef, {
        serviceStylistAppointments: updatedServiceAppointments,
        appointmentDate: newTimestamp.split("T")[0], // Update date
        updatedAt: new Date(),
        updateHistory: arrayUnion(updateLog), // Store only new timestamps
      });
  
      console.log("Appointment rescheduled successfully!");
      return { success: true };
    } catch (error) {
      console.error("Error updating appointment:", error);
      return { success: false, error };
    }
  };
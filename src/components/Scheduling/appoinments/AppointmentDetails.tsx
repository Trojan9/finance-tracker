import React from "react";
import { Appointment } from "../../../api/models/appointments";

interface AppointmentDetailsProps {
  appointment: Appointment | null;
  onClose: () => void;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({ appointment, onClose }) => {
  if (!appointment) return null;

  const now = new Date();
  const appointmentStart = new Date((appointment.serviceStylistAppointments[0].startTimestamp as any ).seconds * 1000);
  const appointmentEnd = new Date((appointment.serviceStylistAppointments[appointment.serviceStylistAppointments.length-1].endTimestamp as any).seconds * 1000);
  const isPast = now > appointmentEnd;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-100 flex justify-end">
      <div className="bg-gray-800 w-[400px] p-6 shadow-lg rounded-lg h-full">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">{appointment.client?.name || "Walk-in Client"}</h2>
          <button onClick={onClose} className="text-gray-600 text-xl font-bold">✕</button>
        </div>

        {/* Appointment Date & Time */}
        <p className="text-gray-500 mt-2">
          {appointmentStart.toLocaleDateString()} | {appointmentStart.toLocaleTimeString()} - {appointmentEnd.toLocaleTimeString()}
        </p>

        {/* Appointment Type */}
        <p className="text-gray-700 font-semibold mt-4">
          {appointment.appointmentType === "service" ? "Service Appointment" : "Blocked Time"}
        </p>


        {/* Services & Stylists */}
        <div className="mt-4 space-y-3">
          {appointment.serviceStylistAppointments.map((serviceAppt:any, index:number) => (
            <div key={index} className="p-3 bg-gray-100 rounded-md">
              <p className="font-bold text-gray-800">{serviceAppt.service?.name}</p>
              <p className="text-gray-500">Stylist: {serviceAppt.stylist.name}</p>
              <p className="text-gray-600">${serviceAppt.service?.price.toFixed(2)} | {serviceAppt.service?.duration} mins</p>
            </div>
          ))}
        </div>

        {/* Notes Section */}
        {appointment.notes && (
          <div className="mt-4 border-t pt-4">
            <p className="text-gray-600 font-semibold">Notes:</p>
            <p className="text-gray-700">{appointment.notes}</p>
          </div>
        )}

        {/* Total Price */}
        <div className="mt-4 border-t pt-4">
          <p className="text-gray-600 font-semibold">Total:</p>
          <p className="text-gray-800 text-lg font-bold">${appointment.price.toFixed(2)}</p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          {isPast ? (
            <>
              <button className="bg-red-500 text-white px-4 py-2 rounded-md w-full">Cancel</button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded-md w-full">No Show</button>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-md w-full">Checkout</button>
            </>
          ) : (
            <>
              <button className="bg-red-500 text-white px-4 py-2 rounded-md w-full">Cancel</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full">Reschedule</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;

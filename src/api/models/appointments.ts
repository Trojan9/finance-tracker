export type Appointment = {
    id: string; // Unique identifier for the appointment
    timezone: string; // Timezone for correct time calculations
    price: number;  // Total appointment price (number, not string)
    duration: number;  // Total duration in minutes (number, not string)
    appointmentDate: string; // Date of the appointment in ISO format
    appointmentType: "service" | "block"; // Appointment type: service or block
    serviceStylistAppointments: {
        stylist: {
            id: string;
            name: string;
        };
        service: {
            id: string;
            name: string;
            price: number;
            duration: number;
            color: string;
        }|null;
        startTimestamp: Date; // ISO timestamp format
        endTimestamp: Date; // ISO timestamp format
    }[];
    client?: {
        id: string;
        name: string;
        phone?: string;
        email?: string;
    }; // Optional field: Appointment may not always have a client (e.g., walk-ins)

    status: "scheduled" | "completed" | "canceled" | "no-show"; // Appointment status

    notes?: string; // Optional: Additional stylist notes for the appointment


    createdAt: Date; // ISO timestamp for when appointment was created
    updatedAt: Date; // ISO timestamp for last update
    salonId: string; // Salon ID where the appointment is scheduled
};

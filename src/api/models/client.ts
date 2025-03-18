export type Client = {
    id: string;  // Unique identifier for the client
    name: string;  // Client's full name
    phone?: string;  // Optional: Client's phone number
    email?: string;  // Optional: Client's email address
    avatar?: string;  // Optional: Profile picture URL
    dateOfBirth?: string;  // Optional: Format YYYY-MM-DD
    blocked?: boolean;  // Optional: Whether the client is blocked
    salonId: string;  // Salon ID where the client is registered
    gender?: "male" | "female" | "non-binary" | "prefer not to say";  // Optional gender field
    address?: {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    };  // Optional address information

    appointmentHistory?: {
        appointmentId: string;
        status: "scheduled" | "completed" | "canceled" | "no-show";
        date: string;  // ISO timestamp format
        stylistId: string;
        serviceId: string;
    }[];  // List of past appointments for the client

    preferences?: {
        preferredStylistId?: string;
        preferredServices?: string[];
        notes?: string;  // Any additional notes (e.g., "Prefers organic products")
    };  // Optional client preferences

    createdAt: string;  // ISO timestamp when the client was added
    updatedAt: string;  // ISO timestamp for the last update
};

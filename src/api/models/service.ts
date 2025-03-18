export type Service = {
  id: string;
  name: string;
  price: number; // Ensuring it's a number, not a string
  duration: number; // Ensuring it's a number, not a string
  description: string;
  createdAt: string;
  updatedAt: string;
  salonId: string;
  categoryId: string;
  processingTimeEnabled: boolean;
  stylistServiceMap: {
    [userId: string]:     {
        duration: number;
        price: number;
        processingTimeEnabled: boolean;
        processingTimes?: {
          start: number;
          processing: number;
          end: number;
        };
      }
  } | null;
  processingTimes?: {
    // Optional field to handle processing times dynamically
    start: number;
    processing: number;
    end: number;
  };
  color: string; // Type changed from `any` to `string` to ensure hex colors are stored correctly
};

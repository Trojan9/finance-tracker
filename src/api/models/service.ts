export type Service = {
    id: string;
    name: string;
    price: string;  // Ensuring it's a number, not a string
    duration: string;  // Ensuring it's a number, not a string
    description: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    categoryId: string;
    processingTimeEnabled: boolean;
    processingTimes?: {  // Optional field to handle processing times dynamically
        start: string;
        processing: string;
        end: string;
    };
    color: string;  // Type changed from `any` to `string` to ensure hex colors are stored correctly
};

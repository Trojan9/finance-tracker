import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";

const colors = [
  "#FF5733", "#FF33A8", "#E91E63", "#9C27B0",
  "#FF9800", "#FF5722", "#F44336", "#E91E63",
  "#03A9F4", "#2196F3", "#3F51B5", "#673AB7",
  "#4CAF50", "#8BC34A", "#009688", "#2E7D32",
  "#FFC107", "#FFEB3B", "#FF5722", "#FFC107",
  "#795548", "#9E9E9E", "#607D8B", "#000000"
];

const ColorPickerModal = ({ initialColor, onSelect, onClose }: any) => {
  const [selectedColor, setSelectedColor] = useState(initialColor || "");

  // Ensure previously selected color is highlighted when the modal opens

  useEffect(() => {
    setSelectedColor(initialColor || "");
  }, [initialColor]); // Runs when `initialColor` changes

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-xs text-center">
        <h2 className="text-lg font-bold text-white mb-4">ACCENT COLOR</h2>
        <div className="grid grid-cols-4 gap-2">
          {colors.map((color) => (
            <button
              key={color}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition duration-200 ${
                selectedColor === color ? "ring-2 ring-white" : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            >
              {selectedColor === color && <FaCheck className="text-white" />}
            </button>
          ))}
        </div>
        <button
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg w-full hover:bg-orange-600"
          onClick={() => {
            onSelect(selectedColor); // Pass selected color to parent
            onClose(); // Close the modal
          }}
        >
          CHOOSE
        </button>
      </div>
    </div>
  );
};

export default ColorPickerModal;

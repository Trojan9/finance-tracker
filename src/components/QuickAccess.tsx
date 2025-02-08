import React from "react";

const QuickAccess: React.FC = () => {
  const actions = [
    { label: "New Expense", color: "bg-purple-600" },
    { label: "Add Receipt", color: "bg-blue-600" },
    { label: "Create Report", color: "bg-green-600" },
    { label: "Create Trip", color: "bg-red-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <button
          key={index}
          className={`py-3 rounded-lg text-white font-medium ${action.color} hover:opacity-90`}
        >
          + {action.label}
        </button>
      ))}
    </div>
  );
};

export default QuickAccess;

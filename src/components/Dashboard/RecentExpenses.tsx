import React from "react";

const RecentExpenses: React.FC = () => {
  const expenses = [
    { subject: "Office Supplies", employee: "John Smith", team: "Marketing", amount: "€150.00" },
    { subject: "Business Lunch", employee: "Sarah Jade", team: "Sales", amount: "€75.50" },
    { subject: "Travel Expenses", employee: "Mike Brown", team: "Operations", amount: "€450.25" },
    { subject: "Client Dinner", employee: "Jennifer Lee", team: "Marketing", amount: "€120.00" },
    { subject: "Hotel", employee: "David Wilson", team: "Finance", amount: "€275.75" },
  ];

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4">Recent Expenses</h3>
      <table className="w-full text-sm text-left text-gray-400">
        <thead className="text-gray-500 uppercase bg-gray-700">
          <tr>
            <th className="py-3 px-6">Subject</th>
            <th className="py-3 px-6">Employee</th>
            <th className="py-3 px-6">Team</th>
            <th className="py-3 px-6">Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr key={index} className="bg-gray-800 hover:bg-gray-700">
              <td className="py-3 px-6">{expense.subject}</td>
              <td className="py-3 px-6">{expense.employee}</td>
              <td className="py-3 px-6">{expense.team}</td>
              <td className="py-3 px-6">{expense.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentExpenses;

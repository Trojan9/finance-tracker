
import React, { useEffect, useState } from "react";
import { FaCheck, FaPlane, FaFileAlt, FaMoneyBill, FaClipboard, FaReceipt, FaFile, FaPlaneDeparture, FaUpload, FaTimes, FaSpinner } from "react-icons/fa";
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
// import { Transaction } from "../../context/types";
import { Transaction, CategorySpending, categoryOptions } from "../../constants"; 
import { auth, db } from "../../utils/firebaseConfig"; // Assuming firebaseConfig exports initialized `auth` and `db`
import { doc, getDoc,addDoc,collection, query, onSnapshot, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
// Initial Graph Data (empty)

const Home: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categoryData, setCategoryData] = useState<CategorySpending[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for button
  const [newTransaction, setNewTransaction] = useState({
    details: "",
    amount: "0",
    type: "debit",
    category: categoryOptions[0], // Default category
  });
  const navigate = useNavigate();
 
  // Handle Input Changes (Ensure Amount is Non-Negative)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;

    if (name === "amount") {
      value = Math.max(0, Number(value)).toString(); // Prevent negative numbers
    }

    setNewTransaction({ ...newTransaction, [name]: value });
  };

  // Function to Add Transaction
  const handleAddTransaction = async () => {
    if (!user) {
      alert("User not authenticated");
      return;
    }

    // 🔥 Prevent storing if any value is empty
    if (!newTransaction.details || !newTransaction.amount || !newTransaction.category) {
      alert("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true); // Show progress indicator

    try {
      await addDoc(collection(db, "users", user.uid, "transactions"), {
        details: newTransaction.details,
        amount: Math.max(0, parseFloat(newTransaction.amount)), // Ensure non-negative amount
        type: newTransaction.type,
        category: newTransaction.category,
        date: new Date().toISOString().split("T")[0], // Store current date
        timestamp: serverTimestamp(),
      });
      setIsModalOpen(false); // Close modal after submission

    } catch (error) {
      console.error("Error adding transaction:", error);
    } finally {
      setIsSubmitting(false); // Stop loading indicator
    }
  };
  const handleUpload = async (event:any) => {
    setIsLoading(true); // Start loading
    await handleFileUpload(event); // Wait for the function to complete
    setIsLoading(false); // Stop loading
  };
  // Handle File Upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch("https://aidev.glmrs.space/api/v1/extract", {
        method: "POST",
        headers: {
            "Accept": "application/json",  // Ensures JSON response
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRpbW15YmFqb0BnbWFpbC5jb20iLCJwYXNzd29yZCI6IjEyMzQ1Njc4OTAiLCJpYXQiOjE2OTM1OTc3MjF9.kBEnsor_zKbrhtL8i0yI2b9Jtz-3POBj9vQYF4SLyVk"
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload PDF");
      }
  
      const result = await response.json();
      console.log(result);

      const extractedData = cleanAndParseJSON(result.data); // Get transactions from API response
  
      // Process transactions into required format
      parseTransactionsFromAPI(extractedData);
    } catch (error) {
      console.error("Error processing PDF:", error);
    }
  };
  function cleanAndParseJSON(responseString:any) {
    // Remove markdown formatting (```json ... ```)
    let cleanedString = responseString.replace(/```json|```/g, "").trim();

    try {
        // Convert cleaned JSON string into an array
        const transactions = JSON.parse(cleanedString);
        console.log("Parsed Transactions:", transactions);
        return transactions;
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return [];
    }
}
  // Function to Parse Transactions from API response
  const parseTransactionsFromAPI = async(transactions: any[]) => {
    const newTransactions: Transaction[] = [];
    const newCategoryData: CategorySpending[] = [];

  

    transactions.forEach(async(transaction) => {
      const { date, details, type, amount,category } = transaction;
      // const amount = money_out > 0 ? money_out : money_in; // Determine transaction amount
  
      newTransactions.push({ date, amount,type });
  
      // Process category spending
      // const category = category.toLowerCase();

      const existingCategory = newCategoryData.find((c) => category.toLowerCase() === c.category.toLowerCase());

if (existingCategory) {
  existingCategory.amount += amount; // ✅ Correctly updates amount
} else {
  newCategoryData.push({ category, amount });
}
      // 🔥 Store each transaction in Firestore under the user's UID
    try {
let userId = auth.currentUser!.uid;
      await addDoc(collection(db, "users", auth.currentUser!.uid, "transactions"), {
        userId,
        date,
        details,
        type,
        amount,
        category,
        timestamp: new Date(), // Store timestamp for sorting
      });
      console.log(`Transaction stored: ${details} - £${amount}`);
    } catch (error) {
      console.error("Error adding transaction: ", error);
    }
    });
  
    setTransactions(newTransactions);
    setCategoryData(newCategoryData);
    console.log("Category Data22:", newCategoryData);
  };
  useEffect(() => {
    // ✅ Ensure auth state is initialized before running Firestore queries
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser); // ✅ Store the authenticated user
      } else {
        console.error("User not authenticated.");
        navigate("/login");
        // router.push("/login"); // ✅ Redirect to login page if no user
      }
    });

    return () => unsubscribeAuth(); // ✅ Cleanup listener on unmount
  }, []);
  useEffect(() => {
    if (!user) {
      console.error("User not authenticated.");
      return;
    }
    console.log("UserEffect:", 1);
    
     setTransactions([]);
      setCategoryData([]);
      setRecentExpenses([]);

    const transactionsRef = collection(db, "users", user.uid, "transactions");
    const q = query(transactionsRef);

   // 🔥 Fetch transactions in real-time
   const unsubscribe = onSnapshot(q, (snapshot) => {
    setTransactions([]);
    setCategoryData([]);
    setRecentExpenses([]);
    const newCategoryData: CategorySpending[] = [];
    const fetchedTransactions: Transaction[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Transaction, "id">), // Ensure type safety
    }));
    fetchedTransactions.forEach(async(transaction) => {
    if (transaction!=undefined) {
    // 🔥 Fetch category spending
    const existingCategory = newCategoryData.find((c) => transaction.category!.toLowerCase() === c.category.toLowerCase());

     if (existingCategory) {
       existingCategory.amount += transaction.amount;


     } else {
       newCategoryData.push({ category:transaction.category!, amount:transaction.amount! });
     }
     
    }

    });
    setTransactions(fetchedTransactions);
    setCategoryData(newCategoryData);

    const expenses: Transaction[] = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Transaction, "id">),
        }))
        .filter((txn) => txn.type === "debit") // Filter only expenses
        .slice(0, 5); // Limit to 5 most recent

      setRecentExpenses(expenses);
  });


   


  return () => unsubscribe(); // Cleanup listener on unmount
}, [user]);

  return (
    <div className="p-6 md:p-8 bg-gray-900 text-white">
        {/* Upload Button */}
        <div className="flex justify-end mb-4">
      <label className="bg-blue-600 px-4 py-2 rounded-lg shadow-md text-sm cursor-pointer flex items-center space-x-2 hover:bg-blue-500">
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 0116 0H4z"
            ></path>
          </svg>
        ) : (
          <FaUpload />
        )}
        <span>{isLoading ? "Uploading..." : "Upload Bank Statement"}</span>
        <input type="file" accept="application/pdf" className="hidden" onChange={handleUpload} />
      </label>
    </div>
        {/* <div className="flex justify-end mb-4">
        <label className="bg-blue-600 px-4 py-2 rounded-lg shadow-md text-sm cursor-pointer flex items-center space-x-2 hover:bg-blue-500">
          <FaUpload />
          <span>Upload Bank Statement</span>
          <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
        </label>
      </div> */}
      {/* Pending Tasks and Recent Expenses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Pending Tasks */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">Pending Tasks</h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex justify-between items-center">
              <span className="flex items-center space-x-2">
                <FaCheck className="text-blue-500" />
                <span>Pending Approvals</span>
              </span>
              <span>5</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="flex items-center space-x-2">
                <FaPlane className="text-purple-500" />
                <span>New Trips Registered</span>
              </span>
              <span>1</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="flex items-center space-x-2">
                <FaFileAlt className="text-pink-500" />
                <span>Unreported Expenses</span>
              </span>
              <span>4</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="flex items-center space-x-2">
                <FaMoneyBill className="text-green-500" />
                <span>Upcoming Expenses</span>
              </span>
              <span>0</span>
            </li>
          </ul>
        </div>

        {/* Recent Expenses */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4">Recent Expenses</h3>
      <div className="text-sm text-gray-400 space-y-4">
        {recentExpenses.length === 0 ? (
          <p>No recent expenses found.</p>
        ) : (
          recentExpenses.map((expense,index) => (
            <div key={index} className="flex justify-between">
              <span>{expense.category}</span>
              <span className="text-gray-200">£{expense.amount.toFixed(2)}</span>
            </div>
          ))
        )}
      </div>
    </div>
      </div>


      {/* Quick Access */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 flex justify-between items-center space-x-4">
        <button onClick={() => setIsModalOpen(true)} className="bg-purple-600 px-4 py-2 rounded-lg shadow-md text-sm hover:bg-purple-500 flex items-center space-x-2">
          <FaClipboard />
          <span>+ New Transaction</span>
        </button>
      
        <button className="bg-blue-600 px-4 py-2 rounded-lg shadow-md text-sm hover:bg-blue-500 flex items-center space-x-2">
          <FaReceipt />
          <span>+ New Appointment</span>
        </button>
        <button className="bg-green-600 px-4 py-2 rounded-lg shadow-md text-sm hover:bg-green-500 flex items-center space-x-2">
          <FaFile />
          <span>+ Create Report</span>
        </button>
        <button className="bg-red-600 px-4 py-2 rounded-lg shadow-md text-sm hover:bg-red-500 flex items-center space-x-2">
          <FaPlaneDeparture />
          <span>+ Create Trip</span>
        </button>
      </div>

     {/* Spending Per Day Chart */}
     <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h3 className="text-lg font-bold mb-4">Day-to-Day Spending This Month</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={transactions}>
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#6366F1" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Category-wise Spending Chart */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4">Category-Wise Spending This Month</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={categoryData}>
          <XAxis dataKey="category" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="amount" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>

   {/* Modal Overlay - Opens on Top of Page */}
   {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 animate-fadeIn">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Add New Transaction</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <FaTimes className="text-red-500 text-lg" />
              </button>
            </div>

            {/* Transaction Form */}
            <input
              type="text"
              name="details"
              value={newTransaction.details}
              onChange={handleInputChange}
              placeholder="Transaction details"
              className="w-full p-2 mb-3 border rounded bg-gray-700 text-white"
            />

            <input
              type="number"
              name="amount"
              min="0"
              value={newTransaction.amount}
              onChange={handleInputChange}
              placeholder="Amount"
              className="w-full p-2 mb-3 border rounded bg-gray-700 text-white"
            />

            {/* Transaction Type Dropdown */}
            <select
              name="type"
              value={newTransaction.type}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 border rounded bg-gray-700 text-white"
            >
              <option value="debit">Expense</option>
              <option value="credit">Income</option>
            </select>

            {/* Category Dropdown */}
            <select
              name="category"
              value={newTransaction.category}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 border rounded bg-gray-700 text-white"
            >
              {categoryOptions.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-600 px-4 py-2 rounded-lg shadow-md hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTransaction}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-lg shadow-md flex items-center space-x-2 ${
                  isSubmitting ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Add Transaction</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
  
      </div>
  
  );
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white p-2 rounded shadow-lg">
        <p className="text-sm font-bold">{payload[0].payload.category}</p>
        <p>Amount: £{payload[0].value.toFixed(2)}</p>
      </div>
    );
  }

  return null;
};

export default Home;

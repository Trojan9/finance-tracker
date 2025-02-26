import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, resetPassword } from "../utils/firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import asset1 from "../assets/asset1.png";
import asset2 from "../assets/asset2.png";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resetPassword(auth, email);
      toast.success("Password reset email sent!");
      setEmail(""); // Clear email input
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast.error(error.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      {/* Background Spheres */}
      <img src={asset1} alt="Decorative Sphere" className="absolute top-10 left-10 w-40 h-40 opacity-50" />
      <img src={asset2} alt="Decorative Sphere" className="absolute top-40 right-20 w-24 h-24 opacity-30" />

      {/* Forgot Password Form */}
      <div className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-full max-w-md z-10">
        <h1 className="text-3xl font-bold text-center mb-6">Forgot Password?</h1>
        <p className="text-center text-sm text-gray-400 mb-4">
          Enter your email, and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <input
              type="email"
              id="email"
              className="w-full bg-gray-700 px-4 py-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-teal-500 py-2 rounded-lg font-medium text-white hover:opacity-90 transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {/* Back to Login */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

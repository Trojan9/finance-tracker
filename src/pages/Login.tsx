import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { auth, googleProvider, loginWithEmail, loginWithGoogle } from "../utils/firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import asset1 from "../assets/asset1.svg";
import asset2 from "../assets/asset2.svg";
import google from "../assets/google.png";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingLogin(true); // Show spinner for email login
    try {
      await loginWithEmail(auth, email, password);
      navigate("/dashboard/home");
    } catch (error: any) {
      console.error("Error logging in:", error);
      toast.error(error.message || "Login failed!"); // Show error message
    } finally {
      setLoadingLogin(false); // Hide spinner
    }
  };

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true); // Show spinner for Google sign-in
    try {
      await loginWithGoogle(auth, googleProvider);
      navigate("/dashboard/home");
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      toast.error(error.message || "Google sign-in failed!"); // Show error message
    } finally {
      setLoadingGoogle(false); // Hide spinner
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      
      {/* Background Spheres */}
      <img src={asset1} alt="Decorative Sphere" className="absolute top-10 left-10 w-40 h-40 opacity-50" />
      <img src={asset2} alt="Decorative Sphere" className="absolute top-40 right-20 w-24 h-24 opacity-30" />

      {/* Login Form */}
      <div className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-full max-w-md z-10">
        <h1 className="text-4xl font-bold text-center mb-6">Sign In.</h1>

        {/* Google Login */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center space-x-3 border border-gray-600 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition mb-4"
          disabled={loadingGoogle}
        >
          {loadingGoogle ? (
            <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div>
          ) : (
            <>
              <img src={google} alt="Google" className="w-5 h-5" />
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center justify-between text-gray-400 my-4">
          <span className="border-t w-1/4"></span>
          <span className="text-sm">or</span>
          <span className="border-t w-1/4"></span>
        </div>

        {/* Email & Password Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              id="email"
              className="w-full bg-gray-700 px-4 py-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="E-mail"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              id="password"
              className="w-full bg-gray-700 px-4 py-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-2 rounded-lg font-medium text-white hover:opacity-90 transition flex items-center justify-center"
            disabled={loadingLogin}
          >
            {loadingLogin ? (
              <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Links */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-purple-500 hover:underline">
            Create an account
          </Link>
        </p>
        <p className="text-center text-sm text-gray-400 mt-2">
          <Link to="/forgot-password" className="hover:underline">
            Forgot password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

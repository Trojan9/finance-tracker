import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, registerWithEmail, loginWithGoogle } from "../utils/firebaseConfig";


const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerWithEmail(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle(auth, googleProvider);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-6">Register</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full bg-gray-700 px-4 py-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full bg-gray-700 px-4 py-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full bg-gray-700 px-4 py-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 py-2 rounded-md font-medium hover:bg-blue-500 transition"
          >
            Register
          </button>
        </form>
        <div className="my-6 flex items-center justify-between">
          <span className="border-t w-1/4"></span>
          <span className="text-sm text-gray-400">OR</span>
          <span className="border-t w-1/4"></span>
        </div>
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-red-600 py-2 rounded-md font-medium hover:bg-red-500 transition"
        >
          Sign in with Google
        </button>
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

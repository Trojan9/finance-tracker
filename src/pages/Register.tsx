import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  googleProvider,
  registerWithEmail,
  loginWithGoogle,
  db,
} from "../utils/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import asset1 from "../assets/asset1.png";
import asset2 from "../assets/asset2.png";
import google from "../assets/google.png";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingRegister(true); // Only affects Register button
    try {
      const userCredential = await registerWithEmail(auth, email, password);
      const user = userCredential.user;

      // Store user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
      });

      navigate("/dashboard/home");
    } catch (error: any) {
      console.error("Error registering:", error);
      toast.error(error.message || "Registration failed!"); // Show error toast
    } finally {
      setLoadingRegister(false); // Only affects Register button
    }
  };

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true); // Only affects Google button
    try {
      const userCredential = await loginWithGoogle(auth, googleProvider);
      const user = userCredential.user;

      // Store user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
      });

      navigate("/dashboard/home");
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      toast.error(error.message || "Google sign-in failed!"); // Show error toast
    } finally {
      setLoadingGoogle(false); // Only affects Google button
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      <img
        src={asset1}
        alt="Decorative Sphere"
        className="absolute top-10 left-10 w-40 h-40 opacity-50"
      />
      <img
        src={asset2}
        alt="Decorative Sphere"
        className="absolute top-40 right-20 w-24 h-24 opacity-30"
      />

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
              required
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
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full bg-gray-700 px-4 py-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 py-2 rounded-md font-medium hover:bg-blue-500 transition flex items-center justify-center"
            disabled={loadingRegister}
          >
            {loadingRegister ? (
              <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="my-6 flex items-center justify-between">
          <span className="border-t w-1/4"></span>
          <span className="text-sm text-gray-400">OR</span>
          <span className="border-t w-1/4"></span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-red-600 py-2 rounded-md font-medium hover:bg-red-500 transition flex items-center justify-center gap-2"
          disabled={loadingGoogle}
        >
          {loadingGoogle ? (
            <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div>
          ) : (
            <>
              <img src={google} alt="Google" className="w-5 h-5" />
              <span>Sign in with Google</span>
            </>
          )}
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

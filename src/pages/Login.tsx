import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, loginWithEmail, loginWithGoogle } from "../utils/firebaseConfig";


const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithEmail(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
      {/* Background Spheres */}
      <img
        src="../assets/asset1.svg"
        alt="Decorative Sphere"
        className="absolute top-10 left-10 w-40 h-40 opacity-50"
      />
      <img
        src="../assets/asset2.svg"
        alt="Decorative Sphere"
        className="absolute top-40 right-20 w-24 h-24 opacity-30"
      />

      {/* Login Form */}
      <div className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-full max-w-md z-10">
        <h1 className="text-4xl font-bold text-center mb-6">Sign In.</h1>

        {/* Google Login */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center space-x-3 border border-gray-600 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition mb-4"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Continue with Google</span>
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

              onChange={(e:any) => setEmail(e.target.value)}
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
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-2 rounded-lg font-medium text-white hover:opacity-90 transition"
          >
            Sign In.
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

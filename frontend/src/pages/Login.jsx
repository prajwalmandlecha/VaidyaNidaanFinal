import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    try {
      const response = await axios.post("http://localhost:5005/api/doctors/login", {
        email,
        password,
      });

      if (response.data.token) {
        // Store the JWT token in localStorage
        localStorage.setItem("token", response.data.token);

        // Redirect to the dashboard (change route if needed)
        navigate("/dashboard");
      }
    } catch (err) {
      // Log the error for debugging
      console.error(err);

      // Handle errors and show meaningful message
      if (err.response) {
        setError(err.response.data.message || "Something went wrong");
      } else {
        setError("Network error. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D0F0E0] via-white to-[#D0F0E0] flex items-center justify-center p-8">
      <motion.div
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg transform transition duration-500 hover:scale-105"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold text-center text-[#0A0A32] mb-4">
          Welcome Back!
        </h2>
        <p className="text-center text-[#0A0A32] opacity-80 mb-6">
          Login to continue to your dashboard
        </p>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#0A0A32]"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-[#0A0A32] rounded-lg focus:ring focus:ring-[#0A0A32] focus:outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#0A0A32]"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#0A0A32] rounded-lg focus:ring focus:ring-[#0A0A32] focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#0A0A32] text-white py-3 rounded-lg hover:bg-[#0C0C40] focus:ring focus:ring-[#0A0A32] focus:outline-none transition"
          >
            Login
          </button>
        </form>
        <p className="text-center text-[#0A0A32] opacity-80 mt-6">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-[#0A0A32] font-semibold hover:underline"
          >
            Sign up
          </a>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialty: "", // Changed from speciality to specialty
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Send form data to backend for doctor signup
      const response = await axios.post(
        "http://localhost:5005/api/doctors/signup",
        formData
      );

      if (response.status === 201) {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#D0F0E0] via-white to-[#D0F0E0]">
      <motion.div 
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg transform transition duration-500 hover:scale-105"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold text-center text-[#0A0A32] mb-4">
          Create an Account
        </h2>
        <p className="text-center text-[#0A0A32] opacity-80 mb-6">
          Join us to manage your patients seamlessly
        </p>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {success}
          </div>
        )}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-md focus:ring focus:ring-[#0A0A32]"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-md focus:ring focus:ring-[#0A0A32]"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-md focus:ring focus:ring-[#0A0A32]"
            required
          />
          <select
            name="specialty" // Changed from speciality to specialty
            value={formData.specialty}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-md focus:ring focus:ring-[#0A0A32]"
            required
          >
            <option value="" disabled>
              Select Specialty
            </option>
            <option value="Neurologist">Neurologist</option>
            <option value="Oncologist">Oncologist</option>
            <option value="General Physician">General Physician</option>
            <option value="Pediatrician">Pediatrician</option>
            <option value="Other">Other</option>
          </select>
          <button
            type="submit"
            className="w-full bg-[#0A0A32] text-white py-3 rounded-md hover:bg-[#0C0C40] transition"
          >
            Sign up
          </button>
        </form>
        <p className="text-center text-[#0A0A32] opacity-80 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-[#0A0A32] font-semibold hover:underline">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
}

export default Signup;

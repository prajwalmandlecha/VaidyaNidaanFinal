import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D0F0E0] via-white to-[#D0F0E0] p-8 text-[#0A0A32] flex flex-col justify-center">
      {/* Header Section */}
      <motion.header 
        className="text-center space-y-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <img src={logo} alt="VaidyaNidaan" className=" pt-16 w-96 h-24rem mx-auto" />
        {/* <h1 className="text-7xl font-bold">
          Welcome to <span className="text-[#0A0A32]">VaidyaNidaan</span>
        </h1> */}
        <p className="text-2xl text-[#0A0A32] opacity-80 max-w-4xl mx-auto">
          Detect. Understand. Support. AI-powered diagnosis for Alzheimer's and Brain Tumors.
        </p>
        
        <motion.div 
          className="mt-8 flex justify-center space-x-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <Link to="/login">
            <motion.button 
              className="px-16 py-4 text-white bg-[#0A0A32] rounded-xl shadow-lg hover:bg-[#0C0C40] transition duration-300 text-2xl"
              whileHover={{ scale: 1.1 }}
            >
              Login
            </motion.button>
          </Link>
          <Link to="/signup">
            <motion.button 
              className="px-16 py-4 text-[#0A0A32] bg-transparent border-2 border-[#0A0A32] rounded-xl shadow-lg hover:bg-[#D0F0E0] transition duration-300 text-2xl"
              whileHover={{ scale: 1.1 }}
            >
              Sign Up
            </motion.button>
          </Link>
        </motion.div>
      </motion.header>

      {/* Features Section */}
      <motion.section 
        className="mt-32 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-5xl font-semibold">Why Choose Vaidya Nidaan?</h2>
        <p className="mt-6 text-xl opacity-80 max-w-4xl mx-auto">
          Detect and monitor Alzheimer's and brain tumors with cutting-edge AI technology, easy-to-use interface, and multilingual support.
        </p>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {["AI-Powered Detection", "Secure and Private", "Multilingual Support"].map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white shadow-xl rounded-3xl p-10 text-center transition-transform transform hover:scale-105 hover:shadow-2xl"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: index * 0.2 }}
            >
              <h3 className="text-3xl font-semibold">{feature}</h3>
              <p className="opacity-80 mt-3">{feature === "AI-Powered Detection" ? "Advanced AI algorithms ensure accurate detection for better healthcare decisions." : feature === "Secure and Private" ? "Your data is encrypted and protected, ensuring complete confidentiality." : "Our platform is accessible in multiple languages to support diverse users."}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer Section */}
      <footer className="mt-32 text-center text-[#0A0A32] opacity-80 text-lg">
        <p>&copy; 2025 Vaidya Nidaan. All Rights Reserved.</p>
        <div className="mt-4 space-x-6">
          <Link to="/privacy-policy" className="hover:text-[#0C0C40]">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-[#0C0C40]">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
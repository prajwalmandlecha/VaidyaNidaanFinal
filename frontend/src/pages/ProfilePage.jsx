import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token is missing");
        }

        const response = await axios.get(`http://localhost:5005/api/patients/${userId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        setPatientData(response.data.patient);
        setEditedData(response.data.patient);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    if (userId) {
      fetchPatientData();
    }
  }, [userId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDetectAlzheimer = () => {
    navigate(`/alzheimers-detection/${userId}`);
  };
  

  const handleChatWithAI = () => {
    navigate(`/chat-with-ai/${userId}`);
  };

  const handleGradCAMAnalysis = () => {
    navigate(`/grad-cam/${userId}`);
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token is missing");
      }

      const response = await axios.put(
        `http://localhost:5005/api/patients/${userId}`,
        editedData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      setPatientData(response.data.patient);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving patient data:", error);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date) ? date.toLocaleDateString() : 'Invalid Date';
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  if (!patientData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D0F0E0] via-white to-[#D0F0E0] p-8 text-[#0A0A32]">
      <motion.div
        className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Header Section - Back Button */}
        <div className="flex justify-start mb-6">
          <button
            onClick={handleBackToDashboard}
            className="px-6 py-3 text-white bg-[#4caf50] rounded-lg shadow-md hover:bg-[#388e3c] transition duration-300"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Patient Profile Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col space-y-4">
            {/* Left side details */}
            <div>
              <p className="text-gray-700 font-semibold">Name:</p>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedData?.name || ''}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-[#4caf50] transition duration-300"
                />
              ) : (
                <p className="text-gray-900">{patientData.name}</p>
              )}
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Age:</p>
              {isEditing ? (
                <input
                  type="text"
                  name="age"
                  value={editedData?.age || ''}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-[#4caf50] transition duration-300"
                />
              ) : (
                <p className="text-gray-900">{patientData.age}</p>
              )}
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Gender:</p>
              {isEditing ? (
                <input
                  type="text"
                  name="gender"
                  value={editedData?.gender || ''}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-[#4caf50] transition duration-300"
                />
              ) : (
                <p className="text-gray-900">{patientData.gender}</p>
              )}
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Smoker:</p>
              {isEditing ? (
                <input
                  type="text"
                  name="smoker"
                  value={editedData?.smoker || ''}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-[#4caf50] transition duration-300"
                />
              ) : (
                <p className="text-gray-900">{patientData.smoker}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            {/* Right side details */}
            <div>
              <p className="text-gray-700 font-semibold">Alcohol Consumption:</p>
              {isEditing ? (
                <input
                  type="text"
                  name="alcoholConsumption"
                  value={editedData?.alcoholConsumption || ''}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-[#4caf50] transition duration-300"
                />
              ) : (
                <p className="text-gray-900">{patientData.alcoholConsumption}</p>
              )}
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Neurological Condition:</p>
              {isEditing ? (
                <input
                  type="text"
                  name="neurologicalCondition"
                  value={editedData?.neurologicalCondition || ''}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-[#4caf50] transition duration-300"
                />
              ) : (
                <p className="text-gray-900">{patientData.neurologicalCondition}</p>
              )}
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Created At:</p>
              <p className="text-gray-900">{formatDate(patientData.createdAt)}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Updated At:</p>
              <p className="text-gray-900">{formatDate(patientData.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons & Feature Buttons Section */}
        <div className="mt-8 flex justify-between items-center">
          <div className="flex space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 text-white bg-[#388e3c] rounded-lg shadow-md hover:bg-[#2c6d31] transition duration-300"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 text-white bg-[#d32f2f] rounded-lg shadow-md hover:bg-[#c62828] transition duration-300"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEditClick}
                className="px-6 py-3 text-white  bg-[#0A0A32] rounded-lg shadow-md  hover:bg-[#0277bd] transition duration-300"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Feature Buttons */}
          <div className="flex space-x-4">
            <button
                onClick={handleDetectAlzheimer} 
                className="px-6 py-3 text-white  bg-[#0A0A32] rounded-lg shadow-md hover:bg-[#0277bd] transition duration-300">
                Detect Alzheimer's
            </button>
            <button
                onClick={handleChatWithAI} 
                className="px-6 py-3 text-white bg-[#0A0A32] rounded-lg shadow-md hover:bg-[#0277bd] transition duration-300">
                Chat with AI
            </button>
            <button
                onClick={handleGradCAMAnalysis} 
                className="px-6 py-3 text-white bg-[#0A0A32] rounded-lg shadow-md hover:bg-[#0277bd] transition duration-300">
                Grad-CAM Analysis
            </button>
          </div>
        </div>

        {/* Patient Data Tables */}
        <div className="mt-8">
          <table className="min-w-full table-auto mb-6">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-gray-600">Condition</th>
                <th className="px-6 py-3 text-left text-gray-600">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-6 py-3 text-gray-700">Name</td>
                <td className="px-6 py-3 text-gray-700">{patientData.name}</td>
              </tr>
              <tr>
                <td className="px-6 py-3 text-gray-700">Age</td>
                <td className="px-6 py-3 text-gray-700">{patientData.age}</td>
              </tr>
              <tr>
                <td className="px-6 py-3 text-gray-700">Gender</td>
                <td className="px-6 py-3 text-gray-700">{patientData.gender}</td>
              </tr>
              <tr>
                <td className="px-6 py-3 text-gray-700">Smoker</td>
                <td className="px-6 py-3 text-gray-700">{patientData.smoker}</td>
              </tr>
              {/* Add other rows here */}
            </tbody>
          </table>
        </div>

      </motion.div>
    </div>
  );
}

export default ProfilePage;

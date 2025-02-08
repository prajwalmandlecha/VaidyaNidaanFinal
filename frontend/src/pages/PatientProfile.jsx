import React, { useState, useEffect } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import axios from "axios";

function PatientProfile() {
  const match = useMatch("/patient/:patientId");
  const patientId = match?.params?.patientId;
  const [patient, setPatient] = useState(null);
  const [originalPatientData, setOriginalPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!patientId) {
      setError("Patient ID is missing.");
      return;
    }

    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const response = await axios.get(
          `http://localhost:5005/api/patients/${patientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPatient(response.data);
        setOriginalPatientData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load patient data.");
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("cognitiveTests")) {
      // Update cognitiveTests array
      const [arrayName, index, field] = name.split(/[\[\].]+/); // split to extract the array name, index, and field
      setPatient((prevPatient) => {
        const updatedTests = [...prevPatient.cognitiveTests];
        updatedTests[index] = {
          ...updatedTests[index],
          [field]: value,
        };
        return {
          ...prevPatient,
          cognitiveTests: updatedTests,
        };
      });
    } else {
      // Update non-array fields
      setPatient((prevPatient) => ({
        ...prevPatient,
        [name]: value,
      }));
    }
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await axios.put(
        `http://localhost:5005/api/patients/${patientId}`,
        patient,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOriginalPatientData(response.data);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update patient data.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white p-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Dashboard
        </button>
        <div className="space-x-4">
          <button className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-700">Feature 1</button>
          <button className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-700">Feature 2</button>
          <button className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-700">Feature 3</button>
        </div>
      </div>

      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        {patient.name || "Patient"}'s Profile
      </h1>

      <div className="max-w-4xl mx-auto bg-white bg-opacity-80 backdrop-blur-lg shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Basic Information</h2>
        {isEditing ? (
          <div>
            <label className="block text-gray-600">Name:</label>
            <input
              type="text"
              name="name"
              value={patient.name || ""}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded-md"
            />
            <label className="block text-gray-600">Age:</label>
            <input
              type="number"
              name="age"
              value={patient.age || ""}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded-md"
            />
            <label className="block text-gray-600">Email:</label>
            <input
              type="email"
              name="email"
              value={patient.email || ""}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded-md"
            />
            <label className="block text-gray-600">Gender:</label>
            <input
              type="text"
              name="gender"
              value={patient.gender || ""}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded-md"
            />
          </div>
        ) : (
          <div>
            <p className="text-gray-600">Name: {patient.name || "Not Updated"}</p>
            <p className="text-gray-600">Age: {patient.age || "Not Updated"}</p>
            <p className="text-gray-600">Email: {patient.email || "Not Updated"}</p>
            <p className="text-gray-600">Gender: {patient.gender || "Not Updated"}</p>
          </div>
        )}

        <h3 className="text-xl font-semibold text-gray-800 mt-6">Brain Tumor Detection</h3>
        {isEditing ? (
          <div>
            <label className="block text-gray-600">Scan Type:</label>
            <input
              type="text"
              name="brainScan.scanType"
              value={patient.brainScan?.scanType || ""}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded-md"
            />
            <label className="block text-gray-600">Scan Date:</label>
            <input
              type="date"
              name="brainScan.scanDate"
              value={patient.brainScan?.scanDate || ""}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded-md"
            />
            <label className="block text-gray-600">Tumor Type:</label>
            <input
              type="text"
              name="brainScan.tumorType"
              value={patient.brainScan?.tumorType || ""}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded-md"
            />
          </div>
        ) : (
          <div>
            <p className="text-gray-600">Scan Type: {patient.brainScan?.scanType || "Not Updated"}</p>
            <p className="text-gray-600">
              Scan Date: {patient.brainScan?.scanDate ? new Date(patient.brainScan.scanDate).toLocaleDateString() : "Not Updated"}
            </p>
            <p className="text-gray-600">Tumor Type: {patient.brainScan?.tumorType || "Not Updated"}</p>
          </div>
        )}

        <h3 className="text-xl font-semibold text-gray-800 mt-6">Alzheimer's Detection</h3>
        {isEditing ? (
          <div>
            <label className="block text-gray-600">Biomarkers (comma-separated):</label>
            <input
              type="text"
              name="alzheimerBiomarkers"
              value={patient.alzheimerBiomarkers?.join(", ") || ""}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded-md"
            />
          </div>
        ) : (
          <div>
            <p className="text-gray-600">Biomarkers: {patient.alzheimerBiomarkers?.join(", ") || "Not Updated"}</p>
          </div>
        )}

        <h3 className="text-xl font-semibold text-gray-800 mt-6">Cognitive Test Results</h3>
        {isEditing ? (
          <div>
            {patient.cognitiveTests?.map((test, index) => (
              <div key={index} className="mb-4">
                <label className="block text-gray-600">Test Name:</label>
                <input
                  type="text"
                  name={`cognitiveTests[${index}].testName`}
                  value={test.testName || ""}
                  onChange={handleChange}
                  className="w-full p-2 mb-2 border rounded-md"
                />
                <label className="block text-gray-600">Score:</label>
                <input
                  type="number"
                  name={`cognitiveTests[${index}].score`}
                  value={test.score || ""}
                  onChange={handleChange}
                  className="w-full p-2 mb-2 border rounded-md"
                />
              </div>
            ))}
          </div>
        ) : (
          <div>
            {patient.cognitiveTests?.map((test, index) => (
              <div key={index} className="mb-4">
                <p className="text-gray-600">Test Name: {test.testName || "Not Updated"}</p>
                <p className="text-gray-600">Score: {test.score || "Not Updated"}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-between">
          {isEditing ? (
            <button
              onClick={handleSaveChanges}
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={handleEditToggle}
              className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-700"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientProfile;

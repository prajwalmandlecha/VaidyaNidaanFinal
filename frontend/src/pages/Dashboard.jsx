import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5005/api/patients", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch patients: ${response.statusText}`);
        }

        const data = await response.json();
        if (data && Array.isArray(data.patients)) {
          setPatients(data.patients);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Handle deleting a patient
  const handleDelete = async (patientId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5005/api/patients/${patientId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete patient");
      }

      setPatients(prevPatients =>
        prevPatients.filter(patient => patient.id !== patientId)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Redirect to login page
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D6F7E6] via-[#F1F9F2] to-white p-8 text-[#0A0A32]">
      {/* Navbar with Search Bar, Add Patient Button, and Logout Button */}
      <nav className="flex justify-between items-center bg-white text-[#0A0A32] p-4 rounded-xl mb-6 shadow-lg">
        <h1 className="text-3xl font-semibold">Dashboard</h1>

        <div className="flex items-center space-x-4 w-full justify-end">
          {/* Add Patient Button */}
          <Link to="/create-patient">
            <button className="px-12 py-3 text-[#0A0A32] bg-transparent border-2 border-[#0A0A32] rounded-xl shadow-md hover:bg-[#D0F0E0] hover:scale-105 transition duration-300 text-lg">
              Add Patient
            </button>
          </Link>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search patients by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full max-w-sm p-3 rounded-xl text-[#0A0A32] bg-white shadow-md focus:outline-none focus:ring-4 focus:ring-[#0A0A32] transition duration-300"
          />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#0A0A32] text-white rounded-xl hover:bg-[#0C0C40] shadow-md transition duration-300"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Loading State */}
      {loading && <p className="text-center text-[#0A0A32] text-lg mt-6">Loading patients...</p>}

      {/* Error State */}
      {error && <p className="text-center text-red-500 text-lg mt-6">{error}</p>}

      {/* Patient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white shadow-xl rounded-3xl p-6 transform hover:scale-105 transition duration-300 hover:bg-[#D0F0E0]"
          >
            <h2 className="text-2xl font-semibold text-[#0A0A32]">{patient.name}</h2>
            <p className="text-[#0A0A32] mt-2">Age: {patient.age}</p>
            <p className="text-[#0A0A32]">Gender: {patient.gender}</p>

            <div className="mt-4 flex justify-between items-center">
              <Link to={`/profile/${patient.id}`}>
                <button className="w-32 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0A0A32] to-[#0C0C40] text-white hover:bg-[#0A0A32] shadow-md transition duration-300">
                  View Profile
                </button>
              </Link>

              <button
                  onClick={() => handleDelete(patient.id)}
                  className="px-4 py-2 border-2 border-red-500 text-red-500 rounded-xl hover:border-red-700 hover:text-red-700 shadow-md transition duration-300"
                >
                  Delete
                </button>

            </div>
          </div>
        ))}
      </div>

      {/* No Patients Found */}
      {filteredPatients.length === 0 && !loading && (
        <p className="text-center text-[#0A0A32] text-lg mt-6">
          No patients found. Try adjusting your search.
        </p>
      )}
    </div>
  );
}

export default Dashboard;

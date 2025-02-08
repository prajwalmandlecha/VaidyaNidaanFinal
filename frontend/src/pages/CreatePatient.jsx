import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const CreatePatientForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    smoker: "",
    alcoholConsumption: "",
    neurologicalCondition: "",
  });

  const navigate = useNavigate(); // Initialize navigate for redirection

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5005/api/patients",
        formData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      console.log("Patient added successfully:", response.data);

      // Show success prompt
      alert("Patient added successfully!");

      // Redirect to the dashboard using navigate
      navigate("/dashboard");

    } catch (error) {
      console.error("Error adding patient:", error);
      // Handle error, maybe show an alert or notification
      alert("Failed to add patient. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D0F0E0] via-white to-[#D0F0E0] flex items-center justify-center p-8">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-3xl p-10 space-y-6">
        <h2 className="text-4xl font-bold text-center text-[#0A0A32]">Create Patient</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Patient Name"
            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A0A32] text-lg"
            required
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A0A32] text-lg"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A0A32] text-lg"
            required
          />

          <select
            name="smoker"
            value={formData.smoker}
            onChange={handleChange}
            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A0A32] text-lg"
            required
          >
            <option value="">Is the patient a smoker?</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <select
            name="alcoholConsumption"
            value={formData.alcoholConsumption}
            onChange={handleChange}
            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A0A32] text-lg"
            required
          >
            <option value="">Select Alcohol Consumption</option>
            <option value="Never">Never</option>
            <option value="Low">Low</option>
            <option value="High">High</option>
          </select>

          <select
            name="neurologicalCondition"
            value={formData.neurologicalCondition}
            onChange={handleChange}
            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A0A32] text-lg"
            required
          >
            <option value="">Does the patient have a neurological condition?</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <button
            type="submit"
            className="w-full bg-[#0A0A32] text-white py-4 rounded-xl shadow-lg hover:bg-[#0C0C40] transition duration-300 text-lg font-semibold"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePatientForm;

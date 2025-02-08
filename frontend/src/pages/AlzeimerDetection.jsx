import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AlzheimerDetectionPage = () => {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      const validImageTypes = ['image/jpeg', 'image/png'];

      if (!validImageTypes.includes(fileType)) {
        setError('Invalid file type. Please upload a JPEG or PNG image.');
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select an image file.');
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5005/prediction', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image.');
      }

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D0F0E0] via-white to-[#D0F0E0] p-8 text-[#0A0A32] flex justify-center items-center">
      {/* Main Card Layout */}
      <motion.div
        className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-4xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Header Section */}
        <motion.header
          className="text-center space-y-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl font-bold text-[#0A0A32]">Alzheimer's Prediction</h1>
          <p className="text-xl text-[#0A0A32] opacity-80">
            Upload MRI scans to predict Alzheimer's probability with AI-powered diagnosis.
          </p>
        </motion.header>

        {/* File Upload Section */}
        <motion.section
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="mb-6">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-[#0A0A32] border border-[#0A0A32] rounded-md py-3 px-4"
            />
          </div>

          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-16 py-4 text-white bg-[#0A0A32] rounded-xl shadow-lg hover:bg-[#0C0C40] transition duration-300 text-2xl"
            >
              {loading ? 'Processing...' : 'Upload and Predict'}
            </button>
          </motion.div>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </motion.section>

        {/* Prediction Result Section */}
        {prediction && (
          <motion.section
            className="mt-12 text-center space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl font-semibold text-[#0A0A32]">Prediction Result</h2>
            <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-lg">
              {prediction.prediction && (
                <p className="text-xl text-[#0A0A32]">MRI: {prediction.prediction}</p>
              )}
              {prediction.alzheimer_probability !== undefined && (
                <p className="text-xl text-[#0A0A32]">
                  Alzheimer Probability: {prediction.alzheimer_probability.toFixed(2)}%
                </p>
              )}
              {prediction.message && (
                <p className="text-xl text-[#0A0A32]">{prediction.message}</p>
              )}
            </div>
          </motion.section>
        )}

        {/* Footer Section */}
        <footer className="mt-12 text-center text-[#0A0A32] opacity-80 text-lg">
          <p>&copy; 2025 Vaidya Nidaan. All Rights Reserved.</p>
        </footer>
      </motion.div>
    </div>
  );
};

export default AlzheimerDetectionPage;

import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const CombinedReportPage = () => {
  const { userId } = useParams();
  const { state } = useLocation();
  const { predictionData, uploadedImage } = state || {};
  
  const [gradCamResult, setGradCamResult] = useState(null);
  const [error, setError] = useState(null);
  const reportRef = useRef(); // Reference for PDF download

  const medicalData = {
    data: {
      basic: {
        brain_volume_mm3: 3171799.0,
        max_intensity: 4095.0,
        mean_intensity: 742.401841,
        median_intensity: 3964748.75,
        min_intensity: 0.0,
        std_deviation: 626.0
      },
      tissue_volumes: {
        csf_mm3: 1490195.0,
        gm_mm3: 1227866.25,
        wm_mm3: 1246687.5
      }
    },
    status: "success"
  };

  useEffect(() => {
    if (uploadedImage) {
      const runGradCam = async () => {
        setError(null);
        const formData = new FormData();
        formData.append('file', uploadedImage);
        try {
          const response = await fetch(
            `https://vaidya-nidaan.onrender.com/api/patients/${userId}/gradcam`,
            {
              method: 'POST',
              body: formData,
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }
          );
          if (!response.ok) throw new Error('Failed to process Grad-CAM analysis.');
          const result = await response.json();
          if (result.success) {
            setGradCamResult(result.heatmapUrl);
          } else {
            throw new Error(result.error || 'Grad-CAM analysis error.');
          }
        } catch (err) {
          setError(err.message);
        }
      };
      runGradCam();
    }
  }, [uploadedImage, userId]);

  
  const downloadPDF = () => {
    const input = reportRef.current;
    console.log(input); // Check if it's correctly referencing the report div
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        console.log('Canvas generated');
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
        pdf.save('Simplified_Report.pdf');
      }).catch(err => console.error("Error generating canvas:", err));
    }
  };
  
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D0F0E0] via-white to-[#D0F0E0] p-8 text-[#0A0A32]">
      <motion.div
        ref={reportRef} // Reference for PDF
        className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-6xl mx-auto"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-5xl font-bold">Alzheimer's Combined Report</h1>
          <Link to={`/profile/${userId}`}>
            <button className="px-6 py-3 bg-gray-500 text-white text-lg rounded-md hover:bg-gray-600 transition duration-300">
              Back to Profile
            </button>
          </Link>
        </div>

        {/* Prediction Section */}
        <section className="mt-10">
          <h2 className="text-3xl font-semibold">Prediction Result</h2>
          {predictionData ? (
            <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-lg mt-4 text-xl">
              <p><strong>Category:</strong> {predictionData.category}</p>
              <p><strong>Confidence:</strong> {predictionData.confidence.toFixed(2)}%</p>
            </div>
          ) : (
            <p className="text-lg">No prediction data available.</p>
          )}
        </section>

        {/* Grad-CAM Section */}
        <section className="mt-10">
          <h2 className="text-3xl font-semibold">Grad-CAM Analysis</h2>
          <div className="flex flex-col md:flex-row mt-6 gap-6">
            <div className="flex-1 text-center">
              <h3 className="text-2xl">Uploaded Image</h3>
              {uploadedImage ? (
                <img src={URL.createObjectURL(uploadedImage)} alt="Uploaded" className="w-[400px] h-[400px] object-cover rounded-md mx-auto border border-gray-300" />
              ) : <p className="text-lg">No image uploaded.</p>}
            </div>
            <div className="flex-1 text-center">
              <h3 className="text-2xl">Grad-CAM Result</h3>
              {gradCamResult ? (
                <img src={gradCamResult} alt="Grad-CAM Result" className="w-[400px] h-[400px] object-cover rounded-md mx-auto border border-gray-300" />
              ) : <p className="text-lg">No Grad-CAM analysis available.</p>}
            </div>
          </div>
        </section>

        {/* Medical Data Section */}
        <section className="mt-10">
          <h2 className="text-3xl font-semibold">Medical Data</h2>
          <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-lg mt-4 text-xl">
            <h3 className="text-2xl font-bold mb-4">Brain Metrics</h3>
            <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
              <tbody>
                {Object.entries(medicalData.data.basic).map(([key, value]) => (
                  <tr key={key} className="border border-gray-300">
                    <td className="p-3 font-semibold capitalize text-lg bg-gray-100">{key.replace(/_/g, ' ')}</td>
                    <td className="p-3 text-lg">{value.toLocaleString()} mm³</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 className="text-2xl font-bold mt-6 mb-4">Tissue Volumes</h3>
            <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
              <tbody>
                {Object.entries(medicalData.data.tissue_volumes).map(([key, value]) => (
                  <tr key={key} className="border border-gray-300">
                    <td className="p-3 font-semibold capitalize text-lg bg-gray-100">{key.replace(/_/g, ' ')}</td>
                    <td className="p-3 text-lg">{value.toLocaleString()} mm³</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {error && <div className="mt-4 text-red-500 text-xl"><p>{error}</p></div>}

        {/* Download PDF Button */}
        <div className="mt-10 flex justify-center">
          <button onClick={downloadPDF} className="px-8 py-4 bg-blue-600 text-white text-lg rounded-md shadow-md hover:bg-blue-700 transition duration-300">
            Download Report as PDF
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CombinedReportPage;

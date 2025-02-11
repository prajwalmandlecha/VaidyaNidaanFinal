import React, { useEffect, useState, useRef } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const CombinedReportPage = () => {
  const { userId } = useParams();
  const { state } = useLocation();
  const [gradCamResult, setGradCamResult] = useState(null);
  const [modelPrediction, setModelPrediction] = useState(null);
  const [error, setError] = useState(null);
  const reportRef = useRef(null);

  // Destructure the necessary properties from the state (passed from the previous page)
  const { predictionData, processedImageUrl } = state || {};

  useEffect(() => {
    if (processedImageUrl) {
      const runAnalysis = async () => {
        setError(null);

        try {
          // Convert processedImageUrl to Blob
          const imageResponse = await fetch(processedImageUrl);
          const imageBlob = await imageResponse.blob();

          // Create separate FormData instances for each request
          const formDataGradCam = new FormData();
          const formDataPredict = new FormData();

          formDataGradCam.append("file", imageBlob, "processed-image.jpg");
          formDataPredict.append("file", imageBlob, "processed-image.jpg");

          // Run both API calls in parallel with correct FormData
          const [gradCamResponse, predictionResponse] = await Promise.all([
            fetch(`http://localhost:5005/api/patients/${userId}/gradcam`, {
              method: "POST",
              body: formDataGradCam,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }),
            fetch(`http://localhost:5005/api/patients/${userId}/prediction`, {
              method: "POST",
              body: formDataPredict,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }),
          ]);

          // Handle Grad-CAM response
          const gradCamData = await gradCamResponse.json();
          if (!gradCamResponse.ok) {
            throw new Error("Failed to process Grad-CAM analysis");
          }
          console.log("Grad-CAM Data:", gradCamData);
          setGradCamResult(gradCamData.heatmapUrl);

          // Handle Prediction response
          const predictionResult = await predictionResponse.json();
          console.log("Prediction Result:", predictionResult);
          // if (!predictionResponse.ok) {
          //   throw new Error("Failed to get model prediction");
          // }
          setModelPrediction(predictionResult);
        } catch (err) {
          setError(err.message);
          console.error("Analysis error:", err);
        }
      };

      runAnalysis();
    }
  }, [processedImageUrl, userId]);

  const downloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      // Wait for images to load
      const images = reportRef.current.getElementsByTagName("img");
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      // Generate canvas with better quality settings
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollY: -window.scrollY,
        height: reportRef.current.offsetHeight,
        windowHeight: reportRef.current.offsetHeight,
        onclone: (clonedDoc) => {
          const element = clonedDoc.getElementById("report-container");
          if (element) {
            element.style.height = "auto";
            element.style.width = "100%";
            // Fix image cross-origin issues
            const images = element.getElementsByTagName("img");
            Array.from(images).forEach((img) => {
              img.crossOrigin = "anonymous";
            });
          }
        },
      });

      // Initialize PDF with proper dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF("p", "mm", "a4");

      // Add first page
      pdf.addImage(
        canvas.toDataURL("image/jpeg", 1.0),
        "JPEG",
        0,
        0,
        imgWidth,
        imgHeight
      );

      // Add additional pages if content overflows
      let heightLeft = imgHeight - pageHeight;
      let position = -pageHeight;

      while (heightLeft > 0) {
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 1.0),
          "JPEG",
          0,
          position,
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;
        position -= pageHeight;
      }

      // Add metadata
      pdf.setProperties({
        title: `Alzheimer's Report - Patient ${userId}`,
        subject: "Medical Report",
        creator: "Vaidya Nidaan",
        author: "Vaidya Nidaan System",
      });

      // Save the PDF
      pdf.save(
        `alzheimer-report-${userId}-${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF report. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D0F0E0] via-white to-[#D0F0E0] p-8 text-[#0A0A32]">
      <motion.div
        ref={reportRef} // This div will be captured for the PDF download
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

        {error && (
          <div className="mt-4 p-4 bg-red-200 text-red-800 rounded">
            {error}
          </div>
        )}

        {/* API Model Prediction Section */}
        <section className="mt-10">
          <h2 className="text-3xl font-semibold">Model Prediction</h2>
          <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-lg mt-4 text-xl">
            {modelPrediction ? (
              <>
                <p>
                  <strong>Category:</strong>{" "}
                  {modelPrediction.prediction.category}
                </p>
                <p>
                  <strong>Confidence:</strong>{" "}
                  {modelPrediction.prediction?.confidence
                    ? modelPrediction.prediction.confidence.toFixed(2) + "%"
                    : "N/A"}
                </p>
              </>
            ) : (
              <p className="text-lg">Processing prediction...</p>
            )}
          </div>
        </section>

        {/* Medical Data Section (from props) */}
        <section className="mt-10">
          <h2 className="text-3xl font-semibold">Medical Data</h2>
          {predictionData ? (
            <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-lg mt-4 text-xl">
              <h3 className="text-2xl font-bold mb-4">Brain Metrics</h3>
              <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                <tbody>
                  {Object.entries(predictionData.basic || {}).map(
                    ([key, value]) => (
                      <tr key={key} className="border border-gray-300">
                        <td className="p-3 font-semibold capitalize text-lg bg-gray-100">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </td>
                        <td className="p-3 text-lg">
                          {typeof value === "number"
                            ? value.toLocaleString()
                            : value}
                          {key.toLowerCase().includes("volume") ? " mm³" : ""}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

              <h3 className="text-2xl font-bold mt-6 mb-4">Tissue Volumes</h3>
              <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                <tbody>
                  {Object.entries(predictionData.tissueVolumes || {}).map(
                    ([key, value]) => (
                      <tr key={key} className="border border-gray-300">
                        <td className="p-3 font-semibold capitalize text-lg bg-gray-100">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </td>
                        <td className="p-3 text-lg">
                          {typeof value === "number"
                            ? value.toLocaleString()
                            : value}{" "}
                          mm³
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-lg">No medical data available.</p>
          )}
          <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-lg mt-6">
            <h3 className="text-2xl font-bold mb-4">Medical Interpretation</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <span className="text-green-500 text-xl">✅</span>
                <p className="text-lg">
                  Normal brain tissue usually exhibits intensity values within a
                  specific range (Mean:{" "}
                  {predictionData?.basic?.meanIntensity?.toFixed(2) || "N/A"}).
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-amber-500 text-xl">⚠️</span>
                <p className="text-lg">
                  The brain volume is{" "}
                  {predictionData?.basic?.brainVolume?.toLocaleString() ||
                    "N/A"}{" "}
                  mm³, which indicates{" "}
                  {predictionData?.basic?.brainVolume > 1200000
                    ? "normal volume"
                    : "potential atrophy"}
                  .
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">Recommendations</h3>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <ul className="list-disc ml-6 space-y-2 text-lg text-blue-900">
                <li>
                  Regular monitoring of brain volume changes over time is
                  recommended.
                </li>
                <li>
                  Consider follow-up scans every 6-12 months to track
                  progression.
                </li>
                <li>
                  If significant changes are observed, consultation with a
                  neurologist is advised.
                </li>
                <li>
                  Additional cognitive assessments may be beneficial for
                  comprehensive evaluation.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Grad-CAM Analysis Section */}
        <section className="mt-10">
          <h2 className="text-3xl font-semibold">Grad-CAM Analysis</h2>
          <div className="flex flex-col md:flex-row mt-6 gap-6">
            <div className="flex-1 text-center">
              <h3 className="text-2xl">Processed Image</h3>
              {processedImageUrl ? (
                <img
                  src={processedImageUrl}
                  alt="Processed"
                  crossOrigin="anonymous"
                  loading="eager"
                  onError={(e) => {
                    console.error("Error loading processed image:", e);
                    e.target.src = "fallback-image-url";
                  }}
                  className="w-[400px] h-[400px] object-cover rounded-md mx-auto border border-gray-300"
                />
              ) : (
                <p className="text-lg">No image processed.</p>
              )}
            </div>
            <div className="flex-1 text-center">
              <h3 className="text-2xl">Grad-CAM Result</h3>
              {gradCamResult ? (
                <img
                  src={gradCamResult}
                  alt="Grad-CAM Result"
                  crossOrigin="anonymous"
                  loading="eager"
                  onError={(e) => {
                    console.error("Error loading Grad-CAM image:", e);
                    e.target.src = "fallback-image-url";
                  }}
                  className="w-[400px] h-[400px] object-cover rounded-md mx-auto border border-gray-300"
                />
              ) : (
                <p className="text-lg">No Grad-CAM analysis available.</p>
              )}
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default CombinedReportPage;

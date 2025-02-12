import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";

const AlzheimerDetectionPage = () => {
  const [imgFile, setImgFile] = useState(null);
  const [hdrFile, setHdrFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { userId: patientId } = useParams();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileName = selectedFile.name.toLowerCase();

      if (e.target.name === "img") {
        if (!fileName.endsWith(".img")) {
          setError("Please upload a valid .img file");
          setImgFile(null);
          return;
        }
        setImgFile(selectedFile);
        // Only clear error if both files are present
        if (hdrFile) setError(null);
      } else if (e.target.name === "hdr") {
        if (!fileName.endsWith(".hdr")) {
          setError("Please upload a valid .hdr file");
          setHdrFile(null);
          return;
        }
        setHdrFile(selectedFile);
        // Only clear error if both files are present
        if (imgFile) setError(null);
      }
    }
  };

  const handleSubmit = async () => {
    // Validate both files are present
    if (!imgFile && !hdrFile) {
      setError("Please select both .img and .hdr files");
      return;
    } else if (!imgFile) {
      setError("Please select a .img file");
      return;
    } else if (!hdrFile) {
      setError("Please select a .hdr file");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("img_file", imgFile);
    formData.append("hdr_file", hdrFile);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_ML_SERVER_URL}/fslanalyze`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload files");
      }
      const data = await response.json();
      navigate(`/report/${patientId}`, {
        state: {
          predictionData: {
            basic: {
              brainVolume: data.data.basic.brain_volume_mm3,
              maxIntensity: data.data.basic.max_intensity,
              meanIntensity: data.data.basic.mean_intensity,
              medianIntensity: data.data.basic.median_intensity,
              minIntensity: data.data.basic.min_intensity,
              stdDeviation: data.data.basic.std_deviation,
            },
            tissueVolumes: {
              cerebroSpinalFluid: data.data.tissue_volumes.csf_mm3,
              grayMatter: data.data.tissue_volumes.gm_mm3,
              whiteMatter: data.data.tissue_volumes.wm_mm3,
            },
          },
          processedImageUrl: data.image_url,
          uploadedImgFile: imgFile,
          uploadedHdrFile: hdrFile,
          status: data.status,
        },
      });
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "An error occurred while processing the files");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D0F0E0] via-white to-[#D0F0E0] p-8 text-[#0A0A32] flex justify-center items-center">
      <motion.div
        className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-4xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.header
          className="text-center space-y-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl font-bold text-[#0A0A32]">
            Alzheimer's Prediction
          </h1>
          <p className="text-xl text-[#0A0A32] opacity-80">
            Upload MRI scans to predict Alzheimer's probability with AI-powered
            diagnosis.
          </p>
        </motion.header>

        <motion.section
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[#0A0A32] pb-2">
              Upload MRI Scan as a .img and .hdr respectively
            </h2>
            <input
              type="file"
              name="img"
              accept=".img"
              onChange={handleFileChange}
              className="block w-full text-sm text-[#0A0A32] border border-[#0A0A32] rounded-md py-3 px-4"
              placeholder="Upload .img file"
            />

            <input
              type="file"
              name="hdr"
              accept=".hdr"
              onChange={handleFileChange}
              className="block w-full text-sm text-[#0A0A32] border border-[#0A0A32] rounded-md py-3 px-4 mt-4"
              placeholder="Upload .hdr file"
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
              {loading ? "Processing..." : "Upload and Predict"}
            </button>
          </motion.div>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </motion.section>

        <footer className="mt-12 text-center text-[#0A0A32] opacity-80 text-lg">
          <p>&copy; 2025 Vaidya Nidaan. All Rights Reserved.</p>
        </footer>
      </motion.div>
    </div>
  );
};

export default AlzheimerDetectionPage;

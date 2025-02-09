import React, { useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { FiPaperclip } from "react-icons/fi"; // Import the file icon

function ChatWithAIPage() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileType, setFileType] = useState(""); // New state for file type
  const [file, setFile] = useState(null); // State to hold the uploaded file
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to handle dropdown visibility
  const [isFirstQuery, setIsFirstQuery] = useState(true); // State to track if it's the first query

  const handleMessageChange = (e) => {
    setUserMessage(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Set the file selected by the user
  };

  const handleFileTypeChange = (type) => {
    if (type === "none") {
      setFileType(""); // Reset file type and file input
      setFile(null);
    } else {
      setFileType(type); // Set the selected file type (audio or image)
    }
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim() && !file) return; // Don't send empty message if no file and message

    // If it's the first query and no file is provided, show an error
    if (isFirstQuery && !file) {
      alert("Please upload an image for the first query.");
      return;
    }

    setMessages([...messages, { sender: "user", message: userMessage }]);
    setUserMessage("");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("text", userMessage); // Append the text message

    // If there is a file, append it as well
    if (file) {
      formData.append("file", file);
    }

    let endpoint = isFirstQuery
      ? "http://localhost:5005/chatbot/upload" // Endpoint for first query with image
      : "http://localhost:5005/chatbot/query"; // Endpoint for follow-up query (text-only)

    try {
      const response = await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const aiMessage = response.data.analysisResult; // Updated to match backend response
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "ai", message: aiMessage, file: file, fileType: fileType }, // Include the file and file type in the message
      ]);

      // After the first query, set isFirstQuery to false
      if (isFirstQuery) {
        setIsFirstQuery(false);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      alert("Failed to process the request. Please try again.");
    } finally {
      setIsLoading(false);
      setFile(null); // Clear file after sending
      setFileType(""); // Reset file type after sending
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D0F0E0] via-white to-[#D0F0E0] flex justify-center items-center p-8">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-6xl flex flex-col">
        <h2 className="text-4xl font-bold text-gray-800">Chat with AI</h2>
        <p className="text-lg text-gray-600 mt-4">
          {isFirstQuery
            ? "Please upload an image and ask your question."
            : "Ask anything, and the AI will explain its reasoning!"}
        </p>

        <div className="mt-8 overflow-y-auto max-h-[400px] p-4 border-2 border-gray-300 rounded-lg">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`my-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}
            >
              <p
                className={`font-semibold ${
                  msg.sender === "user" ? "text-blue-500" : "text-gray-700"
                }`}
              >
                {msg.sender === "user" ? "You:" : "AI:"}
              </p>
              <p className="text-gray-800">{msg.message}</p>

              {/* Display the uploaded file (image or audio) */}
              {msg.file && (
                <div className="mt-2">
                  {msg.fileType === "image" && (
                    <img
                      src={URL.createObjectURL(msg.file)}
                      alt="Uploaded"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                  {msg.fileType === "audio" && (
                    <audio controls className="w-full mt-2">
                      <source src={URL.createObjectURL(msg.file)} type={`audio/${msg.file.name.split('.').pop()}`} />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="my-2 text-left">
              <p className="text-gray-500">AI is thinking...</p>
            </div>
          )}
        </div>

        <div className="flex mt-4 space-x-4">
          <input
            type="text"
            value={userMessage}
            onChange={handleMessageChange}
            className="w-full p-2 border-2 border-gray-300 rounded-lg"
            placeholder="Ask me anything..."
          />

          {/* File icon with dropdown */}
          <div className="relative">
            <FiPaperclip
              className="text-xl mt-2.5 text-gray-500 cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />
            {isDropdownOpen && (
              <div className="absolute bg-white shadow-lg rounded-lg border-2 border-gray-300 mt-2 w-40">
                <button
                  className="w-full p-2 text-gray-700 hover:bg-gray-200"
                  onClick={() => handleFileTypeChange("audio")}
                >
                  Audio
                </button>
                <button
                  className="w-full p-2 text-gray-700 hover:bg-gray-200"
                  onClick={() => handleFileTypeChange("image")}
                >
                  Image
                </button>
                <button
                  className="w-full p-2 text-gray-700 hover:bg-gray-200"
                  onClick={() => handleFileTypeChange("none")}
                >
                  No File
                </button>
              </div>
            )}
          </div>

          {/* File input field for uploading the file */}
          {fileType && (
            <input
              type="file"
              accept={fileType === "audio" ? "audio/*" : "image/*"}
              onChange={handleFileChange}
              className="p-2 border-2 border-gray-300 rounded-lg"
            />
          )}

          <button
            onClick={handleSendMessage}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            Send
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link to={`/dashboard`}>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300">
              Go to Dashboard
            </button>
          </Link>
          <Link to={`/profile/${userId}`} className="mt-4 ml-4 inline-block">
            <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300">
              Go back to Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ChatWithAIPage;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import CreatePatient from './pages/CreatePatient';
import PatientProfile from './pages/PatientProfile';
import LandingPage from './pages/Landing';
import PrivateRoute from './components/PrivateRoute'; 
import ProfilePage from './pages/ProfilePage';
import AlzheimerDetectionPage from './pages/AlzeimerDetection';
import GradCamAnalysisPage from './pages/GRAD-CAM';
import ChatWithAIPage from './pages/Chatbot';
import FileUpload from './pages/temp';
import CombinedReportPage from './pages/ReportGeneration';
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/grad-cam/:userId" element={<GradCamAnalysisPage />} />
          <Route path="/alzheimers-detection/:userId" element={<AlzheimerDetectionPage />} />
          <Route path="/chat-with-ai/:userId" element={<ChatWithAIPage />} />
          <Route path="/file-upload" element={<FileUpload />} />
          <Route path="/report/:userId" element={<CombinedReportPage />} />
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={<PrivateRoute element={Dashboard} />}
          />
          <Route
            path="/create-patient"
            element={<PrivateRoute element={CreatePatient} />}
          />
          <Route
            path="/patient/:id"
            element={<PrivateRoute element={PatientProfile} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

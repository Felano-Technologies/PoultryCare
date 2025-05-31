import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Dashboard from "./pages/Dashboard";
import Vaccinations from "./pages/Vaccinations";
import Pedigree from "./pages/Pedigree";
import Community from "./pages/Community";
import Login from "./pages/Login";
import LandPage from "./pages/LandPage";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AI from "./pages/AI";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import FarmSetup from "./pages/FarmSetup";
import FlockDetails from "./pages/FlockDetails";
import Flocks from "./pages/Flocks";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <AI />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vaccinations"
          element={
            <ProtectedRoute>
              <Vaccinations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedigree"
          element={
            <ProtectedRoute>
              <Pedigree />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farm-setup"
          element={
            <ProtectedRoute>
              <FarmSetup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/flock-details/:id"
          element={
            <ProtectedRoute>
              <FlockDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/flocks"
          element={
            <ProtectedRoute>
              <Flocks />
            </ProtectedRoute>
          }
        />


        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;

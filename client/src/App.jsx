import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Home from "./pages/Home";
import Vaccinations from "./pages/Vaccinations";
import Pedigree from "./pages/Pedigree";
import Treatment from "./pages/Treatment";
import Consultation from "./pages/Consultation";
import Community from "./pages/Community";
import Biosecurity from "./pages/Biosecurity";
import Diagnosis from "./pages/Diagnosis"; 
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
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
          path="/treatment"
          element={
            <ProtectedRoute>
              <Treatment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultation"
          element={
            <ProtectedRoute>
              <Consultation />
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
          path="/biosecurity"
          element={
            <ProtectedRoute>
              <Biosecurity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diagnosis"
          element={
            <ProtectedRoute>
              <Diagnosis />
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

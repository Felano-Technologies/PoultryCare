import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { motion } from "framer-motion";
import { toast } from 'react-toastify';
import { registerUser } from "../services/api";

const Register = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [farmName, setFarmName] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [farmSize, setFarmSize] = useState("");

  const navigate = useNavigate();
  const phoneRegex = /^[0-9]{10,15}$/;

  const validateForm = () => {
    if (!phoneNumber || !password || !farmName || !role || !location || !experience || (role === "Poultry Farmer" && !farmSize)) {
      toast.error("Please fill in all required fields");
      return false;
    }
    if (!phoneRegex.test(phoneNumber)) {
      toast.error("Enter a valid phone number");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await registerUser({
        phoneNumber,
        password,
        farmName,
        role,
        location,
        experience,
        farmSize: role === "Poultry Farmer" ? farmSize : null,
      });
      if (response.message === "User registered successfully") {
        toast.success("Account created!");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthLayout title="Create your PoultryCare account">
      <motion.form
        onSubmit={handleRegister}
        className="space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Farm Name */}
        <div className="relative">
          <input
            type="text"
            placeholder="Farm Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            value={farmName}
            onChange={(e) => setFarmName(e.target.value)}
            required
          />
        </div>

        {/* Phone Number */}
        <div className="relative">
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Role */}
        <div className="relative">
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select your Role</option>
            <option value="Poultry Farmer">Poultry Farmer</option>
            <option value="Extension Officer">Extension Officer</option>
            <option value="Veterinarian">Veterinarian</option>
            <option value="Agricultural Biotechnologist">Agricultural Biotechnologist</option>
          </select>
        </div>

        {/* Location */}
        <div className="relative">
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            <option value="">Select your Location</option>
            <option value="Urban area">Urban Area</option>
            <option value="Rural area">Rural Area</option>
          </select>
        </div>

        {/* Experience */}
        <div className="relative">
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
          >
            <option value="">Select Years of Experience</option>
            <option value="Less than 1 year">Less than 1 year</option>
            <option value="1–5 years">1–5 years</option>
            <option value="5–10 years">5–10 years</option>
            <option value="More than 10 years">More than 10 years</option>
          </select>
        </div>

        {/* Farm Size (only if role is Poultry Farmer) */}
        {role === "Poultry Farmer" && (
          <div className="relative">
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              value={farmSize}
              onChange={(e) => setFarmSize(e.target.value)}
              required
            >
              <option value="">Select Farm Size</option>
              <option value="Small-scale">Small-scale (less than 100 birds)</option>
              <option value="Medium-scale">Medium-scale (100–500 birds)</option>
              <option value="Large-scale">Large-scale (more than 500 birds)</option>
            </select>
          </div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition"
        >
          Register
        </motion.button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 hover:underline">
            Login
          </Link>
        </p>
      </motion.form>
    </AuthLayout>
  );
};

export default Register;

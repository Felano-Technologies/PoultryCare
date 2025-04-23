import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { motion } from "framer-motion";
import { toast } from 'react-toastify';
import { registerUser } from "../services/api";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [farmName, setFarmName] = useState("");
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmailAndPassword = ({ email, password }) => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return false;
    }
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address");
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
    if (!email || !password || !farmName) {
      toast.error("All fields are required");
      return;
    }
    if (!validateEmailAndPassword({ email, password })) return;
  
    try {
      const response = await registerUser( email, password, farmName );
      if(response.message == "User registered successfully"){
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
        <div className="relative">
          <input
            type="text"
            placeholder="Farm Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-transform duration-300 transform hover:scale-105 bg-white placeholder:text-gray-400"
            value={farmName}
            onChange={(e) => setFarmName(e.target.value)}
            required
          />
        </div>
        <div className="relative">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-transform duration-300 transform hover:scale-105 bg-white placeholder:text-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-transform duration-300 transform hover:scale-105 bg-white placeholder:text-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
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

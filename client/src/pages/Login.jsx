import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { motion } from "framer-motion";
import { toast } from 'react-toastify';
import { loginUser } from "../services/api";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const phoneRegex = /^[0-9]{10,15}$/;

  const validatePhoneAndPassword = ({ phoneNumber, password }) => {
    if (!phoneNumber || !password) {
      toast.error("Please fill in all fields");
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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validatePhoneAndPassword({ phoneNumber, password })) return;

    try {
      const response = await loginUser({ phoneNumber, password });
      toast.success("Login successful!");
      console.alert(response)
      console.log(response)
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthLayout title="Login to PoultryCare">
      <motion.form
        onSubmit={handleLogin}
        className="space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition"
        >
          Login
        </motion.button>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-green-600 hover:underline">
            Register
          </Link>
        </p>
      </motion.form>
    </AuthLayout>
  );
};

export default Login;

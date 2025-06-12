import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { motion } from "framer-motion";
import { toast } from 'react-toastify';
import { loginUser } from "../services/api";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // <-- Loading state
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

    setLoading(true); // Start loading
    try {
      const response = await loginUser({ phoneNumber, password });
      toast.success("Login successful!");
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false); // Stop loading
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
          disabled={loading}
          whileHover={{ scale: !loading ? 1.05 : 1 }}
          whileTap={{ scale: !loading ? 0.95 : 1 }}
          className={`w-full flex items-center justify-center gap-2 ${
            loading ? "bg-green-400 cursor-not-allowed" : "bg-gradient-to-r from-green-500 to-green-600"
          } text-white py-3 rounded-lg shadow-md transition`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                />
              </svg>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </motion.button>

        <div className="text-center text-sm text-gray-500 space-y-2">
          <p>
            <Link 
              to="/forgot-password" 
              className="text-green-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </p>
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-green-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </motion.form>
    </AuthLayout>
  );
};

export default Login;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { motion } from "framer-motion";
import { toast } from 'react-toastify';
import { sendOTP, verifyOTP, resetPassword } from "../services/api";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1 = enter email, 2 = verify OTP, 3 = new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await sendOTP(email);
      toast.success("Verification code sent!");
      setStep(2);
      startCountdown();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(email, otp);
      toast.success("Verification successful!");
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email, newPassword);
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resendOTP = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    try {
      await sendOTP(email);
      toast.success("New verification code sent!");
      startCountdown();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset Your Password">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div className="relative">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  Sending...
                </>
              ) : (
                "Send Verification Code"
              )}
            </motion.button>

            <p className="text-center text-sm text-gray-500">
              Remember your password?{" "}
              <Link to="/login" className="text-green-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="text-center mb-4">
              <p className="text-gray-600">
                Enter the 6-digit code sent to {email}
              </p>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Verification Code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
            </div>

            <div className="text-center text-sm">
              {countdown > 0 ? (
                <p className="text-gray-500">
                  Resend code in {countdown} seconds
                </p>
              ) : (
                <button
                  type="button"
                  onClick={resendOTP}
                  className="text-green-600 hover:underline focus:outline-none"
                >
                  Resend Code
                </button>
              )}
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
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </motion.button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="relative">
              <input
                type="password"
                placeholder="New Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Updating...
                </>
              ) : (
                "Reset Password"
              )}
            </motion.button>
          </form>
        )}
      </motion.div>
    </AuthLayout>
  );
};

export default ForgotPassword;
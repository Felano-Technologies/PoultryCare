import User from "../models/User.js"; 
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';


const otpStore = {};

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


export const register = async (req, res) => {
  let { phoneNumber, email, password, farmName, role, location, experience, farmSize } = req.body;

  if (!phoneNumber || !email || !password || !farmName || !role || !location || !experience) {
    return res.status(400).json({ message: "All fields are required" });
  }

  phoneNumber = phoneNumber.replace(/\s+/g, '').toLowerCase();

  try {
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      phoneNumber,
      email,
      password: hashedPassword,
      farmName,
      role,
      location,
      experience,
      farmSize: role === "Poultry Farmer" ? farmSize : null,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  let { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  phoneNumber = phoneNumber.replace(/\s+/g, '').toLowerCase();

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getProfile = async (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(req.user);
};

export const sendPasswordResetOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide a valid email address' 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'No account found with this email' 
      });
    }

    const otp = generateOTP();

    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes expiry
    };

    const mailOptions = {
      from: `"PoultryCare" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">PoultryCare Password Reset</h2>
          <p>Your password reset OTP is:</p>
          <h3 style="background: #f4f4f4; padding: 10px; display: inline-block; border-radius: 5px;">
            ${otp}
          </h3>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #777;">© ${new Date().getFullYear()} PoultryCare. All rights reserved.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Password reset OTP sent to your email'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to send OTP email' 
    });
  }
};

export const verifyPasswordResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!otp || !otp.match(/^\d{6}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP format (must be 6 digits)' 
      });
    }

    const stored = otpStore[email];

    if (!stored) {
      return res.status(400).json({ 
        success: false, 
        message: 'No OTP requested for this email' 
      });
    }

    if (stored.expiresAt < Date.now()) {
      delete otpStore[email];
      return res.status(400).json({ 
        success: false, 
        message: 'OTP expired. Please request a new one.' 
      });
    }

    if (stored.otp !== otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP' 
      });
    }

    delete otpStore[email];

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const tempToken = jwt.sign(
      { userId: user._id, email },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      tempToken
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to verify OTP' 
    });
  }
};

export const resetUserPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      });
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.email !== email) {
          return res.status(401).json({ 
            success: false, 
            message: 'Invalid token for this email' 
          });
        }
      } catch (jwtError) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid or expired verification token' 
        });
      }
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Send confirmation email
    const mailOptions = {
      from: `"PoultryCare" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Changed Successfully',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Password Updated</h2>
          <p>Your PoultryCare account password has been successfully changed.</p>
          <p>If you didn't make this change, please contact our support team immediately.</p>
          <hr style="border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #777;">© ${new Date().getFullYear()} PoultryCare. All rights reserved.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to reset password' 
    });
  }
};

// Helper function to generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
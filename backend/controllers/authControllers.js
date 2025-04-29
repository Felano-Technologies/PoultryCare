import User from "../models/User.js"; 
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  let { phoneNumber, password, farmName, role, location, experience, farmSize } = req.body;

  if (!phoneNumber || !password || !farmName || !role || !location || !experience) {
    return res.status(400).json({ message: "All fields are required" });
  }

  phoneNumber = phoneNumber.replace(/\s+/g, '').toLowerCase(); // Clean the phone number

  try {
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      phoneNumber,
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

  phoneNumber = phoneNumber.replace(/\s+/g, '').toLowerCase(); // Clean again

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ 
      token
    });
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

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../services/api';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loadUser = async () => {
      try {
        const userData = await fetchUserProfile(token);
        setUser(userData);
      } catch (error) {
        console.error(error);
        navigate("/login"); 
      }
    };
    if (token) {
      loadUser();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-white shadow-md p-4 flex items-center justify-between relative">
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100 text-center space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Confirm Logout</h2>
            <p className="text-gray-600">Are you sure you want to logout?</p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => { setShowLogoutConfirm(false); handleLogout(); }} 
                className="px-5 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition">
                Yes, Logout
              </button>
              <button 
                onClick={() => setShowLogoutConfirm(false)} 
                className="px-5 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logo */}
      <div className="flex items-center space-x-4">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <img src="/logo.png" alt="PoultryCare Logo" className="h-8 w-8 object-cover" />
          <span className="text-xl font-bold text-green-600 hidden md:block">
            PoultryCare
          </span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6">
      <Link to="/dashboard" className="text-gray-700 hover:text-green-600 transition">Home</Link>
      <Link to="/ai-assistant" className="text-gray-700 hover:text-green-600 transition">AI Assistant</Link>
        <Link to="/vaccinations" className="text-gray-700 hover:text-green-600 transition">Vaccination</Link>
        <Link to="/flocks" className="text-gray-700 hover:text-green-600 transition">Manage Flock</Link>
        <Link to="/pedigree" className="text-gray-700 hover:text-green-600 transition">Pedigree Tracking</Link>
        <Link to="/community" className="text-gray-700 hover:text-green-600 transition">Community Forum</Link>
      </div>

      {/* Farm Profile and Logout */}
      {user && (
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/profile" className="flex items-center space-x-2">
            <div className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">
              {getInitials(user.farmName)}
            </div>
            <span className="text-gray-700 font-medium">{user.farmName}</span>
          </Link>
          <button onClick={() => setShowLogoutConfirm(true)} className="text-red-500 hover:underline">Logout</button>
        </div>
      )}

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-gray-600 focus:outline-none">
          {menuOpen ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md rounded-lg py-4 z-50">
          <div className="flex flex-col space-y-4 items-center">
          <Link to="/dashboard" onClick={toggleMenu} className="text-gray-700 hover:text-green-600 transition">Home</Link>
          <Link to="/ai-assistant" onClick={toggleMenu} className="text-gray-700 hover:text-green-600 transition">AI Assistant</Link>
            <Link to="/vaccinations" onClick={toggleMenu} className="text-gray-700 hover:text-green-600 transition">Vaccination</Link>
            <Link to="/flocks" onClick={toggleMenu} className="text-gray-700 hover:text-green-600 transition">Manage Flock</Link>
            <Link to="/pedigree" onClick={toggleMenu} className="text-gray-700 hover:text-green-600 transition">Pedigree Tracking</Link>
            <Link to="/community" onClick={toggleMenu} className="text-gray-700 hover:text-green-600 transition">Community Forum</Link>
            <Link to="/profile" onClick={toggleMenu} className="text-gray-700 hover:text-green-600 transition">Profile</Link>
            <button onClick={() => { toggleMenu(); setShowLogoutConfirm(true); }} className="text-red-500 hover:underline">Logout</button>
          </div>
        </div>
      )}
    </nav>
  );
}

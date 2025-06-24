import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../services/api';
import { 
  ChevronDown, 
  User, 
  Settings, 
  HelpCircle, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
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

  const navLinks = [
    { path: "/dashboard", label: "Home" },
    { path: "/ai-assistant", label: "AI Assistant" },
    { path: "/vaccinations", label: "Vaccination" },
    { path: "/flocks", label: "Manage Flock" },
    { path: "/community", label: "Community Forum" },
    { path: "/biosecurity", label: "Biosecurity" }
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <img 
                src="/logo.png" 
                alt="PoultryCare Logo" 
                className="h-8 w-8 object-cover"
              />
              <span className="ml-2 text-xl font-bold text-green-600 hidden md:block">
                PoultryCare
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Profile Dropdown */}
          {user && (
            <div className="hidden md:ml-4 md:flex md:items-center relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  {getInitials(user.farmName)}
                </div>
                <span className="text-gray-700 font-medium text-sm">
                  {user.farmName}
                </span>
                <ChevronDown 
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    profileDropdownOpen ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-9 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                    <Link
                      to="/support"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Support
                    </Link>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

 {/* Mobile Menu */}
{mobileMenuOpen && (
  <div className="md:hidden fixed inset-0 bg-white z-50 mt-16 overflow-y-auto">
    {/* Navigation Links */}
    <div className="px-4 pt-2 pb-2">
      {navLinks.map((link, index) => (
        <React.Fragment key={link.path}>
          <Link
            to={link.path}
            className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            {link.label}
          </Link>
          {index < navLinks.length - 1 && (
            <div className="border-t border-gray-100 mx-4"></div>
          )}
        </React.Fragment>
      ))}
    </div>

    {/* Divider between nav and user menu */}
    <div className="border-t border-gray-200 my-2"></div>

    {/* User Menu */}
    {user && (
      <div className="px-4 pt-2 pb-4">
        <Link
          to="/profile"
          className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
          onClick={() => setMobileMenuOpen(false)}
        >
          Profile
        </Link>
        <div className="border-t border-gray-100 mx-4"></div>
        
        <Link
          to="/settings"
          className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
          onClick={() => setMobileMenuOpen(false)}
        >
          Settings
        </Link>
        <div className="border-t border-gray-100 mx-4"></div>
        
        <Link
          to="/support"
          className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
          onClick={() => setMobileMenuOpen(false)}
        >
          Support
        </Link>
        <div className="border-t border-gray-100 mx-4"></div>
        
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            handleLogout();
          }}
          className="w-full text-left block px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    )}
  </div>
)}
    </nav>
  );
}
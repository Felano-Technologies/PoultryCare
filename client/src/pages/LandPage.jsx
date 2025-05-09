import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';


export default function LandingPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const toggleNav = () => setNavOpen(!navOpen);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    "PoultryCare is a complete poultry farm management software",
    "PoultryCare is a layer farm management solution",
    "PoultryCare is a broiler farm management software",
    "PoultryCare is a poultry financial management tool",
    "PoultryCare works for farms of all sizes",
  ];

  return (
    <div className="text-gray-800">
    {/* Navbar */}
    <nav className="bg-white shadow-sm px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left - Logo */}
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="PoultryCare" className="h-8 w-8" />
          <span className="text-xl font-bold text-green-600">PoultryCare</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#hero" className="text-gray-700 hover:text-green-600 transition">Home</a>
          <a href="#features" className="text-gray-700 hover:text-green-600 transition">Features</a>
          <a href="#blog" className="text-gray-700 hover:text-green-600 transition">Blog</a>
          <a href="#contact" className="text-gray-700 hover:text-green-600 transition">Contact</a>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login" className="border px-4 py-2 rounded-full hover:border-green-600 hover:text-green-600 transition">Login</Link>
          <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition">Try It Now!</Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden focus:outline-none" onClick={toggleNav}>
          {navOpen ? (
            <XMarkIcon className="w-6 h-6 text-gray-700" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {navOpen && (
        <div className="md:hidden mt-4 space-y-4 text-center">
          <a href="#hero" className="block text-gray-700 hover:text-green-600">Home</a>
          <a href="#features" className="block text-gray-700 hover:text-green-600">Features</a>
          <a href="#blog" className="block text-gray-700 hover:text-green-600">Blog</a>
          <a href="#contact" className="block text-gray-700 hover:text-green-600">Contact</a>
          <Link to="/login" className="block text-gray-700 hover:text-green-600">Login</Link>
          <Link to="/register" className="block bg-green-500 text-white py-2 px-6 rounded-full mx-auto w-max hover:bg-green-600 transition">Try It Now!</Link>
        </div>
      )}
    </nav>

    {/* Hero Section */}
    <section id="hero" className="flex flex-col md:flex-row items-center justify-between px-6 py-20 bg-white max-w-7xl mx-auto">
      {/* Left - Text */}
      <div className="md:w-1/2 mb-12 md:mb-0">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          Poultry Management Software.
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          PoultryCare is the smart way to manage your poultry farm. Track bird health, production, vaccination, and finances — all in one dashboard.
        </p>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium text-sm">✅ Free to try</span>
        </div>
        <Link
          to="/register"
          className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Get Started Now
        </Link>
      </div>

      {/* Right - Image */}
      <div className="md:w-1/2 flex justify-center">
        <img
          src="/hero-chickens.jpg"
          alt="Poultry Farm Illustration"
          className="max-w-xs md:max-w-md lg:max-w-lg"
        />
      </div>
    </section>

    {/* Features Section */}
<section id="features" className="bg-gray-50 py-20 px-6">
  <div className="max-w-6xl mx-auto text-center">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Smart Tools for Poultry Success</h2>
    <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
      PoultryCare gives you everything you need to manage your farm with confidence — whether you're raising 10 or 10,000 birds.
    </p>

    {/* Feature Grid */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
      {/* Vaccination Management */}
      <div className="bg-white rounded-lg p-6 shadow hover:shadow-md transition">
        <h3 className="text-xl font-semibold mb-2 text-green-600">Vaccination Management</h3>
        <p className="text-gray-700 text-sm">
          Set reminders, log vaccination history, and monitor bird health over time.
        </p>
      </div>

      {/* Pedigree Tracking */}
      <div className="bg-white rounded-lg p-6 shadow hover:shadow-md transition">
        <h3 className="text-xl font-semibold mb-2 text-green-600">Pedigree Tracking</h3>
        <p className="text-gray-700 text-sm">
          Track bird lineage and monitor hereditary health to optimize breeding outcomes.
        </p>
      </div>

      {/* Treatment Protocols */}
      <div className="bg-white rounded-lg p-6 shadow hover:shadow-md transition">
        <h3 className="text-xl font-semibold mb-2 text-green-600">Treatment Protocols</h3>
        <p className="text-gray-700 text-sm">
          Quickly respond to diseases with built-in symptom checks and step-by-step treatment guides.
        </p>
      </div>

      {/* Expert Consultation */}
      <div className="bg-white rounded-lg p-6 shadow hover:shadow-md transition">
        <h3 className="text-xl font-semibold mb-2 text-green-600">Expert Consultation</h3>
        <p className="text-gray-700 text-sm">
          Book sessions or chat with veterinarians, extension officers, and biotech experts.
        </p>
      </div>

      {/* Community Knowledge */}
      <div className="bg-white rounded-lg p-6 shadow hover:shadow-md transition">
        <h3 className="text-xl font-semibold mb-2 text-green-600">Community Forum</h3>
        <p className="text-gray-700 text-sm">
          Ask questions, get tips, and connect with other poultry farmers across the region.
        </p>
      </div>

      {/* Biosecurity Checklist */}
      <div className="bg-white rounded-lg p-6 shadow hover:shadow-md transition">
        <h3 className="text-xl font-semibold mb-2 text-green-600">Biosecurity Checklist</h3>
        <p className="text-gray-700 text-sm">
          Follow best practices for isolation, hygiene, and farm entry to reduce disease risk.
        </p>
      </div>
    </div>
  </div>
</section>



      {/* About Section */}
      <section id="about" className="py-16 px-6 text-center bg-gray-50">
        <h3 className="text-3xl font-bold mb-4">What is PoultryCare?</h3>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Whether you manage a small, medium, or large poultry farm, PoultryCare helps you track activities, manage workers, and gain full insight into your farm operations. Boost your productivity and profitability with ease.
        </p>

        {/* Accordions */}
        <div className="max-w-3xl mx-auto space-y-4 text-left">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b pb-2">
              <button
                className="flex justify-between items-center w-full font-semibold text-lg"
                onClick={() => toggleAccordion(index)}
              >
                {faq}
                {openIndex === index ? (
                  <ChevronUpIcon className="h-5 w-5 text-green-600" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-green-600" />
                )}
              </button>
              {openIndex === index && (
                <p className="text-sm mt-2 text-gray-600">
                  PoultryCare provides this feature as part of our all-in-one dashboard. You can manage everything from flock health to financial tracking in one place.
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Maximize Productivity Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6 text-gray-800">Maximize Productivity. Minimize Guesswork.</h3>

          <p className="text-gray-700 text-lg mb-6 max-w-3xl mx-auto">
            As a poultry farmer, your success depends on knowing what’s happening with your flock at all times. PoultryCare helps you stay on top of your data — from feed consumption and bird weight to vaccination and mortality.
          </p>

          <p className="text-gray-700 text-lg mb-6 max-w-3xl mx-auto">
            With simple daily entries, you’ll quickly spot changes in health or productivity. That means faster responses, better outcomes, and higher profitability — even on smaller farms.
          </p>

          <p className="text-gray-700 text-lg max-w-3xl mx-auto">
            PoultryCare is the tool you need to take control of your operations with confidence. Your flock. Your data. Your success.
          </p>
        </div>
      </section>

      

    {/* Final CTA Section */}
    <section className="bg-green-500 py-16 text-white text-center">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">Start Managing Your Poultry Farm Better</h2>
        <p className="text-lg mb-6">
          Join other farmers using PoultryCare to protect their flocks, improve productivity, and simplify their records.
        </p>
        <Link
          to="/register"
          className="bg-white text-green-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
        >
          Get Started Now
        </Link>
      </div>
    </section>


    {/* Footer */}
    <footer className="bg-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
        {/* Brand */}
        <div className="flex items-center mb-4 md:mb-0">
          <img src="/logo.png" alt="PoultryCare Logo" className="h-6 mr-2" />
          <span className="font-semibold">PoultryCare</span>
        </div>

        {/* Links */}
        <div className="flex space-x-6">
          <a href="#features" className="hover:text-green-600">Features</a>
          <a href="#about" className="hover:text-green-600">About</a>
          <a href="#contact" className="hover:text-green-600">Contact</a>
          <Link to="/login" className="hover:text-green-600">Login</Link>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 mt-4">
        &copy; {new Date().getFullYear()} PoultryCare. All rights reserved.
      </div>
    </footer>

    </div>
  );
}

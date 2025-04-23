import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="flex items-center justify-between p-6 shadow-md bg-green-700 text-white">
        <h1 className="text-2xl font-bold">PoultryCare</h1>
        <nav className="space-x-4">
          <Link to="/vaccinations">Vaccinations</Link>
          <Link to="/pedigree">Pedigree</Link>
          <Link to="/treatment">Treatment</Link>
          <Link to="/consultation">Consultation</Link>
          <Link to="/community">Community</Link>
          <Link to="/biosecurity">Biosecurity</Link>
          <Link to="/login" className="font-semibold">Login</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 px-6 bg-green-50">
        <h2 className="text-4xl font-bold mb-4">
          Empowering Poultry Farmers Through Smart Disease Management
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-6">
          Track vaccinations, manage treatments, consult experts, and prevent outbreaks — all in one place.
        </p>
        <Link
          to="/register"
          className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800"
        >
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 grid gap-8 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
        {[
          {
            title: "Vaccination Management",
            desc: "Schedule and track vaccinations with reminders and history logs.",
          },
          {
            title: "Pedigree Tracking",
            desc: "Monitor poultry lineage and track genetic health and productivity.",
          },
          {
            title: "Treatment Protocols",
            desc: "Get symptoms, treatments, and guides for common poultry diseases.",
          },
          {
            title: "Expert Consultation",
            desc: "Chat or book sessions with veterinarians and experts.",
          },
          {
            title: "Community Sharing",
            desc: "Join discussions, share tips and learn from other farmers.",
          },
          {
            title: "Biosecurity Checklist",
            desc: "Follow best practices to keep your farm safe from outbreaks.",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Optional AI Feature Teaser */}
      <section className="bg-yellow-100 py-12 px-6 text-center">
        <h3 className="text-2xl font-bold mb-2">Coming Soon: AI-Powered Disease Diagnosis</h3>
        <p className="mb-4 max-w-xl mx-auto">
          Scan your birds or input symptoms to get instant disease suggestions and treatment recommendations.
        </p>
        <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
          Notify Me When Ready
        </button>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 bg-gray-100 mt-12">
        <p>&copy; {new Date().getFullYear()} PoultryCare. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
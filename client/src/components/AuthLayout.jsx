// AuthLayout.jsx
import React from "react";

const AuthLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: Branding */}
      <div className="bg-white text-gray-900 flex items-center justify-center p-8 md:w-1/2 w-full">
        <div className="text-center space-y-4">
          <img src="/logo.png" alt="PoultryCare Logo" className="w-28 h-28 mx-auto mb-2" />
          <h1 className="text-3xl font-bold">PoultryCare</h1>
          <p className="text-md text-gray-500">Empowering Poultry Farmers with Smart Tools</p>
        </div>
      </div>

      {/* Right: Form Area */}
      <div className="flex flex-1 justify-center items-center p-8 bg-white md:pl-0 md:pr-24">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

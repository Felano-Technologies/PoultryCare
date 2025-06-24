import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, MessageSquare, Phone, AlertTriangle } from 'lucide-react';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement submission logic here
    alert('Support request submitted! We will contact you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
            <p className="text-lg text-gray-600">
              We're here to help with any questions or issues you may have.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Methods */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Options</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-green-600 mr-4 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Email Support</h3>
                    <p className="text-gray-600">support@poultrycare.com</p>
                    <p className="text-sm text-gray-500 mt-1">Typically responds within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-green-600 mr-4 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Phone Support</h3>
                    <p className="text-gray-600">+1 (800) 123-4567</p>
                    <p className="text-sm text-gray-500 mt-1">Monday-Friday, 9AM-5PM EST</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-green-600 mr-4 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Emergency Support</h3>
                    <p className="text-gray-600">emergency@poultrycare.com</p>
                    <p className="text-sm text-gray-500 mt-1">24/7 for critical issues</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                Send us a message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select a subject</option>
                    <option value="technical">Technical Issue</option>
                    <option value="account">Account Help</option>
                    <option value="billing">Billing Question</option>
                    <option value="feedback">Product Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
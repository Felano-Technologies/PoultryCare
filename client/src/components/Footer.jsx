import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white shadow-inner mt-10">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center">
        
        {/* Left - Brand */}
        <div className="text-green-600 font-bold text-xl mb-4 md:mb-0">
          PoultryCare
        </div>

        {/* Middle - Links */}
        <div className="flex space-x-6 text-gray-600">
          <Link to="/about" className="hover:text-green-600 transition">About</Link>
          <Link to="/contact" className="hover:text-green-600 transition">Contact</Link>
          <Link to="/privacy" className="hover:text-green-600 transition">Privacy Policy</Link>
        </div>

        {/* Right - Social Icons */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="text-gray-600 hover:text-green-600 transition">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.522-4.478-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898v-2.891h2.54V9.845c0-2.506 1.493-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.891h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </a>
          <a href="#" className="text-gray-600 hover:text-green-600 transition">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4.36a9.09 9.09 0 0 1-2.88 1.1 4.52 4.52 0 0 0-7.69 4.13A12.8 12.8 0 0 1 1.67 2.15a4.52 4.52 0 0 0 1.4 6.04A4.48 4.48 0 0 1 .96 7.1v.05a4.52 4.52 0 0 0 3.63 4.43 4.52 4.52 0 0 1-2.04.08 4.52 4.52 0 0 0 4.22 3.13A9.05 9.05 0 0 1 0 19.54a12.77 12.77 0 0 0 6.92 2.03c8.3 0 12.84-6.88 12.84-12.84 0-.2-.01-.39-.02-.58A9.22 9.22 0 0 0 23 3z"/>
            </svg>
          </a>
          <a href="#" className="text-gray-600 hover:text-green-600 transition">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.31 3.608.059 1.266.07 1.645.07 4.849s-.011 3.584-.07 4.85c-.061 1.366-.335 2.633-1.31 3.608-.975.975-2.242 1.249-3.608 1.31-1.266.059-1.645.07-4.849.07s-3.584-.011-4.85-.07c-1.366-.061-2.633-.335-3.608-1.31-.975-.975-1.249-2.242-1.31-3.608-.059-1.266-.07-1.645-.07-4.849s.011-3.584.07-4.85c.061-1.366.335-2.633 1.31-3.608.975-.975 2.242-1.249 3.608-1.31 1.266-.059 1.645-.07 4.849-.07zm0-2.163C8.741 0 8.332.012 7.052.07 5.78.129 4.6.378 3.675 1.303 2.75 2.228 2.5 3.408 2.441 4.68.384 5.96.372 6.369.372 12s.012 6.041.07 7.32c.059 1.272.308 2.452 1.233 3.377.925.925 2.105 1.174 3.377 1.233 1.279.059 1.688.07 7.32.07s6.041-.011 7.32-.07c1.272-.059 2.452-.308 3.377-1.233.925-.925 1.174-2.105 1.233-3.377.059-1.279.07-1.688.07-7.32s-.011-6.041-.07-7.32c-.059-1.272-.308-2.452-1.233-3.377C20.452.378 19.272.129 18 .07 16.719.012 16.31 0 12 0z"/>
              <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zM18.406 4.594a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
            </svg>
          </a>
        </div>

      </div>

      <div className="text-center text-gray-500 text-sm py-4 border-t mt-4">
        © {new Date().getFullYear()} PoultryCare. All rights reserved.
      </div>
    </footer>
  );
}

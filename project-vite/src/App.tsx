import React from "react";

const TopNavbar: React.FC = () => {
  return (
    <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="text-2xl font-bold text-blue-600">MyApp</div>

      {/* Navigation Links */}
      <nav className="hidden md:flex space-x-6">
        <a href="#" className="text-gray-700 hover:text-blue-600 transition">
          Home
        </a>
        <a href="#" className="text-gray-700 hover:text-blue-600 transition">
          About
        </a>
        <a href="#" className="text-gray-700 hover:text-blue-600 transition">
          Contact
        </a>
      </nav>

      {/* CTA Button */}
      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
        Sign In
      </button>
    </header>
  );
};

export default TopNavbar;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { auth, signOut } from "../firebaseConfig.js";
import { Menu, X } from "lucide-react"; // npm install lucide-react

const Navbar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide hover:scale-105 transition-transform duration-200"
        >
          PitchCraft 💡
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <>
              <span className="text-sm text-gray-100">
                Welcome,{" "}
                <span className="font-semibold">{currentUser.email}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 transition-all px-4 py-2 rounded-lg font-semibold shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-white text-indigo-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-all shadow-md"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-yellow-400 text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition-all shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-indigo-800 text-center py-4 space-y-3 border-t border-indigo-700">
          {currentUser ? (
            <>
              <p className="text-gray-200 mb-2">
                Welcome,{" "}
                <span className="font-semibold">{currentUser.email}</span>
              </p>
              <button
                onClick={handleLogout}
                className="w-5/6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-5/6 mx-auto bg-white text-indigo-700 font-semibold py-2 rounded-lg hover:bg-gray-100 shadow-md"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block w-5/6 mx-auto bg-yellow-400 text-gray-900 font-semibold py-2 rounded-lg hover:bg-yellow-500 shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

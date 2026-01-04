import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 mt-8 px-4">
        <div
          className={`mx-auto w-full max-w-[620px] bg-neutral-900/50 backdrop-blur-md border border-white/10 transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen
              ? "rounded-3xl p-6 bg-neutral-900/90"
              : "rounded-full px-6 py-3"
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="text-md font-semibold text-white">
              HumanOps-Live
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 text-sm text-white/80 bg-white/5 rounded-full p-1 border border-white/5">
              <Link
                to="/"
                className="px-4 py-1.5 hover:bg-white/10 rounded-full duration-300 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="px-4 py-1.5 hover:bg-white/10 rounded-full duration-300 transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="px-4 py-1.5 hover:bg-white/10 rounded-full duration-300 transition-colors"
              >
                Contact
              </Link>
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:block text-white font-semibold text-sm">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 hover:bg-white/10 rounded-full duration-300 border border-white/20"
                >
                  Go to App
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 hover:bg-white/10 rounded-full duration-300 border border-white/20"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white p-1"
            >
              {isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="12" x2="20" y2="12"></line>
                  <line x1="4" y1="6" x2="20" y2="6"></line>
                  <line x1="4" y1="18" x2="20" y2="18"></line>
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div
            className={`md:hidden flex flex-col gap-4 items-center text-white transition-all duration-300 ${
              isMobileMenuOpen
                ? "mt-8 opacity-100 max-h-[500px]"
                : "max-h-0 opacity-0 pointer-events-none"
            }`}
          >
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium hover:text-blue-400 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium hover:text-blue-400 transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium hover:text-blue-400 transition-colors"
            >
              Contact
            </Link>
            <div className="w-full h-px bg-white/10 my-2"></div>
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-3 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-colors"
              >
                Go to App
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-3 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

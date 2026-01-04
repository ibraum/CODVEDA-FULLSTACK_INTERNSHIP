import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <div className="w-full h-[40px] mt-14 fixed top-0 left-0 right-0">
        <div className="max-w-[620px] w-full h-full mx-auto grid grid-cols-[150px_1fr_100px] place-items-center bg-white/10 backdrop-blur-xs rounded-full py-1 px-1">
          <div className="text-md text-white font-semibold">HumanOps-Live</div>
          <div className="grid grid-cols-3 w-full place-items-center text-sm text-white/80">
            <div className="">
              <Link
                to="/"
                className="w-full py-1 px-2 hover:bg-white/10 rounded-full duration-300"
              >
                Home
              </Link>
            </div>
            <div className="">
              <Link
                to="/about"
                className="w-full py-1 px-2 hover:bg-white/10 rounded-full duration-300"
              >
                About
              </Link>
            </div>
            <div className="">
              <Link
                to="/contact"
                className="w-full py-1 px-2 hover:bg-white/10 rounded-full duration-300"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="text-white font-semibold">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full px-2 pl-3 border-l border-white/50"
              >
                Go to App
              </Link>
            ) : (
              <Link
                to="/login"
                className="w-full px-2 pl-6 border-l border-white/50"
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

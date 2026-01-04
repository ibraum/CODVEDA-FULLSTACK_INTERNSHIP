import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-white text-neutral-950 px-4">
      <div className="w-full max-w-[700px] h-[600px] p-4 flex flex-col items-center justify-center bg-[url('/src/assets/404.png')] bg-cover bg-center"></div>
      <div className="flex flex-col items-center justify-center relative pt-10">
        <h1 className="dm-sans-bold text-[12rem] font-bold text-white absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-outline">404</h1>
        <h2 className="mt-4 text-2xl font-bold tracking-tight">
          Page not found
        </h2>
        <p className="mt-2 text-neutral-400 text-center max-w-md">
          Sorry, we couldn't find the page you're looking for. It might have
          been removed, renamed, or doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-8 rounded-full bg-black px-8 py-3 text-sm font-medium text-white hover:bg-white border-black border hover:text-black duration-300 cursor-pointer transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-[1fr_500px] font-sans">
      <div className="flex items-center justify-center p-8 bg-white text-neutral-900 md:order-1 order-2">
        <div className="w-full max-w-[400px] space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight dm-sans-bold">
              Welcome back
            </h1>
            <p className="text-sm text-neutral-500 dm-sans-regular">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-neutral-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-neutral-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-200 focus:ring-neutral-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium text-white transition-colors rounded-md bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>
              ) : null}
              Sign In
            </button>
          </form>

          <p className="px-8 text-center text-sm text-neutral-500 dm-sans-regular">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="underline underline-offset-4 hover:text-neutral-900"
            >
              Sign up
            </Link>
          </p>

          <p className="px-8 text-center text-sm text-neutral-500 dm-sans-regular">
            By clicking continue, you agree to our{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-neutral-900"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-neutral-900"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
      <div className="lg:block relative bg-neutral-900 md:order-2 order-1">
        <div className="absolute inset-0 bg-[url('/src/assets/login-bg.png')] bg-cover bg-center bg-no-repeat opacity-100 mix-blend-"></div>
        <div className="relative z-10 flex flex-col justify-between h-full md:p-10 p-5 text-white md:h-full h-[150px]">
          <div className="text-lg font-medium tracking-tight">
            HumanOps Live
          </div>
          <blockquote className="space-y-2">
            <p className="text-lg font-medium leading-relaxed dm-sans-medium tracking-wide">
              &ldquo;This platform has revolutionized how we manage our
              operational teams. The insights are incredible.&rdquo;
            </p>
            <footer className="text-sm opacity-80 dm-sans-regular">
              Sofia Davis, Director of Ops
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
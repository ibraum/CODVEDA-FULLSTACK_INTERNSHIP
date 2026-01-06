import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { useNavigate, Link } from "react-router-dom";

const SignupPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const role: "MANAGER" | "COLLABORATOR" | "ADMIN" = "COLLABORATOR";
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please ensure both passwords are the same.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      await register({
        firstName,
        lastName,
        email,
        password,
        role,
      });
      toast({
        title: "Account created",
        description: "You can now sign in with your credentials.",
        variant: "success",
      });
      navigate("/login");
    } catch (err) {
      toast({
        title: "Registration failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-[500px_1fr] font-sans">
      <div className="hidden lg:block relative bg-neutral-900">
        <div className="absolute inset-0 bg-[url('/src/assets/signup-bg.png')] bg-cover bg-center bg-no-repeat opacity-100"></div>
        <div className="relative z-10 flex flex-col justify-between h-full p-10 text-white">
          <div className="text-lg font-medium tracking-tight">
            HumanOps Live
          </div>
          <blockquote className="space-y-2">
            <p className="text-lg font-medium leading-relaxed dm-sans-medium tracking-wide">
              &ldquo;Joining HumanOps Live was the best decision for our team's
              productivity and well-being.&rdquo;
            </p>
            <footer className="text-sm opacity-80 dm-sans-regular">
              Alex Chen, VP of Engineering
            </footer>
          </blockquote>
        </div>
      </div>
      <div className="flex items-center justify-center p-8 bg-white text-neutral-900 overflow-y-auto">
        <div className="w-full max-w-[400px] space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight dm-sans-bold">
              Create an account
            </h1>
            <p className="text-sm text-neutral-500 dm-sans-regular">
              Enter your details to get started with HumanOps Live
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-neutral-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-neutral-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                />
              </div>
            </div>

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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-neutral-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-neutral-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium text-white transition-colors rounded-md bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>
              ) : null}
              Create Account
            </button>
          </form>

          <p className="px-8 text-center text-sm text-neutral-500 dm-sans-regular">
            Already have an account?{" "}
            <Link
              to="/login"
              className="underline underline-offset-4 hover:text-neutral-900"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";

const Layout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-white">
      <header className="border-b border-neutral-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-400">
            HumanOps Live
          </Link>
          <nav className="space-x-4 flex items-center">
            <Link
              to="/dashboard"
              className="hover:text-blue-300 transition-colors"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="hover:text-blue-300 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4">
        <Outlet />
      </main>

      <footer className="border-t border-neutral-800 p-4 text-center text-neutral-500 text-sm">
        &copy; {new Date().getFullYear()} HumanOps Live
      </footer>
    </div>
  );
};

export default Layout;

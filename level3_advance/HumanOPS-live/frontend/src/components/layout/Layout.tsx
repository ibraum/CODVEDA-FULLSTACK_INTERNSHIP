import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-white">
      <header className="border-b border-neutral-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-400">
            HumanOps Live
          </Link>
          <nav className="space-x-4">
            <Link to="/dashboard" className="hover:text-blue-300">
              Dashboard
            </Link>
            <Link to="/login" className="hover:text-blue-300">
              Logout
            </Link>
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

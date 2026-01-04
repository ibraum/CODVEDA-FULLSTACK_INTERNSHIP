import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./features/auth/context/AuthContext";
import LoginPage from "./features/auth/components/LoginPage";
import Home from "./features/landing/components/Home";

// Placeholder pages (we will create these properly next)
const Dashboard = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Dashboard</h1>
    <p>Welcome to HumanOps Live</p>
  </div>
);
const NotFound = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">404 Not Found</h1>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Home />} />

          {/* Protected Routes Wrapper could go here */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Add more routes here */}
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

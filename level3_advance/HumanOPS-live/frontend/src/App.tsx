import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import PublicRoute from "./features/auth/components/PublicRoute";
import LoginPage from "./features/auth/components/LoginPage";
import Home from "./features/landing/components/Home";
import SignupPage from "./features/auth/components/SignupPage";
import Dashboard from "./features/dashboard/components/Dashboard";
import NotFound from "./components/pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Public Routes (only for non-authenticated users) */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

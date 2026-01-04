import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  type User,
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
} from "../services/authService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Partial<User>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Restore session from token (simulated for MVP until /auth/me is ready)
      setUser({
        id: "presumed-valid",
        email: "user@humanops.live",
        role: "COLLABORATOR",
        password: "", // Not needed for frontend state usually
        firstName: "Returning",
        lastName: "User",
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await loginApi(email, password);
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      await registerApi(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

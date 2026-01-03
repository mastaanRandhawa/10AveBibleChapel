import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authAPI, AuthResponse } from "../services/api";
import { useToast } from "./ToastContext";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isMember: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData as User);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          // Token might be invalid, clear it
          localStorage.removeItem("token");
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response: AuthResponse = await authAPI.login({ email, password });
      localStorage.setItem("token", response.token);
      setToken(response.token);
      setUser(response.user);
      toast.showSuccess(`Welcome back, ${response.user.name}`);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    try {
      const response: AuthResponse = await authAPI.register({
        name,
        email,
        password,
      });
      localStorage.setItem("token", response.token);
      setToken(response.token);
      setUser(response.user);
      toast.showSuccess(
        `Account created successfully. Welcome, ${response.user.name}`
      );
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = (): void => {
    const userName = user?.name;
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast.showInfo(
      `Logged out successfully${userName ? `. Goodbye, ${userName}` : ""}`
    );
  };

  const refreshUser = async (): Promise<void> => {
    if (token) {
      try {
        const userData = await authAPI.getCurrentUser();
        setUser(userData as User);
      } catch (error) {
        console.error("Failed to refresh user:", error);
        toast.showError("Your session has expired. Please log in again.");
        logout();
      }
    }
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === "ADMIN";
  const isMember = user?.role === "MEMBER" || user?.role === "ADMIN";

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    isAdmin,
    isMember,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

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
  isApproved: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isMember: boolean;
  isApproved: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
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
      setUser(response.user as User);
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
      setUser(response.user as User);
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

  const updateProfile = async (data: { name?: string; email?: string }): Promise<void> => {
    if (!token) {
      throw new Error("Not authenticated");
    }
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/auth/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const updatedUser = await response.json();
      setUser(updatedUser as User);
      toast.showSuccess("Profile updated successfully");
    } catch (error) {
      console.error("Update profile failed:", error);
      throw error;
    }
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === "ADMIN";
  const isMember = user?.role === "MEMBER" || user?.role === "ADMIN";
  const isApproved = user?.isApproved || isAdmin || false;

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    isAdmin,
    isMember,
    isApproved,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

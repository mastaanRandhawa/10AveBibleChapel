// Authentication related types

export interface User {
  id: string;
  email: string;
  name: string;
  role: "member" | "admin" | "guest";
  createdAt: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData extends LoginCredentials {
  confirmPassword: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

export interface AuthError {
  message: string;
  code: string;
  field?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
}

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: (userData: User) => void;
}

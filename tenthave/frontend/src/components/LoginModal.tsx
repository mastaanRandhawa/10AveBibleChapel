import React, { useState } from "react";
import "./LoginModal.css";
import { useAuth } from "../context/AuthContext";
import { LoginModalProps, User, LoginCredentials } from "../types";
import PasswordInput from "./PasswordInput";

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<
    LoginCredentials & { confirmPassword: string; name: string }
  >({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Basic validation
      if (!formData.email || !formData.password) {
        setError("Please fill in all required fields.");
        setLoading(false);
        return;
      }

      if (!isLogin) {
        if (!formData.name) {
          setError("Please enter your name.");
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match!");
          setLoading(false);
          return;
        }
      }

      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }

      // Reset form
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
      });

      if (onLogin) {
        const userData: User = {
          id: "",
          email: formData.email,
          name: formData.name || formData.email.split("@")[0],
          role: "member",
          createdAt: new Date().toISOString(),
        };
        onLogin(userData);
      }

      onClose();
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={handleOverlayClick}>
      <div className="login-modal">
        <button className="login-modal-close" onClick={onClose} aria-label="Close">
          Close
        </button>

        <div className="login-modal-header">
          <h2 className="login-modal-title">
            {isLogin ? "WELCOME BACK" : "JOIN OUR COMMUNITY"}
          </h2>
          <p className="login-modal-subtitle">
            {isLogin
              ? "Sign in to access prayer requests and member features"
              : "Create an account to submit prayer requests and connect with our community"}
          </p>
        </div>

        <div className="login-modal-tabs">
          <button
            className={`login-tab ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            LOGIN
          </button>
          <button
            className={`login-tab ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            SIGN UP
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div
              className="form-error"
              style={{ color: "red", marginBottom: "1rem" }}
            >
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                FULL NAME
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              EMAIL ADDRESS
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <PasswordInput
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            label="PASSWORD"
            required
            autoComplete={isLogin ? "current-password" : "new-password"}
          />

          {!isLogin && (
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              label="CONFIRM PASSWORD"
              required
              autoComplete="new-password"
            />
          )}

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading
              ? isLogin
                ? "SIGNING IN..."
                : "CREATING ACCOUNT..."
              : isLogin
              ? "SIGN IN"
              : "CREATE ACCOUNT"}
          </button>
        </form>

        <div className="login-modal-footer">
          <p className="login-footer-text">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              className="login-footer-link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up here" : "Sign in here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

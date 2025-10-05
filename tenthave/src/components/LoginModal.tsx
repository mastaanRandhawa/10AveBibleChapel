import React, { useState } from "react";
import "./LoginModal.css";

import { LoginModalProps, User, LoginCredentials } from "../types";

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<
    LoginCredentials & { confirmPassword: string }
  >({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic validation
      if (!formData.email || !formData.password) {
        alert("Please fill in all required fields.");
        setLoading(false);
        return;
      }

      if (!isLogin && formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        setLoading(false);
        return;
      }

      console.log(isLogin ? "Logging in:" : "Signing up:", formData);
      await new Promise((res) => setTimeout(res, 1000)); // mock API

      if (onLogin) {
        // Mock user data for demo purposes
        const mockUser: User = {
          id: "1",
          email: formData.email,
          name: formData.email.split("@")[0],
          role: "member",
          createdAt: new Date().toISOString(),
        };
        onLogin(mockUser);
      }

      // Reset form
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
      });

      alert(isLogin ? "Login successful!" : "Signup successful!");
      onClose();
    } catch (err) {
      console.error("Auth error:", err);
      alert("An error occurred. Please try again.");
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
        <button className="login-modal-close" onClick={onClose}>
          ✕
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

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              PASSWORD
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                CONFIRM PASSWORD
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>
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

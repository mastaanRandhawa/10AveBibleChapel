import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../components/PasswordInput";
import "./Login.css";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
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

      // Reset form and navigate
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
      });
      
      navigate("/members");
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-page-container">
        {/* Left side - Branding */}
        <div className="login-page-branding">
          <div className="branding-content">
            <h1 className="branding-title">10TH AVE BIBLE CHAPEL</h1>
            <p className="branding-subtitle">
              A small Bible believing Christian fellowship
            </p>
            <p className="branding-verse">
              "For where two or three are gathered together in My name, I am there in the midst of them."
            </p>
            <p className="branding-verse-ref">— Matthew 18:20</p>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="login-page-form-section">
          <div className="login-form-container">
            <div className="login-form-header">
              <h2 className="login-form-title">
                {isLogin ? "WELCOME BACK" : "JOIN OUR COMMUNITY"}
              </h2>
              <p className="login-form-subtitle">
                {isLogin
                  ? "Sign in to access prayer requests and member features"
                  : "Create an account to submit prayer requests and connect with our community"}
              </p>
            </div>

            <div className="login-tabs">
              <button
                className={`login-tab ${isLogin ? "active" : ""}`}
                onClick={() => {
                  setIsLogin(true);
                  setError(null);
                }}
              >
                LOGIN
              </button>
              <button
                className={`login-tab ${!isLogin ? "active" : ""}`}
                onClick={() => {
                  setIsLogin(false);
                  setError(null);
                }}
              >
                SIGN UP
              </button>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {error && (
                <div className="form-error-message" role="alert">
                  {error}
                </div>
              )}

              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    FULL NAME <span className="required">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  EMAIL ADDRESS <span className="required">*</span>
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

            <div className="login-form-footer">
              <p className="login-footer-text">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  className="login-footer-link"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                  }}
                >
                  {isLogin ? "Sign up here" : "Sign in here"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

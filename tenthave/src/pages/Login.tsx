import { useState, useEffect } from "react";
import LoginModal from "../components/LoginModal";
import "./Login.css";

export default function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open modal when component mounts
  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Navigate back to home page or previous page
    window.history.back();
  };

  const handleLoginSuccess = (userData: any) => {
    console.log("User logged in successfully:", userData);
    // Handle successful login - could redirect to dashboard or home
    // For now, just close the modal
    setIsModalOpen(false);
    window.history.back();
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-page-content">
        <h1 className="login-page-title">10TH AVE BIBLE CHAPEL</h1>
        <p className="login-page-subtitle">
          Welcome to our community. Please sign in to access member features.
        </p>

        <button
          className="login-page-button"
          onClick={() => setIsModalOpen(true)}
        >
          OPEN LOGIN
        </button>
      </div>

      <LoginModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onLogin={handleLoginSuccess}
      />
    </div>
  );
}

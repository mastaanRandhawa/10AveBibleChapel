import { useState, useEffect } from "react";
import LoginModal from "../components/LoginModal";
import HeroSection from "../components/HeroSection";
import churchPicture from "../assets/churchPicture.svg";
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
      <HeroSection
        title="MEMBER LOGIN"
        subtitle="WELCOME TO OUR COMMUNITY"
        description="Sign in to access member features and connect with our church family"
        backgroundImage={`url(${churchPicture})`}
        variant="centered"
      />

      <div className="login-page-content">
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

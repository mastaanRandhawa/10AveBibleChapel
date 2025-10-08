import React, { useState } from "react";
import { ScrollReveal } from "../components/ScrollReveal";
import HeroSection from "../components/HeroSection";
import LoginModal from "../components/LoginModal";
import Button from "../components/Button";
import prayingImage from "../assets/praying.jpg";
import "./Prayer.css";

// Prayer Request Form Component
const PrayerRequestForm: React.FC<{ onLoginClick: () => void }> = ({
  onLoginClick,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requester: "",
    isPrivate: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Prayer request submitted:", formData);
    // Reset form
    setFormData({
      title: "",
      description: "",
      requester: "",
      isPrivate: false,
    });
  };

  return (
    <div className="prayer-form-section">
      <form className="prayer-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Prayer Request Title"
            required
          />
        </div>
        <div className="form-group">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your prayer request"
            rows={4}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="requester"
            value={formData.requester}
            onChange={handleChange}
            placeholder="Your Name (optional)"
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="isPrivate"
              checked={formData.isPrivate}
              onChange={handleChange}
            />
            Keep this request private (only visible to church leadership)
          </label>
        </div>
        <Button
          variant="button-primary"
          buttonText="Submit Prayer Request"
          onClick={() => {}}
        />
      </form>

      <div className="prayer-form-footer">
        <p className="login-prompt">
          Want to view and pray for others?
          <button className="login-link-btn" onClick={onLoginClick}>
            Sign in to access prayer requests
          </button>
        </p>
      </div>
    </div>
  );
};

// Main Prayer Component
const Prayer: React.FC = () => {
  // Prayer request state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Prayer request handlers
  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginSuccess = (userData: any) => {
    console.log("User logged in:", userData);
    setIsLoginModalOpen(false);
  };

  return (
    <div className="prayer-page-wrapper">
      <HeroSection
        title="PRAYER REQUESTS"
        subtitle="SHARE YOUR PRAYER NEEDS"
        description="Join our caring community in prayer and share your prayer requests with us"
        backgroundImage={`url(${prayingImage})`}
        variant="centered"
      />

      <div className="prayer-content">
        {/* Prayer Request Form Section */}
        <ScrollReveal className="prayer-form-section">
          <div className="section-header">
            <h2>SUBMIT A PRAYER REQUEST</h2>
            <p>Share your prayer needs with our caring church community</p>
          </div>
          <PrayerRequestForm onLoginClick={handleLoginClick} />
        </ScrollReveal>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginModalClose}
        onLogin={handleLoginSuccess}
      />
    </div>
  );
};

export default Prayer;

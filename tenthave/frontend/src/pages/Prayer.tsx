import React, { useState } from "react";
import { ScrollReveal } from "../components/ScrollReveal";
import HeroSection from "../components/HeroSection";
import LoginModal from "../components/LoginModal";
import Button from "../components/Button";
import { prayerRequestsAPI } from "../services/api";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await prayerRequestsAPI.create({
        title: formData.title,
        description: formData.description,
        requester: formData.requester || undefined,
        isPrivate: formData.isPrivate,
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        requester: "",
        isPrivate: false,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || "Failed to submit prayer request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prayer-form-section">
      {success && (
        <div
          className="success-message"
          style={{
            padding: "1rem",
            marginBottom: "1rem",
            background: "var(--color-success, #10B981)",
            color: "white",
            borderRadius: "4px",
          }}
        >
          Prayer request submitted successfully! It will be reviewed by our
          team.
        </div>
      )}
      {error && (
        <div
          className="error-message"
          style={{
            padding: "1rem",
            marginBottom: "1rem",
            background: "var(--color-error, #EF4444)",
            color: "white",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}
      <form className="prayer-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Prayer Request Title"
            required
            disabled={loading}
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
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="requester"
            value={formData.requester}
            onChange={handleChange}
            placeholder="Your Name (optional)"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="isPrivate"
              checked={formData.isPrivate}
              onChange={handleChange}
              disabled={loading}
            />
            Keep this request private (only visible to church leadership)
          </label>
        </div>
        <Button
          variant="button-primary"
          buttonText={loading ? "Submitting..." : "Submit Prayer Request"}
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

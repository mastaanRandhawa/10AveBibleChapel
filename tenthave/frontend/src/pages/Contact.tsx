import React, { useState } from "react";
import { ScrollReveal } from "../components/ScrollReveal";
import HeroSection from "../components/HeroSection";
import PageContainer from "../components/PageContainer";
import { CONTACT_INFO } from "../constants";
import contactUsImage from "../assets/contact-us.jpg";
import "./Contact.css";

// Contact form interface
interface ContactForm {
  name: string;
  email: string;
  message: string;
}

// Contact Form Component
const ContactFormComponent: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Simulate API call - replace with actual backend integration
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Form submitted:", formData);

      // Reset form on success
      setFormData({ name: "", email: "", message: "" });
      setSuccess(true);

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="contact-form-section"
      aria-labelledby="contact-form-heading"
    >
      <h3 id="contact-form-heading" className="contact-form-heading">
        SEND US A MESSAGE
      </h3>
      <p className="contact-form-description">
        Have a question? We'd love to hear from you.
      </p>

      {success && (
        <div className="form-success-message" role="alert">
          Thank you! Your message has been sent successfully.
        </div>
      )}

      {error && (
        <div className="form-error-message" role="alert">
          {error}
        </div>
      )}

      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="contact-name" className="form-label">
            YOUR NAME <span className="required">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="form-input"
            aria-required="true"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact-email" className="form-label">
            YOUR EMAIL <span className="required">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
            className="form-input"
            aria-required="true"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact-message" className="form-label">
            YOUR MESSAGE <span className="required">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="How can we help you?"
            rows={6}
            className="form-input form-textarea"
            aria-required="true"
            required
          />
        </div>
        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
          aria-describedby="contact-form-heading"
        >
          {loading ? "SENDING..." : "SEND MESSAGE"}
        </button>
        <p className="form-privacy-note">
          Your information will be kept private and used only to respond to your
          inquiry.
        </p>
      </form>
    </section>
  );
};

// Contact Details Component
const ContactDetailsComponent: React.FC = () => {
  return (
    <div className="contact-details-section">
      <div className="contact-details-item">
        <h4 className="contact-details-heading">
          <svg className="contact-icon" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          Address
        </h4>
        <p className="contact-details-text">{CONTACT_INFO.address}</p>
      </div>

      <div className="contact-details-item">
        <h4 className="contact-details-heading">
          <svg className="contact-icon" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          Phone
        </h4>
        <p className="contact-details-text">{CONTACT_INFO.phone}</p>
      </div>

      <div className="contact-details-item">
        <h4 className="contact-details-heading">
          <svg className="contact-icon" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          Email
        </h4>
        <p className="contact-details-text">{CONTACT_INFO.email}</p>
      </div>
    </div>
  );
};

// Main Contact Component
const Contact: React.FC = () => {
  return (
    <PageContainer>
      <div className="contact-page-wrapper">
        <HeroSection
          title="CONTACT US"
          subtitle="GET IN TOUCH"
          description="We'd love to hear from you. Reach out to us with any questions or prayer requests"
          backgroundImage={`url(${contactUsImage})`}
          variant="centered"
        />

        <div className="contact-main-content">
          <div className="contact-content-container">
            <ScrollReveal className="contact-form-wrapper">
              <ContactFormComponent />
            </ScrollReveal>

            <ScrollReveal className="contact-details-wrapper">
              <ContactDetailsComponent />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Contact;

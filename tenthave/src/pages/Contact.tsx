import React, { useState } from "react";
import { ScrollReveal } from "../components/ScrollReveal";
import HeroSection from "../components/HeroSection";
import { CONTACT_INFO } from "../constants";
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section
      className="contact-form-section"
      aria-labelledby="contact-form-heading"
    >
      <h3 id="contact-form-heading" className="contact-form-heading">
        CONTACT FORM:
      </h3>
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="contact-name" className="visually-hidden">
            Your full name
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full Name"
            aria-label="Your full name"
            aria-required="true"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact-email" className="visually-hidden">
            Your email address
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            aria-label="Your email address"
            aria-required="true"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact-message" className="visually-hidden">
            Your message
          </label>
          <textarea
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Message"
            rows={5}
            aria-label="Your message"
            aria-required="true"
            required
          />
        </div>
        <button
          type="submit"
          className="submit-btn"
          aria-describedby="contact-form-heading"
        >
          SEND MESSAGE
        </button>
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
    <div className="contact-page-wrapper">
      <HeroSection title="CONTACT US" variant="simple" />

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
  );
};

export default Contact;

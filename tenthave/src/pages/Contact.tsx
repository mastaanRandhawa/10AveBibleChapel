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
    <div className="contact-form-section">
      <h3 className="contact-form-heading">CONTACT FORM:</h3>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full Name"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
          />
        </div>
        <div className="form-group">
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Message"
            rows={5}
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          SEND MESSAGE
        </button>
      </form>
    </div>
  );
};

// Contact Details Component
const ContactDetailsComponent: React.FC = () => {
  return (
    <div className="contact-details-section">
      <div className="contact-details-item">
        <h4 className="contact-details-heading">Address</h4>
        <p className="contact-details-text">{CONTACT_INFO.address}</p>
      </div>

      <div className="contact-details-item">
        <h4 className="contact-details-heading">Contact Details</h4>
        <p className="contact-details-text">{CONTACT_INFO.phone}</p>
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

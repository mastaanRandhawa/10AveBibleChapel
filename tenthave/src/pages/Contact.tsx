import React, { useState } from "react";
import { ScrollReveal } from "../components/ScrollReveal";
import HeroSection from "../components/HeroSection";
import {
  CONTACT_INFO,
  WEEKLY_SERVICES,
  SPECIAL_MINISTRIES,
} from "../constants";
import "./Contact.css";

// Contact form interface
interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Contact Info Item Component
const ContactInfoItem: React.FC<{
  icon: string;
  title: string;
  content: React.ReactNode;
}> = ({ icon, title, content }) => (
  <div className="contact-info-item">
    <img src={icon} alt={title} className="contact-icon" />
    <div className="contact-details">
      <h3>{title}</h3>
      {content}
    </div>
  </div>
);

// Contact Form Component
const ContactFormComponent: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h3>Send us a Message</h3>
      <div className="form-group">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
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
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Your Phone (Optional)"
        />
      </div>
      <div className="form-group">
        <select
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
        >
          <option value="">Select a Subject</option>
          <option value="general">General Inquiry</option>
          <option value="visit">Planning a Visit</option>
          <option value="membership">Membership Information</option>
          <option value="ministry">Ministry Opportunities</option>
          <option value="prayer">Prayer Request</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="form-group">
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Message"
          rows={5}
          required
        />
      </div>
      <button type="submit" className="submit-btn">
        Send Message
      </button>
    </form>
  );
};

// Service Times Component
const ServiceTimes: React.FC = () => (
  <div className="service-times">
    <h2>Service Times</h2>
    <div className="service-times-grid">
      {WEEKLY_SERVICES.map((service) => (
        <div key={service.id} className="service-time-item">
          <h3>{service.name}</h3>
          <p className="service-time">
            {service.time.day} {service.time.start} - {service.time.end}
          </p>
          <p className="service-description">{service.description}</p>
          {service.zoomLink && (
            <a
              href={service.zoomLink}
              target="_blank"
              rel="noopener noreferrer"
              className="zoom-link"
            >
              Join Online
            </a>
          )}
        </div>
      ))}
    </div>
  </div>
);

// Ministries Component
const Ministries: React.FC = () => (
  <div className="ministries">
    <h2>Our Ministries</h2>
    <div className="ministries-grid">
      {SPECIAL_MINISTRIES.map((ministry) => (
        <div
          key={ministry.id}
          className={`ministry-item ${!ministry.isActive ? "inactive" : ""}`}
        >
          <h3>{ministry.name}</h3>
          <p>{ministry.description}</p>
          {!ministry.isActive && (
            <span className="status-badge">Currently Inactive</span>
          )}
        </div>
      ))}
    </div>
  </div>
);

// Visit Information Component
const VisitInfo: React.FC = () => (
  <div className="visit-info">
    <h2>Planning a Visit?</h2>
    <div className="visit-details">
      <div className="visit-item">
        <h3>What to Expect</h3>
        <ul>
          <li>Warm, welcoming atmosphere</li>
          <li>Casual dress code</li>
          <li>Bible-based teaching</li>
          <li>Fellowship and community</li>
          <li>Children's programs available</li>
        </ul>
      </div>
      <div className="visit-item">
        <h3>Parking & Accessibility</h3>
        <ul>
          <li>Free parking available on-site</li>
          <li>Wheelchair accessible</li>
          <li>Public transit accessible</li>
          <li>Family-friendly facilities</li>
        </ul>
      </div>
    </div>
  </div>
);

// Main Contact Component
const Contact: React.FC = () => {
  return (
    <div className="contact-page-wrapper">
      <HeroSection
        title="Contact Us"
        subtitle="WELCOME TO OUR CHURCH"
        description="We'd love to hear from you. Get in touch with us!"
      />

      <div className="contact-content">
        <ScrollReveal className="contact-info">
          <h2>Get In Touch</h2>
          <div className="contact-info-grid">
            <ContactInfoItem
              icon="/assets/location.svg"
              title="Visit Us"
              content={
                <a
                  href={CONTACT_INFO.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {CONTACT_INFO.address}
                </a>
              }
            />
            <ContactInfoItem
              icon="/assets/phone.svg"
              title="Call Us"
              content={
                <a href={`tel:${CONTACT_INFO.phone}`}>{CONTACT_INFO.phone}</a>
              }
            />
            <ContactInfoItem
              icon="/assets/phone.svg"
              title="Email Us"
              content={
                <a href={`mailto:${CONTACT_INFO.email}`}>
                  {CONTACT_INFO.email}
                </a>
              }
            />
          </div>
        </ScrollReveal>

        <ScrollReveal className="contact-form-section">
          <ContactFormComponent />
        </ScrollReveal>
      </div>

      <ScrollReveal className="service-times-section">
        <ServiceTimes />
      </ScrollReveal>

      <ScrollReveal className="ministries-section">
        <Ministries />
      </ScrollReveal>

      <ScrollReveal className="visit-info-section">
        <VisitInfo />
      </ScrollReveal>
    </div>
  );
};

export default Contact;

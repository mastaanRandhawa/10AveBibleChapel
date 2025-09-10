import React from "react";
import { ScrollReveal } from "./ScrollReveal";
import Button from "./Button";
import "./HeroSection.css";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  showButton = false,
  buttonText = "JOIN US",
  buttonLink = "#",
  backgroundImage = "url(../assets/churchPicture.svg)",
  className = "",
}) => {
  return (
    <ScrollReveal className={`hero ${className}`}>
      <div className="hero-overlay">
        {subtitle && <h2 className="hero-subtitle">{subtitle}</h2>}
        <h1 className="hero-title">{title}</h1>
        {description && (
          <div className="hero-description">
            <h3>—</h3>
            <h3 className="text-hero-description">{description}</h3>
          </div>
        )}
        {showButton && (
          <Button
            variant="button-primary"
            buttonText={buttonText}
            buttonLink={buttonLink}
          />
        )}
      </div>
    </ScrollReveal>
  );
};

export default HeroSection;

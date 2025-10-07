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
  variant?: "default" | "simple" | "centered";
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  showButton = false,
  buttonText = "LEARN MORE",
  buttonLink = "#",
  backgroundImage = "url(../assets/churchPicture.svg)",
  className = "",
  variant = "default",
}) => {
  if (variant === "simple") {
    return (
      <ScrollReveal className={`hero hero--simple ${className}`}>
        <div className="hero-overlay hero-overlay--simple">
          <h1 className="hero-title hero-title--simple">{title}</h1>
        </div>
      </ScrollReveal>
    );
  }

  if (variant === "centered") {
    return (
      <ScrollReveal
        className={`hero hero--centered ${className}`}
        style={{ backgroundImage: backgroundImage }}
      >
        <div className="hero-overlay hero-overlay--centered">
          {subtitle && (
            <h2 className="hero-subtitle hero-subtitle--centered">
              {subtitle}
            </h2>
          )}
          <h1 className="hero-title hero-title--centered">{title}</h1>
          {description && (
            <p className="hero-description hero-description--centered">
              {description}
            </p>
          )}
          {showButton && (
            <div className="hero-button">
              <Button
                variant="button-primary"
                buttonText={buttonText}
                buttonLink={buttonLink}
              />
            </div>
          )}
        </div>
      </ScrollReveal>
    );
  }

  return (
    <ScrollReveal
      className={`hero ${className}`}
      style={{ backgroundImage: backgroundImage }}
    >
      <div className="hero-overlay">
        {subtitle && <h2 className="hero-subtitle">{subtitle}</h2>}
        <h1 className="hero-title">{title}</h1>
        {description && <p className="hero-description">{description}</p>}
        {showButton && (
          <div className="hero-button">
            <Button
              variant="button-primary"
              buttonText={buttonText}
              buttonLink={buttonLink}
            />
          </div>
        )}
      </div>
    </ScrollReveal>
  );
};

export default HeroSection;

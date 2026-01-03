import React from "react";
import "./SermonHeroSection.css";

interface SermonHeroSectionProps {
  title: string;
  backgroundImage?: string;
  className?: string;
}

const SermonHeroSection: React.FC<SermonHeroSectionProps> = ({
  title,
  backgroundImage = "/assets/texture.avif",
  className = "",
}) => {
  return (
    <div className={`sermon-hero-section ${className}`}>
      <div
        className="sermon-hero-section__background"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="sermon-hero-section__overlay">
          <div className="sermon-hero-section__content">
            <h1 className="sermon-hero-section__title">{title}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SermonHeroSection;

import React from "react";
import { ScrollReveal } from "./ScrollReveal";
import bulletinImage from "../assets/bulletin.jpg";
import "./PageHero.css";

interface PageHeroProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  backgroundImage?: string;
  height?: string;
  className?: string;
}

const PageHero: React.FC<PageHeroProps> = ({
  title,
  eyebrow,
  subtitle,
  backgroundImage,
  height = "60vh",
  className = "",
}) => {
  // Default to bulletin image if not provided
  const imageUrl = backgroundImage || bulletinImage;

  return (
    <ScrollReveal
      className={`page-hero ${className}`}
      style={{
        backgroundImage: `url(${imageUrl})`,
        minHeight: height,
      }}
    >
      <div className="page-hero__overlay">
        <div className="page-hero__content">
          {eyebrow && (
            <div className="page-hero__eyebrow">{eyebrow}</div>
          )}
          <h1 className="page-hero__title">{title}</h1>
          {subtitle && (
            <p className="page-hero__subtitle">{subtitle}</p>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
};

export default PageHero;


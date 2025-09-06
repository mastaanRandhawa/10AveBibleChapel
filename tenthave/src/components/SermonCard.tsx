import React from "react";
import { SermonCardProps } from "../types";
import Button from "./ButtonSecondary";
import "./SermonCard.css";

/**
 * Modern, flexible SermonCard component with multiple variants and customizable features
 *
 * @example
 * // Basic usage
 * <SermonCard
 *   image="/path/to/image.jpg"
 *   title="Sermon Title"
 *   description="Sermon description"
 *   link="/sermon/1"
 * />
 *
 * @example
 * // Featured card with all details
 * <SermonCard
 *   image="/path/to/image.jpg"
 *   title="Featured Sermon"
 *   description="Special sermon description"
 *   name="FEATURED"
 *   category="Sunday Service"
 *   speaker="Pastor John"
 *   date="2024-01-21"
 *   time={{ day: "Sunday", start: "11:30 AM", end: "12:30 PM" }}
 *   location="Church Address"
 *   link="/sermon/featured"
 *   variant="featured"
 *   buttonText="WATCH NOW"
 *   showSpeaker={true}
 *   showDate={true}
 * />
 */

const SermonCard: React.FC<SermonCardProps> = ({
  // Required props
  image,
  title,
  description,

  // Optional props with defaults
  name,
  link,
  time,
  location,
  speaker,
  date,
  category,

  // Styling and behavior
  className = "",
  variant = "default",
  showTime = true,
  showLocation = true,
  showSpeaker = false,
  showDate = false,

  // Button customization
  buttonText = "WATCH",
  buttonVariant = "button-secondary",
}) => {
  // Format date if provided
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Determine which details to show
  const hasDetails =
    (showTime && time) ||
    (showLocation && location) ||
    (showSpeaker && speaker) ||
    (showDate && date);

  return (
    <div className={`sermon-card sermon-card--${variant} ${className}`.trim()}>
      <div className="sermon-card__content">
        {/* Header Section */}
        <div className="sermon-card__header">
          {name && <div className="sermon-card__label">{name}</div>}
          {category && <div className="sermon-card__category">{category}</div>}
        </div>

        {/* Title and Description */}
        <div className="sermon-card__body">
          <h2 className="sermon-card__title">{title}</h2>
          <p className="sermon-card__description">{description}</p>
        </div>

        {/* Details Section */}
        {hasDetails && (
          <div className="sermon-card__details">
            {showTime && time && (
              <div className="sermon-card__detail-item">
                <span className="sermon-card__icon">🕐</span>
                <div className="sermon-card__detail-content">
                  <span className="sermon-card__detail-label">Time</span>
                  <span className="sermon-card__detail-value">
                    {time?.day} {time?.start} - {time?.end}
                  </span>
                </div>
              </div>
            )}

            {showLocation && location && (
              <div className="sermon-card__detail-item">
                <span className="sermon-card__icon">📍</span>
                <div className="sermon-card__detail-content">
                  <span className="sermon-card__detail-label">Location</span>
                  <span className="sermon-card__detail-value">{location}</span>
                </div>
              </div>
            )}

            {showSpeaker && speaker && (
              <div className="sermon-card__detail-item">
                <span className="sermon-card__icon">👤</span>
                <div className="sermon-card__detail-content">
                  <span className="sermon-card__detail-label">Speaker</span>
                  <span className="sermon-card__detail-value">{speaker}</span>
                </div>
              </div>
            )}

            {showDate && date && (
              <div className="sermon-card__detail-item">
                <span className="sermon-card__icon">📅</span>
                <div className="sermon-card__detail-content">
                  <span className="sermon-card__detail-label">Date</span>
                  <span className="sermon-card__detail-value">
                    {formatDate(date)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        {link && (
          <div className="sermon-card__actions">
            <Button
              variant={buttonVariant}
              buttonText={buttonText}
              buttonLink={link}
            />
          </div>
        )}
      </div>

      {/* Image Section */}
      <div className="sermon-card__image">
        <img src={image} alt={title} />
        {category && (
          <div className="sermon-card__image-overlay">{category}</div>
        )}
      </div>
    </div>
  );
};

export default SermonCard;

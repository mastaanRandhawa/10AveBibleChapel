import React from "react";
import { SermonCardProps } from "../types";
import homeIcon from "../assets/home.svg";
import locationIcon from "../assets/location.svg";
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
  showImage = true,

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
    <div
      className={`sermon-card sermon-card--${variant} ${
        showImage ? "" : "sermon-card--no-image"
      } ${className}`.trim()}
    >
      <div className="sermon-card__content">
        {/* Date in top right corner */}
        {date && (
          <div className="sermon-card__date">
            <span className="sermon-card__date-day">
              {new Date(date).getDate()}
            </span>
            <span className="sermon-card__date-month">
              {new Date(date)
                .toLocaleDateString("en-US", { month: "long" })
                .toUpperCase()}
            </span>
          </div>
        )}

        {/* Header Section */}
        {name && <div className="sermon-card__label">{name}</div>}

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
                <div className="sermon-card__icon">
                  <img src={homeIcon} alt="Time" width="12" height="12" />
                </div>
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
                <div className="sermon-card__icon">
                  <img
                    src={locationIcon}
                    alt="Location"
                    width="12"
                    height="12"
                  />
                </div>
                <div className="sermon-card__detail-content">
                  <span className="sermon-card__detail-label">Location</span>
                  <span className="sermon-card__detail-value">{location}</span>
                </div>
              </div>
            )}

            {showSpeaker && speaker && (
              <div className="sermon-card__detail-item">
                <div className="sermon-card__icon">
                  <span style={{ fontSize: "12px" }}>👤</span>
                </div>
                <div className="sermon-card__detail-content">
                  <span className="sermon-card__detail-label">Speaker</span>
                  <span className="sermon-card__detail-value">{speaker}</span>
                </div>
              </div>
            )}

            {showDate && date && (
              <div className="sermon-card__detail-item">
                <div className="sermon-card__icon">
                  <span style={{ fontSize: "12px" }}>📅</span>
                </div>
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
            <a
              href={link}
              className="sermon-card__button"
              rel="noopener noreferrer"
            >
              {buttonText}
            </a>
          </div>
        )}
      </div>

      {/* Image Section */}
      {showImage && (
        <div className="sermon-card__image">
          <img src={image} alt={title} />
        </div>
      )}
    </div>
  );
};

export default SermonCard;

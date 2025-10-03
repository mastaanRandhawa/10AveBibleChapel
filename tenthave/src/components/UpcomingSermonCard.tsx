import React from "react";
import Button from "./Button";
import "./UpcomingSermonCard.css";

interface UpcomingSermonCardProps {
  title: string;
  description: string;
  time: string;
  location: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

const UpcomingSermonCard: React.FC<UpcomingSermonCardProps> = ({
  title,
  description,
  time,
  location,
  buttonText = "WATCH",
  onButtonClick,
  className = "",
}) => {
  return (
    <div className={`upcoming-sermon-card ${className}`}>
      <div className="upcoming-sermon-card__content">
        <div className="upcoming-sermon-card__label">UPCOMING EVENT</div>
        <h2 className="upcoming-sermon-card__title">{title}</h2>
        <p className="upcoming-sermon-card__description">{description}</p>

        <div className="upcoming-sermon-card__details">
          <div className="upcoming-sermon-card__detail-item">
            <span className="upcoming-sermon-card__icon">🕐</span>
            <span className="upcoming-sermon-card__detail-text">{time}</span>
          </div>
          <div className="upcoming-sermon-card__detail-item">
            <span className="upcoming-sermon-card__icon">📍</span>
            <span className="upcoming-sermon-card__detail-text">
              {location}
            </span>
          </div>
        </div>

        <div className="upcoming-sermon-card__actions">
          <Button
            variant="button-primary"
            buttonText={buttonText}
            onClick={onButtonClick}
          />
        </div>
      </div>
    </div>
  );
};

export default UpcomingSermonCard;

import React from "react";
import "./RecentSermonCard.css";

interface RecentSermonCardProps {
  date: string;
  title: string;
  description: string;
  time: string;
  location: string;
  className?: string;
}

const RecentSermonCard: React.FC<RecentSermonCardProps> = ({
  date,
  title,
  description,
  time,
  location,
  className = "",
}) => {
  return (
    <div className={`recent-sermon-card ${className}`}>
      <div className="recent-sermon-card__date">{date}</div>
      <div className="recent-sermon-card__content">
        <div className="recent-sermon-card__label">UPCOMING EVENT</div>
        <h3 className="recent-sermon-card__title">{title}</h3>
        <p className="recent-sermon-card__description">{description}</p>

        <div className="recent-sermon-card__details">
          <div className="recent-sermon-card__detail-item">
            <span className="recent-sermon-card__icon">🕐</span>
            <span className="recent-sermon-card__detail-text">{time}</span>
          </div>
          <div className="recent-sermon-card__detail-item">
            <span className="recent-sermon-card__icon">📍</span>
            <span className="recent-sermon-card__detail-text">{location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentSermonCard;

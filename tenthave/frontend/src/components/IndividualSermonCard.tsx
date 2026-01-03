import React from "react";
import { IndividualSermonCardProps } from "../types";
import "./IndividualSermonCard.css";

/**
 * IndividualSermonCard component for displaying individual sermons in a series grid
 *
 * @example
 * <IndividualSermonCard
 *   image="/path/to/speaker-image.jpg"
 *   title="LIVE A BIGGER STORY"
 *   subtitle="A Story That's Bigger Than Us"
 *   speaker="Finu type"
 *   date="05.04.25"
 *   link="/sermon/live-a-bigger-story"
 * />
 */

const IndividualSermonCard: React.FC<IndividualSermonCardProps> = ({
  image,
  title,
  subtitle,
  speaker,
  date,
  link = "#",
  className = "",
}) => {
  return (
    <div className={`individual-sermon-card ${className}`}>
      <div className="individual-sermon-card__image">
        <img src={image} alt={speaker} />
        <div className="individual-sermon-card__overlay">
          <h3 className="individual-sermon-card__title">{title}</h3>
        </div>
      </div>
      <div className="individual-sermon-card__details">
        <p className="individual-sermon-card__subtitle">{subtitle}</p>
        <p className="individual-sermon-card__speaker">{speaker}</p>
        <p className="individual-sermon-card__date">{date}</p>
      </div>
    </div>
  );
};

export default IndividualSermonCard;

import React from "react";
import { FeaturedSermonCardProps } from "../types";
import "./FeaturedSermonCard.css";

/**
 * FeaturedSermonCard component for displaying the main featured sermon in a series
 *
 * @example
 * <FeaturedSermonCard
 *   image="/path/to/speaker-image.jpg"
 *   title="BEST IS YET TO COME"
 *   subtitle="A Future Bigger Than Us"
 *   passage="Hebrews 11:8-10"
 *   speaker="Finu type"
 *   date="06.01.25"
 *   link="/sermon/best-is-yet-to-come"
 * />
 */

const FeaturedSermonCard: React.FC<FeaturedSermonCardProps> = ({
  image,
  title,
  subtitle,
  passage,
  speaker,
  date,
  link = "#",
  className = "",
}) => {
  return (
    <div className={`featured-sermon-card ${className}`}>
      <div className="featured-sermon-card__image">
        <img src={image} alt={speaker} />
        <div className="featured-sermon-card__play-button">
          <a href={link} className="play-button">
            WATCH
          </a>
        </div>
      </div>
      <div className="featured-sermon-card__content">
        <h1 className="featured-sermon-card__title">{title}</h1>
        <div className="featured-sermon-card__details">
          <p className="featured-sermon-card__subtitle">{subtitle}</p>
          <p className="featured-sermon-card__passage">Passage: {passage}</p>
          <p className="featured-sermon-card__speaker">{speaker}</p>
          <p className="featured-sermon-card__date">{date}</p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedSermonCard;

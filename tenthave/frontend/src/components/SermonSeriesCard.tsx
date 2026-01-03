import React from "react";
import { SermonSeriesCardProps } from "../types";
import "./SermonSeriesCard.css";

/**
 * SermonSeriesCard component for displaying sermon series in a grid layout
 *
 * @example
 * <SermonSeriesCard
 *   image="/path/to/series-image.jpg"
 *   title="Relationships Anonymous"
 *   episodeCount={4}
 *   link="/series/relationships-anonymous"
 * />
 */

const SermonSeriesCard: React.FC<SermonSeriesCardProps> = ({
  image,
  title,
  episodeCount,
  link = "#",
  className = "",
}) => {
  return (
    <div className={`sermon-series-card ${className}`}>
      <div className="sermon-series-card__image">
        <img src={image} alt={title} />
      </div>
      <div className="sermon-series-card__content">
        <h3 className="sermon-series-card__title">{title}</h3>
        <p className="sermon-series-card__episodes">
          {episodeCount} {episodeCount === 1 ? "EPISODE" : "EPISODES"}
        </p>
        <a href={link} className="sermon-series-card__button">
          WATCH NOW →
        </a>
      </div>
    </div>
  );
};

export default SermonSeriesCard;

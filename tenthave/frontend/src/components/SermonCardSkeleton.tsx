import React from "react";
import "./SermonCard.css";

/**
 * SermonCardSkeleton - Loading skeleton for SermonCard
 * Shows a placeholder while sermon data is loading
 */
const SermonCardSkeleton: React.FC = () => {
  return (
    <div className="sermon-card-skeleton">
      <div className="sermon-card-skeleton__content">
        <div className="sermon-card-skeleton__label" />
        <div className="sermon-card-skeleton__title" />
        <div className="sermon-card-skeleton__title" style={{ width: "75%" }} />
        <div className="sermon-card-skeleton__accent" />
        <div className="sermon-card-skeleton__metadata" />
      </div>
      <div className="sermon-card-skeleton__action" />
    </div>
  );
};

export default SermonCardSkeleton;


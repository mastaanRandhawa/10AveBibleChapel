import React from "react";
import "./SermonCard.css";

export interface SermonCardProps {
  // Required props
  title: string;
  date: string;
  speaker: string;

  // Optional props
  series?: string;
  passage?: string;
  videoUrl?: string;
  audioUrl?: string;
  className?: string;

  // Action handler
  onClick?: () => void;
}

/**
 * SermonCard - A unified sermon card component with modern light theme
 * 
 * Features:
 * - Series/category label at top
 * - Prominent sermon title (2-line clamp)
 * - Subtle brand-accent underline
 * - Metadata row (date, speaker, passage)
 * - Circular action button (Watch/Listen/Details)
 * 
 * @example
 * <SermonCard
 *   title="The Best Is Yet To Come"
 *   series="Faith Series"
 *   speaker="John Smith"
 *   date="2025-01-04"
 *   videoUrl="https://..."
 * />
 */
const SermonCard: React.FC<SermonCardProps> = ({
  title,
  date,
  speaker,
  series,
  passage,
  videoUrl,
  audioUrl,
  className = "",
  onClick,
}) => {
  // Format date for display (MM.DD.YY)
  const formatDate = (dateString: string): string => {
    const dateObj = new Date(dateString);
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = String(dateObj.getFullYear()).slice(-2);
    return `${month}.${day}.${year}`;
  };

  // Determine action button text and behavior
  const getActionLabel = (): string => {
    if (videoUrl) return "Watch";
    if (audioUrl) return "Listen";
    return "Details";
  };

  // Handle action button click
  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (videoUrl) {
      window.open(videoUrl, "_blank", "noopener,noreferrer");
    } else if (audioUrl) {
      window.open(audioUrl, "_blank", "noopener,noreferrer");
    } else if (onClick) {
      onClick();
    }
  };

  // Handle card click
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // Get label text (series or "SERMON")
  const labelText = series || "SERMON";

  // Build metadata items
  const metadataItems: string[] = [];
  metadataItems.push(formatDate(date));
  metadataItems.push(speaker);
  if (passage) {
    metadataItems.push(passage);
  }

  return (
    <article
      className={`sermon-card ${className}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <div className="sermon-card__content">
        {/* Top Label */}
        <div className="sermon-card__label">{labelText}</div>

        {/* Title */}
        <h3 className="sermon-card__title">{title}</h3>

        {/* Accent Underline */}
        <div className="sermon-card__accent" />

        {/* Metadata Row */}
        <div className="sermon-card__metadata">
          {metadataItems.map((item, index) => (
            <React.Fragment key={index}>
              <span className="sermon-card__metadata-item">{item}</span>
              {index < metadataItems.length - 1 && (
                <span className="sermon-card__metadata-separator">•</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button
        className="sermon-card__action"
        onClick={handleAction}
        aria-label={`${getActionLabel()} sermon: ${title}`}
        type="button"
      >
        <span className="sermon-card__action-text">{getActionLabel()}</span>
      </button>
    </article>
  );
};

export default SermonCard;


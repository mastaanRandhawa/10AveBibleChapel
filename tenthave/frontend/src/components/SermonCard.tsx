import React from "react";
import Badge from "./Badge";
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

  // Series-specific props
  isSeries?: boolean;
  episodeCount?: number;

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
  isSeries = false,
  episodeCount,
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
    if (isSeries) return "Browse";
    if (videoUrl) return "Watch";
    if (audioUrl) return "Listen";
    return "Details";
  };

  // Handle action button click
  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();

    // For series, always use onClick to navigate to series page
    if (isSeries && onClick) {
      onClick();
      return;
    }

    // For individual sermons, open video/audio or use onClick
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

  // Get label text (series name or "SERMON")
  const labelText = isSeries ? series || "SERIES" : series || "SERMON";

  // Build metadata items
  const metadataItems: string[] = [];
  metadataItems.push(formatDate(date));
  metadataItems.push(speaker);
  if (passage) {
    metadataItems.push(passage);
  }

  return (
    <article
      className={`sermon-card ${
        isSeries ? "sermon-card--series" : ""
      } ${className}`}
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
        {/* Top Label Row - Series Badge + Label */}
        <div className="sermon-card__label-row">
          {isSeries && (
            <Badge variant="primary" className="sermon-card__series-badge">
              SERMON SERIES
            </Badge>
          )}
          <div className="sermon-card__label">{labelText}</div>
        </div>

        {/* Title */}
        <h3 className="sermon-card__title">{title}</h3>

        {/* Accent Underline */}
        <div className="sermon-card__accent" />

        {/* Metadata Row with Episode Count for Series */}
        <div className="sermon-card__metadata">
          {isSeries && episodeCount !== undefined && (
            <>
              <span className="sermon-card__episode-count">
                {episodeCount} {episodeCount === 1 ? "sermon" : "sermons"}
              </span>
              <span className="sermon-card__metadata-separator">•</span>
            </>
          )}
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
        className={`sermon-card__action ${
          isSeries ? "sermon-card__action--series" : ""
        }`}
        onClick={handleAction}
        aria-label={`${getActionLabel()} ${
          isSeries ? "series" : "sermon"
        }: ${title}`}
        type="button"
      >
        <span className="sermon-card__action-text">{getActionLabel()}</span>
      </button>
    </article>
  );
};

export default SermonCard;

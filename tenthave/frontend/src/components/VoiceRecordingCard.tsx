import React, { useState } from "react";
import { VoiceRecording } from "../services/api";
import "./VoiceRecordingCard.css";

interface VoiceRecordingCardProps {
  recording: VoiceRecording;
  className?: string;
}

const VoiceRecordingCard: React.FC<VoiceRecordingCardProps> = ({
  recording,
  className = "",
}) => {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString: string): string => {
    const d = new Date(dateString);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    return `${month}.${day}.${year}`;
  };

  const metadataItems: string[] = [formatDate(recording.date), recording.speaker];
  if (recording.passage) metadataItems.push(recording.passage);

  return (
    <article className={`vr-card ${className}`}>
      <div className="vr-card__content">
        {/* Top label row */}
        <div className="vr-card__label-row">
          <span className="vr-card__icon" aria-hidden="true">🎙</span>
          <span className="vr-card__label">
            {recording.category ? recording.category.toUpperCase() : "RECORDING"}
          </span>
          {recording.isFeatured && (
            <span className="vr-card__featured-badge">FEATURED</span>
          )}
        </div>

        {/* Title */}
        <h3 className="vr-card__title">{recording.title}</h3>

        {/* Accent */}
        <div className="vr-card__accent" />

        {/* Metadata */}
        <div className="vr-card__metadata">
          {metadataItems.map((item, i) => (
            <React.Fragment key={i}>
              <span className="vr-card__metadata-item">{item}</span>
              {i < metadataItems.length - 1 && (
                <span className="vr-card__separator">•</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Description (collapsed by default) */}
        {recording.description && (
          <p className={`vr-card__description ${expanded ? "vr-card__description--expanded" : ""}`}>
            {recording.description}
          </p>
        )}
      </div>

      {/* Action row */}
      <div className="vr-card__actions">
        {recording.description && (
          <button
            className="vr-card__expand-btn"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            type="button"
          >
            {expanded ? "Less" : "More"}
          </button>
        )}
        <button
          className="vr-card__play-btn"
          onClick={() => setExpanded(true)}
          type="button"
          aria-label={`Listen to ${recording.title}`}
        >
          ▶ Listen
        </button>
      </div>

      {/* Embedded player */}
      {expanded && (
        <div className="vr-card__player">
          {recording.embedType === "audio" ? (
            <audio
              controls
              src={recording.embedUrl}
              className="vr-card__audio"
              preload="metadata"
            >
              Your browser does not support the audio element.
            </audio>
          ) : (
            <iframe
              src={recording.embedUrl}
              title={recording.title}
              className="vr-card__iframe"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              scrolling="no"
              frameBorder="0"
            />
          )}
        </div>
      )}
    </article>
  );
};

export default VoiceRecordingCard;

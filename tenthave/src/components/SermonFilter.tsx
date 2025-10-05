import React, { useState } from "react";
import "./SermonFilter.css";

interface SermonFilterProps {
  speakers: string[];
  selectedSpeaker: string;
  onSpeakerChange: (speaker: string) => void;
  onReset: () => void;
  className?: string;
}

/**
 * SermonFilter component for filtering sermons by speaker
 *
 * @example
 * <SermonFilter
 *   speakers={["All Speakers", "Finu type", "Chris de Mony"]}
 *   selectedSpeaker="All Speakers"
 *   onSpeakerChange={handleSpeakerChange}
 *   onReset={handleReset}
 * />
 */

const SermonFilter: React.FC<SermonFilterProps> = ({
  speakers,
  selectedSpeaker,
  onSpeakerChange,
  onReset,
  className = "",
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSpeakerSelect = (speaker: string) => {
    onSpeakerChange(speaker);
    setIsDropdownOpen(false);
  };

  return (
    <div className={`sermon-filter ${className}`}>
      <div className="sermon-filter__label">BY SPEAKER</div>

      <div className="sermon-filter__dropdown">
        <button
          className="sermon-filter__dropdown-button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span>{selectedSpeaker}</span>
          <svg
            className={`sermon-filter__dropdown-arrow ${
              isDropdownOpen ? "open" : ""
            }`}
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
          >
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="sermon-filter__dropdown-menu">
            {speakers.map((speaker, index) => (
              <button
                key={index}
                className={`sermon-filter__dropdown-item ${
                  speaker === selectedSpeaker ? "selected" : ""
                }`}
                onClick={() => handleSpeakerSelect(speaker)}
              >
                {speaker}
              </button>
            ))}
          </div>
        )}
      </div>

      <button className="sermon-filter__reset" onClick={onReset}>
        RESET →
      </button>
    </div>
  );
};

export default SermonFilter;

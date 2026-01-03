import React from "react";
import "./SkeletonLoader.css";

interface SkeletonProps {
  variant?: "text" | "title" | "paragraph" | "card" | "avatar" | "button" | "custom";
  width?: string;
  height?: string;
  count?: number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "text",
  width,
  height,
  count = 1,
  className = "",
}) => {
  const skeletonClass = `skeleton skeleton-${variant} ${className}`.trim();
  const style: React.CSSProperties = {};

  if (width) style.width = width;
  if (height) style.height = height;

  if (count === 1) {
    return <div className={skeletonClass} style={style} aria-label="Loading..." />;
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={skeletonClass} style={style} aria-label="Loading..." />
      ))}
    </>
  );
};

// Skeleton for table rows
export const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => {
  return (
    <div className="skeleton-table">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="skeleton-table-row">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="skeleton-table-cell">
              <Skeleton variant="text" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Skeleton for card lists (e.g., sermon cards, event cards)
export const SkeletonCardList: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="skeleton-card-list">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card-item">
          <Skeleton variant="card" height="200px" />
          <div className="skeleton-card-content">
            <Skeleton variant="title" />
            <Skeleton variant="paragraph" count={3} />
          </div>
        </div>
      ))}
    </div>
  );
};

// Skeleton for calendar
export const SkeletonCalendar: React.FC = () => {
  return (
    <div className="skeleton-calendar">
      <div className="skeleton-calendar-header">
        <Skeleton variant="title" width="200px" />
        <div className="skeleton-calendar-controls">
          <Skeleton variant="button" width="40px" height="40px" />
          <Skeleton variant="button" width="40px" height="40px" />
        </div>
      </div>
      <div className="skeleton-calendar-grid">
        {Array.from({ length: 35 }).map((_, index) => (
          <div key={index} className="skeleton-calendar-day">
            <Skeleton variant="text" width="30px" height="30px" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Skeleton for form
export const SkeletonForm: React.FC<{ fields?: number }> = ({ fields = 4 }) => {
  return (
    <div className="skeleton-form">
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="skeleton-form-field">
          <Skeleton variant="text" width="120px" height="14px" />
          <Skeleton variant="text" width="100%" height="48px" />
        </div>
      ))}
      <Skeleton variant="button" width="150px" />
    </div>
  );
};

export default Skeleton;


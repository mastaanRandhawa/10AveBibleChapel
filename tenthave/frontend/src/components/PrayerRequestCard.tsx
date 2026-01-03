import React from "react";

export interface PrayerRequest {
  id: string;
  title: string;
  description: string;
  requester: string;
  date: string;
  isAnswered: boolean;
  category: "health" | "family" | "work" | "spiritual" | "community" | "other";
  priority: "urgent" | "high" | "normal";
  isPrivate: boolean;
  answeredDate?: string;
}

interface PrayerRequestCardProps {
  request: PrayerRequest;
  className?: string;
}

/**
 * PrayerRequestCard component for displaying individual prayer requests
 * Provides accessible card layout with proper semantic structure
 */
const PrayerRequestCard: React.FC<PrayerRequestCardProps> = ({
  request,
  className = "",
}) => {
  const getPriorityColor = (priority: PrayerRequest["priority"]) => {
    switch (priority) {
      case "urgent":
        return "var(--color-error)";
      case "high":
        return "var(--color-warning)";
      case "normal":
        return "var(--color-success)";
      default:
        return "var(--color-muted-gray)";
    }
  };

  const getCategoryIcon = (category: PrayerRequest["category"]) => {
    switch (category) {
      case "health":
        return "🏥";
      case "family":
        return "👨‍👩‍👧‍👦";
      case "work":
        return "💼";
      case "spiritual":
        return "🙏";
      case "community":
        return "🏘️";
      default:
        return "💭";
    }
  };

  return (
    <article
      className={`prayer-request-card ${className}`}
      aria-labelledby={`prayer-title-${request.id}`}
    >
      <div className="prayer-request-header">
        <div className="prayer-request-meta">
          <span
            className="prayer-category"
            aria-label={`Category: ${request.category}`}
          >
            {getCategoryIcon(request.category)} {request.category}
          </span>
          <span
            className="prayer-priority"
            style={{ color: getPriorityColor(request.priority) }}
            aria-label={`Priority: ${request.priority}`}
          >
            {request.priority}
          </span>
        </div>
        <div className="prayer-request-status">
          {request.isAnswered ? (
            <span
              className="prayer-answered"
              aria-label="Prayer request has been answered"
            >
              ✅ Answered
            </span>
          ) : (
            <span
              className="prayer-pending"
              aria-label="Prayer request is pending"
            >
              ⏳ Pending
            </span>
          )}
        </div>
      </div>

      <div className="prayer-request-content">
        <h3 id={`prayer-title-${request.id}`} className="prayer-request-title">
          {request.title}
        </h3>
        <p className="prayer-request-description">{request.description}</p>
      </div>

      <div className="prayer-request-footer">
        <div className="prayer-request-dates">
          <time
            dateTime={request.date}
            className="prayer-request-date"
            aria-label={`Submitted on ${new Date(
              request.date
            ).toLocaleDateString()}`}
          >
            {new Date(request.date).toLocaleDateString()}
          </time>
          {request.answeredDate && (
            <time
              dateTime={request.answeredDate}
              className="prayer-answered-date"
              aria-label={`Answered on ${new Date(
                request.answeredDate
              ).toLocaleDateString()}`}
            >
              Answered: {new Date(request.answeredDate).toLocaleDateString()}
            </time>
          )}
        </div>
        <div className="prayer-request-requester">
          <span className="prayer-requester-label">Requested by:</span>
          <span className="prayer-requester-name">{request.requester}</span>
        </div>
      </div>
    </article>
  );
};

export default PrayerRequestCard;

import React from "react";
import { CalendarEvent } from "./Calendar";
import "./EventDetailsModal.css";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: CalendarEvent[];
  selectedDate: string;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  isOpen,
  onClose,
  events,
  selectedDate,
  onEditEvent,
  onDeleteEvent,
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "announcement":
        return "📢";
      case "event":
        return "📅";
      case "reminder":
        return "⏰";
      default:
        return "📄";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "";
    }
  };

  const getPriorityLabel = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="event-details-overlay" onClick={onClose}>
      <div className="event-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="event-details-header">
          <h2>Events for {formatDate(selectedDate)}</h2>
          <button className="event-details-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="event-details-content">
          {events.length === 0 ? (
            <div className="no-events">
              <div className="no-events-icon">📅</div>
              <h3>No events scheduled</h3>
              <p>There are no events scheduled for this date.</p>
            </div>
          ) : (
            <div className="events-list">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`event-details-card ${getPriorityColor(
                    event.priority
                  )}`}
                >
                  <div className="event-details-card-header">
                    <div className="event-type-icon">
                      {getEventTypeIcon(event.type)}
                    </div>
                    <div className="event-title-section">
                      <h3 className="event-title">{event.title}</h3>
                      <div className="event-meta">
                        <span
                          className={`priority-badge ${getPriorityColor(
                            event.priority
                          )}`}
                        >
                          {getPriorityLabel(event.priority)}
                        </span>
                        <span className="type-badge">
                          {getTypeLabel(event.type)}
                        </span>
                      </div>
                    </div>
                    <div className="event-actions">
                      <button
                        className="edit-btn"
                        onClick={() => onEditEvent(event)}
                        title="Edit event"
                      >
                        ✏️
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this event?"
                            )
                          ) {
                            onDeleteEvent(event.id);
                          }
                        }}
                        title="Delete event"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {event.description && (
                    <div className="event-description">
                      <p>{event.description}</p>
                    </div>
                  )}

                  <div className="event-details-info">
                    {event.time && (
                      <div className="event-detail-item">
                        <span className="event-detail-icon">🕐</span>
                        <span className="event-detail-label">Time:</span>
                        <span className="event-detail-value">
                          {formatTime(event.time)}
                        </span>
                      </div>
                    )}

                    {event.location && (
                      <div className="event-detail-item">
                        <span className="event-detail-icon">📍</span>
                        <span className="event-detail-label">Location:</span>
                        <span className="event-detail-value">
                          {event.location}
                        </span>
                      </div>
                    )}

                    {event.speaker && (
                      <div className="event-detail-item">
                        <span className="event-detail-icon">👤</span>
                        <span className="event-detail-label">Speaker:</span>
                        <span className="event-detail-value">
                          {event.speaker}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;

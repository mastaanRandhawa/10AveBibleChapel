import React from "react";
import { CalendarEvent } from "./Calendar";
import { EVENT_CATEGORIES } from "../constants";
import "./EventDetailsModal.css";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: CalendarEvent[];
  selectedDate: string;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  isAdmin?: boolean;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  isOpen,
  onClose,
  events,
  selectedDate,
  onEditEvent,
  onDeleteEvent,
  isAdmin = false,
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

  const getCategoryName = (categoryId: string) => {
    const category = EVENT_CATEGORIES.find((cat) => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="event-modal-header">
          <h2 className="event-modal-title">Events for {formatDate(selectedDate)}</h2>
          <button
            className="event-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="event-modal-content">
          {events.length === 0 ? (
            <div className="event-modal-empty">
              <div className="empty-icon">📅</div>
              <h3>No events scheduled</h3>
              <p>There are no events scheduled for this date.</p>
            </div>
          ) : (
            <div className="event-modal-list">
              {events.map((event) => (
                <div key={event.id} className="event-modal-card">
                  {/* Event Header: Title + Category Badge */}
                  <div className="event-modal-card-header">
                    <div className="event-header-left">
                      <h3 className="event-modal-card-title">{event.title}</h3>
                      {event.category && (
                        <span className="event-category-badge">
                          {getCategoryName(event.category)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Event Description */}
                  {event.description && (
                    <p className="event-modal-description">{event.description}</p>
                  )}

                  {/* Event Meta Info: Time + Location */}
                  <div className="event-modal-meta">
                    {event.time && (
                      <div className="event-meta-item">
                        <span className="meta-icon">🕐</span>
                        <span className="meta-label">Time:</span>
                        <span className="meta-value">{formatTime(event.time)}</span>
                      </div>
                    )}

                    {event.location && (
                      <div className="event-meta-item">
                        <span className="meta-icon">📍</span>
                        <span className="meta-label">Location:</span>
                        <span className="meta-value">{event.location}</span>
                      </div>
                    )}

                    {event.speaker && (
                      <div className="event-meta-item">
                        <span className="meta-icon">👤</span>
                        <span className="meta-label">Speaker:</span>
                        <span className="meta-value">{event.speaker}</span>
                      </div>
                    )}
                  </div>

                  {/* Admin Actions */}
                  {isAdmin && (
                    <div className="event-modal-actions">
                      <button
                        className="event-action-btn edit-btn"
                        onClick={() => onEditEvent(event)}
                      >
                        Edit Event
                      </button>
                      <button
                        className="event-action-btn delete-btn"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this event?"
                            )
                          ) {
                            onDeleteEvent(event.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
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

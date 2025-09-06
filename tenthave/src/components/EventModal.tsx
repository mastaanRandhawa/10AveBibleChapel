import React, { useState, useEffect } from "react";
import { CalendarEvent } from "./Calendar";
import "./EventModal.css";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, "id">) => void;
  selectedDate: string;
  editingEvent?: CalendarEvent | null;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  editingEvent,
}) => {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    date: string;
    time: string;
    type: "announcement" | "event" | "reminder";
    priority: "high" | "medium" | "low";
    location: string;
    speaker: string;
  }>({
    title: "",
    description: "",
    date: selectedDate,
    time: "",
    type: "event",
    priority: "medium",
    location: "",
    speaker: "",
  });

  // Update form data when editing event or selected date changes
  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title,
        description: editingEvent.description,
        date: editingEvent.date,
        time: editingEvent.time || "",
        type: editingEvent.type,
        priority: editingEvent.priority,
        location: editingEvent.location || "",
        speaker: editingEvent.speaker || "",
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        date: selectedDate,
        title: "",
        description: "",
        time: "",
        type: "event",
        priority: "medium",
        location: "",
        speaker: "",
      }));
    }
  }, [editingEvent, selectedDate]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter a title for the event.");
      return;
    }

    const eventData: Omit<CalendarEvent, "id"> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      date: formData.date,
      time: formData.time || undefined,
      type: formData.type,
      priority: formData.priority,
      location: formData.location.trim() || undefined,
      speaker: formData.speaker.trim() || undefined,
    };

    onSave(eventData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      date: selectedDate,
      time: "",
      type: "event",
      priority: "medium",
      location: "",
      speaker: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="event-modal-overlay" onClick={handleClose}>
      <div className="event-modal" onClick={(e) => e.stopPropagation()}>
        <div className="event-modal-header">
          <h2>{editingEvent ? "Edit Event" : "Add New Event"}</h2>
          <button className="event-modal-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="event-modal-date">
          <span className="event-modal-date-label">Date:</span>
          <span className="event-modal-date-value">
            {formatDate(formData.date)}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="event-modal-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter event description"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="time">Time</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="event">Event</option>
                <option value="announcement">Announcement</option>
                <option value="reminder">Reminder</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Event location"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="speaker">Speaker/Organizer</label>
            <input
              type="text"
              id="speaker"
              name="speaker"
              value={formData.speaker}
              onChange={handleInputChange}
              placeholder="Speaker or organizer name"
            />
          </div>

          <div className="event-modal-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              {editingEvent ? "Update Event" : "Add Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;

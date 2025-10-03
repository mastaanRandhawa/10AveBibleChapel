import React, { useState, useEffect } from "react";
import { CalendarEvent } from "./Calendar";
import {
  EVENT_CATEGORIES,
  DEFAULT_EVENT_COLOR,
  EVENT_COLORS,
} from "../constants";
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
    location: string;
    speaker: string;
    category: string;
    color: string;
  }>({
    title: "",
    description: "",
    date: selectedDate,
    time: "",
    location: "",
    speaker: "",
    category: "",
    color: DEFAULT_EVENT_COLOR,
  });

  // Update form data when editing event or selected date changes
  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title,
        description: editingEvent.description,
        date: editingEvent.date,
        time: editingEvent.time || "",
        location: editingEvent.location || "",
        speaker: editingEvent.speaker || "",
        category: editingEvent.category || "",
        color: editingEvent.color || DEFAULT_EVENT_COLOR,
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        date: selectedDate,
        title: "",
        description: "",
        time: "",
        location: "",
        speaker: "",
        category: "",
        color: DEFAULT_EVENT_COLOR,
      }));
    }
  }, [editingEvent, selectedDate]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // If category is selected, automatically set the color
    if (name === "category" && value) {
      const selectedCategory = EVENT_CATEGORIES.find((cat) => cat.id === value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        color: selectedCategory ? selectedCategory.color : prev.color,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
      location: formData.location.trim() || undefined,
      speaker: formData.speaker.trim() || undefined,
      category: formData.category || undefined,
      color: formData.color,
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
      location: "",
      speaker: "",
      category: "",
      color: DEFAULT_EVENT_COLOR,
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
            ``{" "}
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Select a category</option>
                {EVENT_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="color">Color</label>
              <select
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
              >
                {EVENT_COLORS.map((color) => (
                  <option key={color.id} value={color.value}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>
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

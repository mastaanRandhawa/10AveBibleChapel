import React, { useState } from "react";
import { ScrollReveal } from "../components/ScrollReveal";
import HeroSection from "../components/HeroSection";
import Calendar, { CalendarEvent } from "../components/Calendar";
import EventModal from "../components/EventModal";
import EventDetailsModal from "../components/EventDetailsModal";
import LoginModal from "../components/LoginModal";
import "./Bulletin.css";

// Prayer request interface
interface PrayerRequest {
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

// Mock prayer requests data
const MOCK_PRAYER_REQUESTS: PrayerRequest[] = [
  {
    id: "1",
    title: "Health and Healing",
    description:
      "Praying for strength and recovery during this difficult time. Please pray for complete healing and restoration.",
    requester: "Anonymous",
    date: "2024-01-15",
    isAnswered: false,
    category: "health",
    priority: "urgent",
    isPrivate: false,
  },
  {
    id: "2",
    title: "Family Unity",
    description:
      "Praying for reconciliation and peace within our family. We need God's intervention to heal broken relationships.",
    requester: "Anonymous",
    date: "2024-01-14",
    isAnswered: false,
    category: "family",
    priority: "high",
    isPrivate: false,
  },
  {
    id: "3",
    title: "Job Opportunities",
    description:
      "Seeking God's guidance for new employment opportunities. Praying for the right doors to open.",
    requester: "Anonymous",
    date: "2024-01-13",
    isAnswered: true,
    category: "work",
    priority: "normal",
    isPrivate: false,
    answeredDate: "2024-01-20",
  },
];

// Prayer Request Card Component
const PrayerRequestCard: React.FC<{ request: PrayerRequest }> = ({
  request,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryIcon = (category: string) => {
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
        return "🌍";
      default:
        return "💭";
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "priority-urgent";
      case "high":
        return "priority-high";
      case "normal":
        return "priority-normal";
      default:
        return "";
    }
  };

  return (
    <div
      className={`prayer-card ${
        request.isAnswered ? "answered" : ""
      } ${getPriorityClass(request.priority)}`}
    >
      <div className="prayer-header">
        <div className="prayer-title-section">
          <h3 className="prayer-title">{request.title}</h3>
          <div className="prayer-badges">
            <span className="category-badge">
              {getCategoryIcon(request.category)}{" "}
              {request.category.toUpperCase()}
            </span>
            <span
              className={`priority-badge ${getPriorityClass(request.priority)}`}
            >
              {request.priority.toUpperCase()}
            </span>
            {request.isAnswered && (
              <span className="answered-badge">Answered</span>
            )}
          </div>
        </div>
      </div>
      <p className="prayer-description">{request.description}</p>
      <div className="prayer-meta">
        <span className="prayer-date">{formatDate(request.date)}</span>
        {request.isAnswered && request.answeredDate && (
          <span className="answered-date">
            Answered: {formatDate(request.answeredDate)}
          </span>
        )}
        <span className="prayer-requester">
          Requested by: {request.requester}
        </span>
      </div>
    </div>
  );
};

// Prayer Request Form Component
const PrayerRequestForm: React.FC<{ onLoginClick: () => void }> = ({
  onLoginClick,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requester: "",
    category: "other" as const,
    priority: "normal" as const,
    isPrivate: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Prayer request submitted:", formData);
    // Reset form
    setFormData({
      title: "",
      description: "",
      requester: "",
      category: "other",
      priority: "normal",
      isPrivate: false,
    });
  };

  return (
    <div className="prayer-form-section">
      <div className="prayer-form-header">
        <h3>Submit a Prayer Request</h3>
        <p className="prayer-form-subtitle">
          Share your prayer needs with our community. All requests are kept
          confidential and prayed for by our church family.
        </p>
      </div>

      <form className="prayer-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Prayer Request Title"
            required
          />
        </div>
        <div className="form-group">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your prayer request"
            rows={4}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="requester"
            value={formData.requester}
            onChange={handleChange}
            placeholder="Your Name (optional)"
          />
        </div>
        <button type="submit" className="submit-btn">
          Submit Prayer Request
        </button>
      </form>

      <div className="prayer-form-footer">
        <p className="login-prompt">
          Want to view and pray for others?
          <button className="login-link-btn" onClick={onLoginClick}>
            Sign in to access prayer requests
          </button>
        </p>
      </div>
    </div>
  );
};

// Main Bulletin Component
const Bulletin: React.FC = () => {
  // Calendar and event management state
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Sunday Service",
      description: "Weekly worship service with Pastor John Smith",
      date: "2024-01-21",
      time: "11:30",
      location: "Main Sanctuary",
      speaker: "Pastor John Smith",
      category: "worship",
      color: "#FBCB9C",
    },
    {
      id: "2",
      title: "Youth Group Meeting",
      description: "Youth group will meet for fellowship and Bible study",
      date: "2024-01-19",
      time: "19:00",
      location: "Youth Room",
      category: "youth",
      color: "#4169E1",
    },
    {
      id: "3",
      title: "Prayer Meeting",
      description: "Weekly prayer meeting for church, community, and world",
      date: "2024-01-17",
      time: "18:30",
      location: "Prayer Room",
      category: "prayer",
      color: "#4B0082",
    },
  ]);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDateEvents, setSelectedDateEvents] = useState<CalendarEvent[]>(
    []
  );
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // Prayer request state
  const [prayerRequests] = useState<PrayerRequest[]>(MOCK_PRAYER_REQUESTS);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Prayer request handlers
  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginSuccess = (userData: any) => {
    console.log("User logged in:", userData);
    setIsLoginModalOpen(false);
  };

  // Calendar event handlers
  const handleDateClick = (date: string, dateEvents: CalendarEvent[]) => {
    setSelectedDate(date);
    setSelectedDateEvents(dateEvents);
    setIsEventDetailsModalOpen(true);
  };

  const handleAddEvent = (date: string) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (eventData: Omit<CalendarEvent, "id">) => {
    if (editingEvent) {
      // Update existing event
      setEvents((prev) =>
        prev.map((event) =>
          event.id === editingEvent.id
            ? { ...eventData, id: editingEvent.id }
            : event
        )
      );
    } else {
      // Add new event
      const newEvent: CalendarEvent = {
        ...eventData,
        id: Date.now().toString(),
      };
      setEvents((prev) => [...prev, newEvent]);
    }
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setIsEventDetailsModalOpen(false);
    setIsEventModalOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
    setIsEventDetailsModalOpen(false);
  };

  const handleCloseEventModal = () => {
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };

  const handleCloseEventDetailsModal = () => {
    setIsEventDetailsModalOpen(false);
    setSelectedDateEvents([]);
  };

  return (
    <div className="bulletin-page-wrapper">
      <HeroSection title="CHURCH BULLETIN & PRAYER" variant="simple" />

      <div className="bulletin-content">
        {/* Calendar Section */}
        <ScrollReveal className="bulletin-calendar-section">
          <Calendar
            events={events}
            onDateClick={handleDateClick}
            onAddEvent={handleAddEvent}
          />
        </ScrollReveal>

        {/* Prayer Request Section */}
        <ScrollReveal className="prayer-form-section">
          <PrayerRequestForm onLoginClick={handleLoginClick} />
        </ScrollReveal>
      </div>

      {/* Event Modals */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={handleCloseEventModal}
        onSave={handleSaveEvent}
        selectedDate={selectedDate}
        editingEvent={editingEvent}
      />

      <EventDetailsModal
        isOpen={isEventDetailsModalOpen}
        onClose={handleCloseEventDetailsModal}
        events={selectedDateEvents}
        selectedDate={selectedDate}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginModalClose}
        onLogin={handleLoginSuccess}
      />
    </div>
  );
};

export default Bulletin;

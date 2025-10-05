import React, { useState } from "react";
import { ScrollReveal } from "../components/ScrollReveal";
import HeroSection from "../components/HeroSection";
import Calendar, { CalendarEvent } from "../components/Calendar";
import EventModal from "../components/EventModal";
import EventDetailsModal from "../components/EventDetailsModal";
import LoginModal from "../components/LoginModal";
import Button from "../components/Button";
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
    requester: "Sarah M.",
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
    requester: "Michael R.",
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
    requester: "Jennifer L.",
    date: "2024-01-13",
    isAnswered: true,
    category: "work",
    priority: "normal",
    isPrivate: false,
    answeredDate: "2024-01-20",
  },
  {
    id: "4",
    title: "Spiritual Growth",
    description:
      "Praying for deeper understanding of God's word and stronger faith during this season of growth.",
    requester: "David K.",
    date: "2024-01-12",
    isAnswered: false,
    category: "spiritual",
    priority: "normal",
    isPrivate: false,
  },
  {
    id: "5",
    title: "Community Outreach",
    description:
      "Praying for our church's outreach programs and that we may reach more people in our community.",
    requester: "Pastor John",
    date: "2024-01-11",
    isAnswered: false,
    category: "community",
    priority: "high",
    isPrivate: false,
  },
  {
    id: "6",
    title: "Mission Trip Safety",
    description:
      "Praying for safety and success for our upcoming mission trip to Guatemala next month.",
    requester: "Mission Team",
    date: "2024-01-10",
    isAnswered: false,
    category: "community",
    priority: "urgent",
    isPrivate: false,
  },
  {
    id: "7",
    title: "Financial Provision",
    description:
      "Praying for God's provision during this challenging financial season for our family.",
    requester: "Anonymous",
    date: "2024-01-09",
    isAnswered: true,
    category: "work",
    priority: "high",
    isPrivate: true,
    answeredDate: "2024-01-18",
  },
  {
    id: "8",
    title: "Youth Ministry",
    description:
      "Praying for our youth group to grow in faith and for more young people to join our community.",
    requester: "Youth Leaders",
    date: "2024-01-08",
    isAnswered: false,
    category: "community",
    priority: "normal",
    isPrivate: false,
  },
];

// Prayer Request Card Component (currently unused but kept for future implementation)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        return "H";
      case "family":
        return "F";
      case "work":
        return "W";
      case "spiritual":
        return "S";
      case "community":
        return "C";
      default:
        return "O";
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
            <span
              className="category-badge"
              data-icon={getCategoryIcon(request.category)}
            >
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
        <Button
          variant="button-primary"
          buttonText="Submit Prayer Request"
          onClick={() => {}}
        />
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
    // January 2024 Events
    {
      id: "1",
      title: "Sunday Service",
      description: "Weekly worship service with Pastor John Smith",
      date: "2024-01-21",
      time: "11:30",
      location: "Main Sanctuary",
      speaker: "Pastor John Smith",
      category: "worship",
      color: "var(--color-primary)",
    },
    {
      id: "2",
      title: "Youth Group Meeting",
      description: "Youth group will meet for fellowship and Bible study",
      date: "2024-01-19",
      time: "19:00",
      location: "Youth Room",
      category: "youth",
      color: "var(--color-primary)",
    },
    {
      id: "3",
      title: "Prayer Meeting",
      description: "Weekly prayer meeting for church, community, and world",
      date: "2024-01-17",
      time: "18:30",
      location: "Prayer Room",
      category: "prayer",
      color: "var(--color-primary)",
    },
    {
      id: "4",
      title: "Bible Study",
      description: "Adult Bible study on the Book of Romans",
      date: "2024-01-18",
      time: "19:30",
      location: "Fellowship Hall",
      speaker: "Elder Mary Johnson",
      category: "study",
      color: "var(--color-success)",
    },
    {
      id: "5",
      title: "Men's Fellowship",
      description: "Men's breakfast and fellowship meeting",
      date: "2024-01-20",
      time: "08:00",
      location: "Church Kitchen",
      category: "fellowship",
      color: "var(--color-primary)",
    },
    {
      id: "6",
      title: "Women's Ministry",
      description: "Women's ministry meeting and craft session",
      date: "2024-01-22",
      time: "14:00",
      location: "Activity Room",
      category: "ministry",
      color: "var(--color-primary)",
    },
    {
      id: "7",
      title: "Children's Sunday School",
      description: "Sunday School for children ages 5-12",
      date: "2024-01-21",
      time: "10:00",
      location: "Children's Wing",
      category: "education",
      color: "var(--color-accent)",
    },
    {
      id: "8",
      title: "Board Meeting",
      description: "Monthly church board meeting",
      date: "2024-01-23",
      time: "19:00",
      location: "Pastor's Office",
      category: "administration",
      color: "var(--color-muted-gray)",
    },
    {
      id: "9",
      title: "Community Outreach",
      description: "Food bank volunteer day",
      date: "2024-01-24",
      time: "09:00",
      location: "Community Center",
      category: "outreach",
      color: "var(--color-success)",
    },
    {
      id: "10",
      title: "Choir Practice",
      description: "Weekly choir rehearsal",
      date: "2024-01-25",
      time: "19:30",
      location: "Sanctuary",
      category: "music",
      color: "var(--color-primary)",
    },
    {
      id: "11",
      title: "Mission Trip Planning",
      description: "Planning meeting for Guatemala mission trip",
      date: "2024-01-26",
      time: "18:00",
      location: "Conference Room",
      category: "missions",
      color: "var(--color-warning)",
    },
    {
      id: "12",
      title: "New Member Class",
      description: "Introduction class for new church members",
      date: "2024-01-27",
      time: "10:00",
      location: "Fellowship Hall",
      speaker: "Pastor John Smith",
      category: "education",
      color: "var(--color-success)",
    },
    {
      id: "13",
      title: "Sunday Service",
      description: "Weekly worship service with special guest speaker",
      date: "2024-01-28",
      time: "11:30",
      location: "Main Sanctuary",
      speaker: "Rev. Dr. Sarah Williams",
      category: "worship",
      color: "var(--color-primary)",
    },
    {
      id: "14",
      title: "Prayer Walk",
      description: "Community prayer walk around the neighborhood",
      date: "2024-01-29",
      time: "17:00",
      location: "Church Parking Lot",
      category: "prayer",
      color: "var(--color-primary)",
    },
    {
      id: "15",
      title: "Youth Game Night",
      description: "Fun games and activities for youth group",
      date: "2024-01-30",
      time: "19:00",
      location: "Youth Room",
      category: "youth",
      color: "var(--color-primary)",
    },
    // February 2024 Events
    {
      id: "16",
      title: "Ash Wednesday Service",
      description: "Ash Wednesday service marking the beginning of Lent",
      date: "2024-02-14",
      time: "19:00",
      location: "Main Sanctuary",
      speaker: "Pastor John Smith",
      category: "worship",
      color: "var(--color-primary)",
    },
    {
      id: "17",
      title: "Valentine's Day Fellowship",
      description: "Couples fellowship and dinner",
      date: "2024-02-14",
      time: "18:00",
      location: "Fellowship Hall",
      category: "fellowship",
      color: "var(--color-primary)",
    },
    {
      id: "18",
      title: "Mission Trip Departure",
      description: "Guatemala mission trip departure",
      date: "2024-02-15",
      time: "06:00",
      location: "Church Parking Lot",
      category: "missions",
      color: "var(--color-warning)",
    },
    {
      id: "19",
      title: "Lenten Study Series",
      description: "Weekly Lenten study on spiritual disciplines",
      date: "2024-02-16",
      time: "19:30",
      location: "Fellowship Hall",
      speaker: "Elder Mary Johnson",
      category: "study",
      color: "var(--color-success)",
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [prayerRequests] = useState<PrayerRequest[]>(MOCK_PRAYER_REQUESTS);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Prayer request handlers
  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginSuccess = (userData: any) => {
    console.log("User logged in:", userData);
    setIsLoggedIn(true);
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
          <div className="section-header">
            <h2>UPCOMING EVENTS & CALENDAR</h2>
            <p>
              Stay connected with our church community through our comprehensive
              event calendar
            </p>
          </div>
          <Calendar
            events={events}
            onDateClick={handleDateClick}
            onAddEvent={handleAddEvent}
          />
        </ScrollReveal>

        {/* Prayer Request Form Section */}
        <ScrollReveal className="prayer-form-section">
          <div className="section-header">
            <h2>SUBMIT A PRAYER REQUEST</h2>
            <p>Share your prayer needs with our caring church community</p>
          </div>
          <PrayerRequestForm onLoginClick={handleLoginClick} />
        </ScrollReveal>

        {/* Church Announcements Section */}
        <ScrollReveal className="announcements-section">
          <div className="section-header">
            <h2>CHURCH ANNOUNCEMENTS</h2>
            <p>Important updates and news from our church leadership</p>
          </div>
          <div className="announcements-grid">
            <div className="announcement-card">
              <div className="announcement-header">
                <h3>Mission Trip Fundraiser</h3>
                <span className="announcement-date">January 15, 2024</span>
              </div>
              <p>
                Join us for our annual bake sale to support our upcoming mission
                trip to Guatemala. All proceeds will help fund our community
                outreach efforts.
              </p>
              <div className="announcement-meta">
                <span className="announcement-category">Missions</span>
              </div>
            </div>
            <div className="announcement-card">
              <div className="announcement-header">
                <h3>New Member Welcome</h3>
                <span className="announcement-date">January 12, 2024</span>
              </div>
              <p>
                We're excited to welcome 5 new families to our church community
                this month. Please join us in making them feel at home.
              </p>
              <div className="announcement-meta">
                <span className="announcement-category">Community</span>
              </div>
            </div>
            <div className="announcement-card">
              <div className="announcement-header">
                <h3>Building Maintenance</h3>
                <span className="announcement-date">January 10, 2024</span>
              </div>
              <p>
                Our sanctuary will be closed for maintenance on February 1st.
                Services will be held in the fellowship hall that day.
              </p>
              <div className="announcement-meta">
                <span className="announcement-category">Facilities</span>
              </div>
            </div>
          </div>
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

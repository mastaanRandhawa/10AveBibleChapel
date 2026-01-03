import React, { useState } from "react";
import { ScrollReveal } from "../components/ScrollReveal";
import HeroSection from "../components/HeroSection";
import Calendar, { CalendarEvent } from "../components/Calendar";
import EventModal from "../components/EventModal";
import EventDetailsModal from "../components/EventDetailsModal";
import bulletinImage from "../assets/bulletin.jpg";
import "./Bulletin.css";

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
      <HeroSection
        title="BULLETIN"
        subtitle="CHURCH EVENTS & ANNOUNCEMENTS"
        description="Stay connected with our church community through upcoming events and important announcements"
        backgroundImage={`url(${bulletinImage})`}
        variant="centered"
      />

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
    </div>
  );
};

export default Bulletin;

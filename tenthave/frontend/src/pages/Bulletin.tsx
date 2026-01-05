import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ScrollReveal } from "../components/ScrollReveal";
import PageHero from "../components/PageHero";
import Calendar, { CalendarEvent } from "../components/Calendar";
import EventModal from "../components/EventModal";
import PageContainer from "../components/PageContainer";
import { announcementsAPI, calendarAPI, Announcement } from "../services/api";
import "./Bulletin.css";

// Main Bulletin Component
const Bulletin: React.FC = () => {
  // Calendar and event management state
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Old hardcoded events for fallback
  const [hardcodedEvents] = useState<CalendarEvent[]>([
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
  const [selectedDate, setSelectedDate] = useState("");
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Fetch calendar events
        const calendarData = await calendarAPI.getAll({
          status: "PUBLISHED",
          isPublic: "true",
        });
        // Transform API data to match CalendarEvent interface
        // FIX: Use date-fns format() to convert timestamps to date strings in LOCAL time
        // This prevents timezone offset issues where dates shift by one day
        const transformedEvents = calendarData.map((event) => ({
          id: event.id,
          title: event.title,
          description: event.description || "",
          date: format(new Date(event.startDate), "yyyy-MM-dd"),
          time: new Date(event.startDate).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          location: event.location || "",
          category: event.category || "general",
          color: event.color || "var(--color-primary)",
        }));
        setEvents(
          transformedEvents.length > 0 ? transformedEvents : hardcodedEvents
        );

        // Fetch announcements
        const announcementData = await announcementsAPI.getAll({
          status: "PUBLISHED",
          isPublic: "true",
        });
        setAnnouncements(announcementData);
      } catch (error) {
        console.error("Error loading bulletin data:", error);
        // Use hardcoded events as fallback
        setEvents(hardcodedEvents);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [hardcodedEvents]);

  // Calendar event handlers
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
    setIsEventModalOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
  };

  const handleCloseEventModal = () => {
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };

  return (
    <PageContainer>
      <div className="bulletin-page-wrapper">
        <PageHero
          eyebrow="CHURCH EVENTS & ANNOUNCEMENTS"
          title="BULLETIN"
          subtitle="Stay connected with our church community through upcoming events and important announcements"
        />

        <div className="bulletin-content">
          {/* Calendar Section */}
          <ScrollReveal className="bulletin-calendar-section">
            <div className="section-header">
              <h2>UPCOMING EVENTS & CALENDAR</h2>
              <p>
                Stay connected with our church community through our
                comprehensive event calendar
              </p>
            </div>
            <Calendar
              events={events}
              onAddEvent={handleAddEvent}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
              isAdmin={false}
            />
          </ScrollReveal>

          {/* Church Announcements Section */}
          <ScrollReveal className="announcements-section">
            <div className="section-header">
              <h2>CHURCH ANNOUNCEMENTS</h2>
              <p>Important updates and news from our church leadership</p>
            </div>
            {loading ? (
              <p style={{ textAlign: "center" }}>Loading announcements...</p>
            ) : announcements.length === 0 ? (
              <p style={{ textAlign: "center" }}>
                No announcements at this time.
              </p>
            ) : (
              <div className="announcements-grid">
                {announcements.slice(0, 6).map((announcement) => (
                  <div key={announcement.id} className="announcement-card">
                    <div className="announcement-header">
                      <h3>{announcement.title}</h3>
                      <span className="announcement-date">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p>{announcement.content}</p>
                    {announcement.category && (
                      <div className="announcement-meta">
                        <span className="announcement-category">
                          {announcement.category}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollReveal>
        </div>

        {/* Event Modal */}
        <EventModal
          isOpen={isEventModalOpen}
          onClose={handleCloseEventModal}
          onSave={handleSaveEvent}
          selectedDate={selectedDate}
          editingEvent={editingEvent}
        />
      </div>
    </PageContainer>
  );
};

export default Bulletin;

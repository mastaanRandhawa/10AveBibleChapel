import React, { useState } from "react";
import { ScrollReveal } from "../components/ScrollReveal";
import HeroSection from "../components/HeroSection";
import Calendar, { CalendarEvent } from "../components/Calendar";
import EventModal from "../components/EventModal";
import EventDetailsModal from "../components/EventDetailsModal";
import "./Bulletin.css";

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
      type: "event",
      priority: "high",
      location: "Main Sanctuary",
      speaker: "Pastor John Smith",
    },
    {
      id: "2",
      title: "Youth Group Meeting",
      description: "Youth group will meet for fellowship and Bible study",
      date: "2024-01-19",
      time: "19:00",
      type: "event",
      priority: "medium",
      location: "Youth Room",
    },
    {
      id: "3",
      title: "Prayer Meeting",
      description: "Weekly prayer meeting for church, community, and world",
      date: "2024-01-17",
      time: "18:30",
      type: "reminder",
      priority: "medium",
      location: "Prayer Room",
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
        title="Church Calendar"
        subtitle="WELCOME TO OUR CHURCH"
        description="View and manage church events and activities"
      />

      <div className="bulletin-content">
        {/* Calendar Section */}
        <ScrollReveal className="bulletin-calendar-section">
          <Calendar
            events={events}
            onDateClick={handleDateClick}
            onAddEvent={handleAddEvent}
          />
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

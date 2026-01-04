import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format, parse } from "date-fns";
import { EVENT_CATEGORIES } from "../constants";
import "./Calendar.css";

// Event interface
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD format
  time?: string; // HH:MM format
  location?: string;
  speaker?: string;
  category?: string; // Event category for color coding
  color?: string; // Custom color for the event
  completed?: boolean; // For task completion status
}

interface CalendarProps {
  events: CalendarEvent[];
  onDateClick?: (date: string, events: CalendarEvent[]) => void;
  onAddEvent: (date: string) => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
  isAdmin?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({
  events,
  onDateClick,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  isAdmin = false,
}) => {
  // FIX: Use date-fns format() to get today's date in LOCAL time, not UTC
  // This prevents timezone offset issues where "today" becomes "yesterday"
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const calendarRef = useRef<FullCalendar>(null);

  // Convert our events to FullCalendar format
  const fullCalendarEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    date: event.date,
    backgroundColor: event.color || "var(--color-primary)",
    borderColor: event.color || "var(--color-primary)",
    textColor: "#1a1a1a",
    extendedProps: {
      description: event.description,
      time: event.time,
      location: event.location,
      speaker: event.speaker,
      category: event.category,
      completed: event.completed,
    },
  }));

  // Get events for selected date
  const selectedDateEvents = events.filter(
    (event) => event.date === selectedDate
  );

  // Auto-select first event when date changes or events change
  useEffect(() => {
    if (selectedDateEvents.length > 0) {
      // If no event selected or selected event not in current date, select first
      const isSelectedEventInDate = selectedDateEvents.some(
        (e) => e.id === selectedEventId
      );
      if (!isSelectedEventInDate) {
        setSelectedEventId(selectedDateEvents[0].id);
      }
    } else {
      setSelectedEventId(null);
    }
  }, [selectedDate, selectedDateEvents, selectedEventId]);

  // Get selected event
  const selectedEvent = selectedEventId
    ? events.find((e) => e.id === selectedEventId)
    : null;

  // Handle date selection
  const handleDateClick = (dateClickInfo: any) => {
    const selectedDateStr = dateClickInfo.dateStr;
    setSelectedDate(selectedDateStr);
    // Auto-select will happen via useEffect
  };

  // Handle event click from calendar grid
  const handleEventClick = (clickInfo: any) => {
    const eventId = clickInfo.event.id;
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setSelectedDate(event.date);
      setSelectedEventId(eventId);
    }
  };

  // Handle event selection from list
  const handleSelectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  // Get current month/year from calendar
  const getCurrentMonthYear = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentDate = calendarApi.getDate();
      return {
        month: currentDate.toLocaleDateString("en-US", { month: "long" }),
        year: currentDate.getFullYear(),
      };
    }
    return {
      month: new Date().toLocaleDateString("en-US", { month: "long" }),
      year: new Date().getFullYear(),
    };
  };

  const { month, year } = getCurrentMonthYear();

  // Format time for display
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Format date for selected panel
  // FIX: Parse date-only strings (YYYY-MM-DD) as LOCAL dates using date-fns
  // new Date("2026-01-05") interprets as UTC midnight, which becomes previous day in timezones behind UTC
  // parse() treats the string as a local date, preventing timezone shift
  const formatSelectedDate = (dateStr: string) => {
    const date = parse(dateStr, "yyyy-MM-dd", new Date());
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return {
      dayName: dayNames[date.getDay()],
      dayNumber: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "long" }),
      year: date.getFullYear(),
    };
  };

  const {
    dayName,
    dayNumber,
    month: selectedMonth,
    year: selectedYear,
  } = formatSelectedDate(selectedDate);


  return (
    <div className="calendar-wrapper">
      {/* Calendar Header */}
      <div className="calendar-header">
        {isAdmin && (
          <button
            className="calendar-add-event-btn"
            onClick={() => onAddEvent(selectedDate)}
            aria-label="Add new event"
          >
            + Add Event
          </button>
        )}
      </div>

      {/* Calendar Content: Side Panel + Grid */}
      <div className="calendar-content">
        {/* Left: STABLE Selected Date Panel - NEVER changes layout */}
        <div className="calendar-side-panel">
          {/* A) HEADER - Always visible */}
          <div className="panel-header">
            <h2 className="panel-title">Selected Date</h2>
            <p className="panel-date">
              {dayName}, {selectedMonth} {dayNumber}, {selectedYear}
            </p>
            <p className="panel-count">
              {selectedDateEvents.length === 0
                ? "No events"
                : selectedDateEvents.length === 1
                ? "1 event"
                : `${selectedDateEvents.length} events`}
            </p>
          </div>

          {/* B) EVENTS LIST - Always visible when events exist */}
          {selectedDateEvents.length > 0 && (
            <div className="events-list">
              {selectedDateEvents.map((event) => (
                <button
                  key={event.id}
                  className={`event-row ${
                    selectedEventId === event.id ? "active" : ""
                  }`}
                  onClick={() => handleSelectEvent(event.id)}
                  aria-label={`View ${event.title}`}
                >
                  <div
                    className="event-indicator"
                    style={{
                      backgroundColor: event.color || "var(--color-primary)",
                    }}
                  />
                  <div className="event-info">
                    <div className="event-title">{event.title}</div>
                    <div className="event-meta">
                      {event.time && formatTime(event.time)}
                      {event.time && event.location && " • "}
                      {event.location}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No events message */}
          {selectedDateEvents.length === 0 && (
            <p className="no-events-text">No events scheduled for this date.</p>
          )}
        </div>

        {/* Right: Calendar Grid */}
        <div className="calendar-grid-panel">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev",
              center: "title",
              right: "next",
            }}
            dayMaxEvents={3}
            moreLinkClick="popover"
            events={fullCalendarEvents}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            height="auto"
            fixedWeekCount={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;

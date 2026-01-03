import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
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
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
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

  // Handle date selection
  const handleDateClick = (dateClickInfo: any) => {
    const selectedDateStr = dateClickInfo.dateStr;
    setSelectedDate(selectedDateStr);

    // Get events for the selected date
    const dayEvents = events.filter((event) => event.date === selectedDateStr);

    // Call onDateClick if provided
    if (onDateClick) {
      onDateClick(selectedDateStr, dayEvents);
    }
  };

  // Handle event click
  const handleEventClick = (clickInfo: any) => {
    const eventId = clickInfo.event.id;
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setSelectedDate(event.date);
      // Trigger date click to show event details
      const dayEvents = events.filter((e) => e.date === event.date);
      if (onDateClick) {
        onDateClick(event.date, dayEvents);
      }
    }
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
  const formatSelectedDate = (dateStr: string) => {
    const date = new Date(dateStr);
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
        {/* Left: Selected Date Panel (Light Card) */}
        <div className="calendar-side-panel">
          <div className="side-panel-header">
            <h2 className="side-panel-title">Selected Date</h2>
            <p className="side-panel-date">
              {dayName}, {selectedMonth} {dayNumber}, {selectedYear}
            </p>
          </div>

          <div className="side-panel-events">
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map((event) => (
                <div key={event.id} className="side-panel-event-card">
                  <div className="event-card-header">
                    <div
                      className="event-color-indicator"
                      style={{
                        backgroundColor: event.color || "var(--color-primary)",
                      }}
                    />
                    <h3 className="event-card-title">{event.title}</h3>
                  </div>
                  {event.time && (
                    <p className="event-card-time">
                      🕐 {formatTime(event.time)}
                    </p>
                  )}
                  {event.location && (
                    <p className="event-card-location">📍 {event.location}</p>
                  )}
                  {isAdmin && (onEditEvent || onDeleteEvent) && (
                    <div className="event-card-actions">
                      {onEditEvent && (
                        <button
                          className="event-action-btn edit"
                          onClick={() => onEditEvent(event)}
                          aria-label="Edit event"
                        >
                          Edit
                        </button>
                      )}
                      {onDeleteEvent && (
                        <button
                          className="event-action-btn delete"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this event?"
                              )
                            ) {
                              onDeleteEvent(event.id);
                            }
                          }}
                          aria-label="Delete event"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="side-panel-empty">
                <p>No events scheduled</p>
              </div>
            )}
          </div>
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

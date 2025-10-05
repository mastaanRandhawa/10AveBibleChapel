import React, { useState, useMemo } from "react";
import "./Calendar.css";

// Helper function to get contrasting text color
const getContrastColor = (hexColor: string): string => {
  // Remove # if present
  const hex = hexColor.replace("#", "");

  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

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
}

interface CalendarProps {
  events: CalendarEvent[];
  onDateClick: (date: string, events: CalendarEvent[]) => void;
  onAddEvent: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  events,
  onDateClick,
  onAddEvent,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      const dayEvents = events.filter((event) => event.date === dateString);
      days.push({
        day,
        date: dateString,
        events: dayEvents,
        isToday: dateString === new Date().toISOString().split("T")[0],
      });
    }

    return days;
  }, [currentMonth, currentYear, events, startingDayOfWeek, daysInMonth]);

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get month name
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="calendar-container">
      {/* Calendar Header */}
      <div className="calendar-header">
        <button
          className="calendar-nav-btn"
          onClick={goToPreviousMonth}
          aria-label="Previous month"
        >
          ←
        </button>

        <div className="calendar-title">
          <h2>
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <button className="calendar-today-btn" onClick={goToToday}>
            Today
          </button>
        </div>

        <button
          className="calendar-nav-btn"
          onClick={goToNextMonth}
          aria-label="Next month"
        >
          →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Day headers */}
        <div className="calendar-day-header">Sun</div>
        <div className="calendar-day-header">Mon</div>
        <div className="calendar-day-header">Tue</div>
        <div className="calendar-day-header">Wed</div>
        <div className="calendar-day-header">Thu</div>
        <div className="calendar-day-header">Fri</div>
        <div className="calendar-day-header">Sat</div>

        {/* Calendar days */}
        {calendarDays.map((day, index) => {
          if (!day) {
            return (
              <div
                key={index}
                className="calendar-day calendar-day--empty"
              ></div>
            );
          }

          return (
            <div
              key={index}
              className={`calendar-day ${
                day.isToday ? "calendar-day--today" : ""
              }`}
              onClick={() => onDateClick(day.date, day.events)}
            >
              <div className="calendar-day-number">{day.day}</div>

              {/* Event indicators */}
              {day.events.length > 0 && (
                <div className="calendar-events">
                  {day.events.slice(0, 2).map((event, eventIndex) => (
                    <div
                      key={event.id}
                      className="calendar-event-item"
                      style={{
                        backgroundColor: event.color || "#FBCB9C",
                        color: getContrastColor(event.color || "#FBCB9C"),
                      }}
                      title={`${event.title}${
                        event.time ? ` at ${event.time}` : ""
                      }${event.location ? ` - ${event.location}` : ""}`}
                    >
                      <span className="event-title-text">{event.title}</span>
                      {event.time && (
                        <span className="event-time-text">{event.time}</span>
                      )}
                    </div>
                  ))}
                  {day.events.length > 2 && (
                    <div
                      className="calendar-event-more"
                      title={`${day.events.length - 2} more events`}
                    >
                      +{day.events.length - 2}
                    </div>
                  )}
                </div>
              )}

              {/* Add event button */}
              <button
                className="calendar-add-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddEvent(day.date);
                }}
                title="Add event"
              >
                +
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;

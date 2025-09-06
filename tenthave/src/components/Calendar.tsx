import React, { useState, useMemo } from "react";
import "./Calendar.css";

// Event interface
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD format
  time?: string; // HH:MM format
  type: "announcement" | "event" | "reminder";
  priority: "high" | "medium" | "low";
  location?: string;
  speaker?: string;
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

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "announcement":
        return "📢";
      case "event":
        return "📅";
      case "reminder":
        return "⏰";
      default:
        return "📄";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "event-high";
      case "medium":
        return "event-medium";
      case "low":
        return "event-low";
      default:
        return "";
    }
  };

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
                  {day.events.slice(0, 3).map((event, eventIndex) => (
                    <div
                      key={event.id}
                      className={`calendar-event-indicator ${getPriorityColor(
                        event.priority
                      )}`}
                      title={`${getEventTypeIcon(event.type)} ${event.title}`}
                    >
                      {getEventTypeIcon(event.type)}
                    </div>
                  ))}
                  {day.events.length > 3 && (
                    <div className="calendar-event-more">
                      +{day.events.length - 3}
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

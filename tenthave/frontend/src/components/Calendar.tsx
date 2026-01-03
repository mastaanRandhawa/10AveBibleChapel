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
  onDateClick?: (date: string, events: CalendarEvent[]) => void; // Made optional since popup is removed
  onAddEvent: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  events,
  onDateClick,
  onAddEvent,
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

    // Call onDateClick if provided (though we're not using popup anymore)
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
    }
  };

  // Get day name
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const selectedDateObj = new Date(selectedDate);
  const selectedDayName = dayNames[selectedDateObj.getDay()];
  const selectedDayNumber = selectedDateObj.getDate();
  const selectedMonth = selectedDateObj.toLocaleDateString("en-US", {
    month: "long",
  });
  const selectedYear = selectedDateObj.getFullYear();

  return (
    <div className="calendar-split-container">
      {/* Left Panel - Selected Date */}
      <div className="calendar-left-panel">
        <div className="calendar-date-header">
          <div className="calendar-selected-date">
            <div className="calendar-date-text">
              {selectedDayName}, {selectedMonth} {selectedDayNumber},{" "}
              {selectedYear}
            </div>
          </div>
        </div>

        <div className="calendar-events-list">
          {selectedDateEvents.length > 0 ? (
            selectedDateEvents.map((event) => (
              <div key={event.id} className="calendar-event-item">
                <div className="event-status">
                  {event.completed ? (
                    <div className="event-status-completed">✓</div>
                  ) : (
                    <div className="event-status-pending">○</div>
                  )}
                </div>
                <div className="event-details">
                  <div className="event-title">{event.title}</div>
                  {event.time && <div className="event-time">{event.time}</div>}
                </div>
              </div>
            ))
          ) : (
            <div className="calendar-no-events">No events scheduled</div>
          )}
        </div>
      </div>

      {/* Right Panel - FullCalendar */}
      <div className="calendar-right-panel">
        <div className="calendar-fullcalendar-container">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev",
              center: "title",
              right: "next",
            }}
            dayMaxEvents={false}
            moreLinkClick="popover"
            events={fullCalendarEvents}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            height="auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;

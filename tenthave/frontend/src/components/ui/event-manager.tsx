import { useState, useCallback } from "react";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./event-manager.css";

export interface ChurchEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  /** From API only — used for calendar chip tint, not shown as an editable field */
  color: string;
  category?: string;
  location?: string;
}

export interface ChurchEventManagerProps {
  events?: ChurchEvent[];
  onEventCreate?: (event: Omit<ChurchEvent, "id">) => Promise<void> | void;
  onEventUpdate?: (id: string, event: Partial<ChurchEvent>) => Promise<void> | void;
  onEventDelete?: (id: string) => Promise<void> | void;
  isAdmin?: boolean;
  categories?: string[];
  defaultView?: "month" | "week" | "day" | "list";
  className?: string;
}

/** Maps API color tokens to display hex (calendar chips only — not user-editable) */
const EVENT_COLOR_HEX: Record<string, string> = {
  primary: "#475569",
  dark: "#1e293b",
  success: "#0d9488",
  warning: "#d97706",
  error: "#be123c",
  gray: "#78716c",
};

const DEFAULT_EVENT_COLOR_TOKEN = "primary";

export const CHURCH_CATEGORIES = [
  "Worship Service",
  "Prayer Meeting",
  "Bible Study",
  "Youth Group",
  "Fellowship",
  "Ministry",
  "Special Event",
  "Meeting",
];

export function ChurchEventManager({
  events: initialEvents = [],
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  isAdmin = false,
  categories = CHURCH_CATEGORIES,
  defaultView = "month",
  className,
}: ChurchEventManagerProps) {
  const [events, setEvents] = useState<ChurchEvent[]>(initialEvents);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day" | "list">(defaultView);
  const [selectedEvent, setSelectedEvent] = useState<ChurchEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<ChurchEvent>>({
    title: "",
    description: "",
    color: DEFAULT_EVENT_COLOR_TOKEN,
    category: categories[0],
  });

  // Sync external events prop with internal state
  React.useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  const getColorHex = useCallback((colorValue: string) => {
    if (!colorValue) return EVENT_COLOR_HEX[DEFAULT_EVENT_COLOR_TOKEN];
    const trimmed = colorValue.trim();
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(trimmed)) {
      return trimmed.length === 4
        ? `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`
        : trimmed;
    }
    return EVENT_COLOR_HEX[colorValue] ?? EVENT_COLOR_HEX[DEFAULT_EVENT_COLOR_TOKEN];
  }, []);

  const handleCreateEvent = useCallback(async () => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) return;
    const event: ChurchEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: newEvent.title,
      description: newEvent.description,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      color: DEFAULT_EVENT_COLOR_TOKEN,
      category: newEvent.category,
      location: newEvent.location,
    };
    setIsSaving(true);
    try {
      await onEventCreate?.(event);
      setEvents((prev) => [...prev, event]);
    } finally {
      setIsSaving(false);
    }
    closeDialog();
  }, [newEvent, onEventCreate]);

  const handleUpdateEvent = useCallback(async () => {
    if (!selectedEvent) return;
    setIsSaving(true);
    try {
      await onEventUpdate?.(selectedEvent.id, selectedEvent);
      setEvents((prev) => prev.map((e) => (e.id === selectedEvent.id ? selectedEvent : e)));
    } finally {
      setIsSaving(false);
    }
    closeDialog();
  }, [selectedEvent, onEventUpdate]);

  const handleDeleteEvent = useCallback(
    async (id: string) => {
      setIsSaving(true);
      try {
        await onEventDelete?.(id);
        setEvents((prev) => prev.filter((e) => e.id !== id));
      } finally {
        setIsSaving(false);
      }
      closeDialog();
    },
    [onEventDelete]
  );

  const closeDialog = () => {
    setIsDialogOpen(false);
    setIsCreating(false);
    setSelectedEvent(null);
    setNewEvent({
      title: "",
      description: "",
      color: DEFAULT_EVENT_COLOR_TOKEN,
      category: categories[0],
    });
  };

  const navigateDate = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (view === "month") d.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      else if (view === "week") d.setDate(prev.getDate() + (direction === "next" ? 7 : -7));
      else d.setDate(prev.getDate() + (direction === "next" ? 1 : -1));
      return d;
    });
  };

  const getHeaderTitle = () => {
    if (view === "month")
      return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    if (view === "week")
      return `Week of ${currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    if (view === "day")
      return currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    return "All Events";
  };

  const currentEventData = isCreating ? newEvent : selectedEvent;
  const setCurrentEventData = isCreating
    ? (updater: (prev: Partial<ChurchEvent>) => Partial<ChurchEvent>) =>
        setNewEvent((prev) => updater(prev))
    : (updater: (prev: Partial<ChurchEvent>) => Partial<ChurchEvent>) =>
        setSelectedEvent((prev) => (prev ? (updater(prev) as ChurchEvent) : null));

  return (
    <div className={`church-event-manager ${className || ""}`}>
      {/* Top Controls Bar */}
      <div className="cem-controls-bar">
        <div className="cem-nav-group">
          <h3 className="cem-view-title">{getHeaderTitle()}</h3>
          <div className="cem-date-nav" role="group" aria-label="Previous or next calendar period">
            <button
              type="button"
              className="cem-date-nav-btn cem-date-nav-btn-icon"
              onClick={() => navigateDate("prev")}
              aria-label="Previous period"
            >
              <ChevronLeft className="cem-date-nav-chevron" strokeWidth={2.25} aria-hidden />
            </button>
            <button
              type="button"
              className="cem-date-nav-btn cem-date-nav-btn-icon"
              onClick={() => navigateDate("next")}
              aria-label="Next period"
            >
              <ChevronRight className="cem-date-nav-chevron" strokeWidth={2.25} aria-hidden />
            </button>
          </div>
        </div>

        <div className="cem-view-actions">
          <div className="cem-view-switcher-wrap">
            <div className="cem-view-switcher" role="tablist" aria-label="Calendar view">
              {(["month", "week", "day", "list"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  role="tab"
                  aria-selected={view === v}
                  className={`cem-view-btn ${view === v ? "active" : ""}`}
                  onClick={() => setView(v)}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {isAdmin && (
            <button
              type="button"
              className="cem-add-btn"
              onClick={() => {
                setIsCreating(true);
                setIsDialogOpen(true);
              }}
            >
              + New Event
            </button>
          )}
        </div>
      </div>

      {/* Calendar Views */}
      {view === "month" && (
        <MonthView
          currentDate={currentDate}
          events={events}
          getColorHex={getColorHex}
          onEventClick={(ev) => {
            setSelectedEvent(ev);
            setIsCreating(false);
            setIsDialogOpen(true);
          }}
          onDayClick={
            isAdmin
              ? (date) => {
                  setIsCreating(true);
                  setNewEvent((prev) => ({
                    ...prev,
                    startTime: date,
                    endTime: new Date(date.getTime() + 3600000),
                  }));
                  setIsDialogOpen(true);
                }
              : undefined
          }
        />
      )}
      {view === "week" && (
        <WeekView
          currentDate={currentDate}
          events={events}
          getColorHex={getColorHex}
          onEventClick={(ev) => {
            setSelectedEvent(ev);
            setIsCreating(false);
            setIsDialogOpen(true);
          }}
        />
      )}
      {view === "day" && (
        <DayView
          currentDate={currentDate}
          events={events}
          getColorHex={getColorHex}
          onEventClick={(ev) => {
            setSelectedEvent(ev);
            setIsCreating(false);
            setIsDialogOpen(true);
          }}
        />
      )}
      {view === "list" && (
        <ListView
          events={events}
          getColorHex={getColorHex}
          onEventClick={(ev) => {
            setSelectedEvent(ev);
            setIsCreating(false);
            setIsDialogOpen(true);
          }}
        />
      )}

      {/* Event Dialog Modal */}
      {isDialogOpen && (
        <div className="cem-modal-overlay" onClick={closeDialog}>
          <div className="cem-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cem-modal-header">
              <h3>{isCreating ? "Add New Event" : isAdmin ? "Edit Event" : "Event Details"}</h3>
              <button className="cem-modal-close" onClick={closeDialog}>
                ×
              </button>
            </div>

            <div className="cem-modal-body">
              {/* Title */}
              <div className="cem-form-group">
                <label className="cem-form-label">Title *</label>
                {isAdmin ? (
                  <input
                    className="cem-form-input"
                    value={currentEventData?.title || ""}
                    onChange={(e) =>
                      setCurrentEventData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Event title"
                  />
                ) : (
                  <p className="cem-readonly-text">{selectedEvent?.title}</p>
                )}
              </div>

              {/* Description */}
              <div className="cem-form-group">
                <label className="cem-form-label">Description</label>
                {isAdmin ? (
                  <textarea
                    className="cem-form-textarea"
                    value={currentEventData?.description || ""}
                    onChange={(e) =>
                      setCurrentEventData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Event description"
                    rows={3}
                  />
                ) : (
                  <p className="cem-readonly-text">{selectedEvent?.description || "—"}</p>
                )}
              </div>

              {/* Start / End Time */}
              <div className="cem-form-row">
                <div className="cem-form-group">
                  <label className="cem-form-label">Start Time *</label>
                  {isAdmin ? (
                    <input
                      className="cem-form-input"
                      type="datetime-local"
                      value={
                        currentEventData?.startTime
                          ? toLocalDateTimeString(currentEventData.startTime)
                          : ""
                      }
                      onChange={(e) =>
                        setCurrentEventData((prev) => ({
                          ...prev,
                          startTime: new Date(e.target.value),
                        }))
                      }
                    />
                  ) : (
                    <p className="cem-readonly-text">
                      {selectedEvent?.startTime
                        ? formatEventDateTime(selectedEvent.startTime)
                        : "—"}
                    </p>
                  )}
                </div>
                <div className="cem-form-group">
                  <label className="cem-form-label">End Time *</label>
                  {isAdmin ? (
                    <input
                      className="cem-form-input"
                      type="datetime-local"
                      value={
                        currentEventData?.endTime
                          ? toLocalDateTimeString(currentEventData.endTime)
                          : ""
                      }
                      onChange={(e) =>
                        setCurrentEventData((prev) => ({
                          ...prev,
                          endTime: new Date(e.target.value),
                        }))
                      }
                    />
                  ) : (
                    <p className="cem-readonly-text">
                      {selectedEvent?.endTime ? formatEventDateTime(selectedEvent.endTime) : "—"}
                    </p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="cem-form-group">
                <label className="cem-form-label">Location</label>
                {isAdmin ? (
                  <input
                    className="cem-form-input"
                    value={currentEventData?.location || ""}
                    onChange={(e) =>
                      setCurrentEventData((prev) => ({ ...prev, location: e.target.value }))
                    }
                    placeholder="Event location"
                  />
                ) : (
                  <p className="cem-readonly-text">{selectedEvent?.location || "—"}</p>
                )}
              </div>

              {/* Category (stored in database) */}
              <div className="cem-form-group">
                <label className="cem-form-label">Category</label>
                {isAdmin ? (
                  <select
                    className="cem-form-select"
                    value={currentEventData?.category || ""}
                    onChange={(e) =>
                      setCurrentEventData((prev) => ({ ...prev, category: e.target.value }))
                    }
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="cem-readonly-text">{selectedEvent?.category || "—"}</p>
                )}
              </div>
            </div>

            <div className="cem-modal-footer">
              {isAdmin && !isCreating && (
                <button
                  className="cem-btn cem-btn-danger"
                  onClick={() => selectedEvent && handleDeleteEvent(selectedEvent.id)}
                  disabled={isSaving}
                >
                  Delete
                </button>
              )}
              <button className="cem-btn cem-btn-secondary" onClick={closeDialog} disabled={isSaving}>
                {isAdmin ? "Cancel" : "Close"}
              </button>
              {isAdmin && (
                <button
                  className="cem-btn cem-btn-primary"
                  onClick={isCreating ? handleCreateEvent : handleUpdateEvent}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : isCreating ? "Add Event" : "Save Changes"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toLocalDateTimeString(date: Date): string {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function formatEventDateTime(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function sameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

/** Month grid uses a top “day panel” on narrow viewports instead of cramped in-cell titles */
function useNarrowMonthDayPanel(): boolean {
  const [narrow, setNarrow] = React.useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 767.98px)").matches : false
  );
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 767.98px)");
    const onChange = () => setNarrow(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return narrow;
}

/** WCAG-style relative luminance for readable label text on event chips */
function contrastingTextOnHex(hex: string): string {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return "#0f172a";
  const r = parseInt(m[1], 16) / 255;
  const g = parseInt(m[2], 16) / 255;
  const b = parseInt(m[3], 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.55 ? "#0f172a" : "#f8fafc";
}

// ─── Month View ───────────────────────────────────────────────────────────────

function MonthView({
  currentDate,
  events,
  getColorHex,
  onEventClick,
  onDayClick,
}: {
  currentDate: Date;
  events: ChurchEvent[];
  getColorHex: (color: string) => string;
  onEventClick: (event: ChurchEvent) => void;
  onDayClick?: (date: Date) => void;
}) {
  const narrowDayPanel = useNarrowMonthDayPanel();
  const [selectedDay, setSelectedDay] = React.useState<Date | null>(null);
  const dayPanelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setSelectedDay(null);
  }, [currentDate.getFullYear(), currentDate.getMonth()]);

  React.useEffect(() => {
    if (narrowDayPanel && selectedDay && dayPanelRef.current) {
      dayPanelRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [narrowDayPanel, selectedDay]);

  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const days: Date[] = [];
  const cur = new Date(startDate);
  for (let i = 0; i < 42; i++) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }

  const getEventsForDay = (date: Date) =>
    events.filter((e) => {
      const d = new Date(e.startTime);
      return (
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
      );
    });

  const selectedDayEvents = selectedDay
    ? [...getEventsForDay(selectedDay)].sort(
        (a, b) => a.startTime.getTime() - b.startTime.getTime()
      )
    : [];

  const handleMonthCellClick = (day: Date, dayEvents: ChurchEvent[]) => {
    if (narrowDayPanel) {
      if (dayEvents.length === 0) {
        if (onDayClick) {
          onDayClick(day);
          return;
        }
        setSelectedDay(day);
        return;
      }
      setSelectedDay(day);
      return;
    }
    if (onDayClick) onDayClick(day);
  };

  const cellCursor = narrowDayPanel || onDayClick ? "pointer" : "default";

  return (
    <div className="cem-month-view">
      {narrowDayPanel && selectedDay && (
        <div
          ref={dayPanelRef}
          className="cem-month-day-panel"
          role="region"
          aria-label={`Events on ${selectedDay.toLocaleDateString("en-US", { month: "long", day: "numeric" })}`}
        >
          <div className="cem-month-day-panel-top">
            <div>
              <div className="cem-month-day-panel-label">Selected day</div>
              <div className="cem-month-day-panel-date">
                {selectedDay.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
            <button
              type="button"
              className="cem-month-day-panel-close"
              onClick={() => setSelectedDay(null)}
              aria-label="Close day details"
            >
              ×
            </button>
          </div>
          {selectedDayEvents.length === 0 ? (
            <p className="cem-month-day-panel-empty">No events scheduled on this day.</p>
          ) : (
            <ul className="cem-month-day-panel-list" role="list">
              {selectedDayEvents.map((ev) => {
                const bg = getColorHex(ev.color);
                return (
                  <li key={ev.id}>
                    <button
                      type="button"
                      className="cem-month-day-panel-event"
                      onClick={() => onEventClick(ev)}
                    >
                      <span
                        className="cem-month-day-panel-event-bar"
                        style={{ backgroundColor: bg }}
                        aria-hidden
                      />
                      <span className="cem-month-day-panel-event-body">
                        <span className="cem-month-day-panel-event-title">{ev.title}</span>
                        <span className="cem-month-day-panel-event-time">
                          {formatTime(ev.startTime)}
                          {ev.location ? ` · ${ev.location}` : ""}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {onDayClick && (
            <button
              type="button"
              className="cem-month-day-panel-add"
              onClick={() => onDayClick(selectedDay)}
            >
              + Add event on this day
            </button>
          )}
        </div>
      )}

      <div className="cem-month-header">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="cem-month-day-name">
            <span className="cem-day-name-long">{d}</span>
            <span className="cem-day-name-short">{d.charAt(0)}</span>
          </div>
        ))}
      </div>
      <div className="cem-month-grid">
        {days.map((day, i) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();
          const isSelected =
            narrowDayPanel && selectedDay !== null && sameCalendarDay(selectedDay, day);
          return (
            <div
              key={i}
              className={`cem-month-cell ${!isCurrentMonth ? "other-month" : ""} ${isToday ? "today" : ""} ${isSelected ? "selected-day" : ""}`}
              onClick={() => handleMonthCellClick(day, dayEvents)}
              style={{ cursor: cellCursor }}
            >
              <span className={`cem-month-day-num ${isToday ? "today-num" : ""}`}>
                {day.getDate()}
              </span>
              <div className="cem-month-events">
                {narrowDayPanel ? (
                  dayEvents.length > 0 && (
                    <div className="cem-month-cell-indicators" aria-hidden="true">
                      {dayEvents.slice(0, 4).map((ev) => (
                        <span
                          key={ev.id}
                          className="cem-month-dot"
                          style={{ backgroundColor: getColorHex(ev.color) }}
                        />
                      ))}
                      {dayEvents.length > 4 && (
                        <span className="cem-month-dot cem-month-dot-more" title={`${dayEvents.length - 4} more`}>
                          +
                        </span>
                      )}
                    </div>
                  )
                ) : (
                  <>
                    {dayEvents.slice(0, 3).map((ev) => {
                      const bg = getColorHex(ev.color);
                      return (
                        <button
                          key={ev.id}
                          className="cem-month-event"
                          style={{ backgroundColor: bg, color: contrastingTextOnHex(bg) }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick(ev);
                          }}
                          title={ev.title}
                        >
                          {ev.title}
                        </button>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <span className="cem-month-more">+{dayEvents.length - 3} more</span>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Week View ────────────────────────────────────────────────────────────────

function WeekView({
  currentDate,
  events,
  getColorHex,
  onEventClick,
}: {
  currentDate: Date;
  events: ChurchEvent[];
  getColorHex: (color: string) => string;
  onEventClick: (event: ChurchEvent) => void;
}) {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDayHour = (date: Date, hour: number) =>
    events.filter((ev) => {
      const d = new Date(ev.startTime);
      return (
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear() &&
        d.getHours() === hour
      );
    });

  return (
    <div className="cem-week-view">
      <div className="cem-week-header">
        <div className="cem-week-time-col" />
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className={`cem-week-day-header ${day.toDateString() === new Date().toDateString() ? "today" : ""}`}
          >
            <span className="cem-week-day-name">
              {day.toLocaleDateString("en-US", { weekday: "short" })}
            </span>
            <span className="cem-week-day-num">
              {day.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>
        ))}
      </div>
      <div className="cem-week-body">
        {hours.map((hour) => (
          <div key={hour} className="cem-week-row">
            <div className="cem-week-time">{`${String(hour).padStart(2, "0")}:00`}</div>
            {weekDays.map((day) => {
              const dayHourEvents = getEventsForDayHour(day, hour);
              return (
                <div key={`${day.toISOString()}-${hour}`} className="cem-week-cell">
                  {dayHourEvents.map((ev) => {
                    const bg = getColorHex(ev.color);
                    return (
                    <button
                      key={ev.id}
                      className="cem-week-event"
                      style={{ backgroundColor: bg, color: contrastingTextOnHex(bg) }}
                      onClick={() => onEventClick(ev)}
                      title={ev.title}
                    >
                      {ev.title}
                    </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Day View ─────────────────────────────────────────────────────────────────

function DayView({
  currentDate,
  events,
  getColorHex,
  onEventClick,
}: {
  currentDate: Date;
  events: ChurchEvent[];
  getColorHex: (color: string) => string;
  onEventClick: (event: ChurchEvent) => void;
}) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForHour = (hour: number) =>
    events.filter((ev) => {
      const d = new Date(ev.startTime);
      return (
        d.getDate() === currentDate.getDate() &&
        d.getMonth() === currentDate.getMonth() &&
        d.getFullYear() === currentDate.getFullYear() &&
        d.getHours() === hour
      );
    });

  return (
    <div className="cem-day-view">
      {hours.map((hour) => {
        const hourEvents = getEventsForHour(hour);
        return (
          <div key={hour} className="cem-day-row">
            <div className="cem-day-time">{`${String(hour).padStart(2, "0")}:00`}</div>
            <div className="cem-day-cell">
              {hourEvents.map((ev) => {
                const bg = getColorHex(ev.color);
                return (
                <button
                  key={ev.id}
                  className="cem-day-event"
                  style={{ backgroundColor: bg, color: contrastingTextOnHex(bg) }}
                  onClick={() => onEventClick(ev)}
                >
                  <span className="cem-day-event-title">{ev.title}</span>
                  {ev.description && (
                    <span className="cem-day-event-desc">{ev.description}</span>
                  )}
                  <span className="cem-day-event-time">
                    {formatTime(ev.startTime)} – {formatTime(ev.endTime)}
                  </span>
                </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── List View ────────────────────────────────────────────────────────────────

function ListView({
  events,
  getColorHex,
  onEventClick,
}: {
  events: ChurchEvent[];
  getColorHex: (color: string) => string;
  onEventClick: (event: ChurchEvent) => void;
}) {
  const sorted = [...events].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  const grouped: Record<string, ChurchEvent[]> = {};
  sorted.forEach((ev) => {
    const key = ev.startTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(ev);
  });

  if (sorted.length === 0) {
    return (
      <div className="cem-list-empty">
        <p>No events found.</p>
      </div>
    );
  }

  return (
    <div className="cem-list-view">
      {Object.entries(grouped).map(([date, dateEvents]) => (
        <div key={date} className="cem-list-group">
          <h4 className="cem-list-date">{date}</h4>
          <div className="cem-list-events">
            {dateEvents.map((ev) => (
              <button
                key={ev.id}
                className="cem-list-event"
                onClick={() => onEventClick(ev)}
              >
                <div
                  className="cem-list-color-bar"
                  style={{ backgroundColor: getColorHex(ev.color) }}
                />
                <div className="cem-list-content">
                  <div className="cem-list-event-header">
                    <span className="cem-list-event-title">{ev.title}</span>
                    {ev.category && (
                      <span className="cem-list-category">{ev.category}</span>
                    )}
                  </div>
                  {ev.description && (
                    <p className="cem-list-desc">{ev.description}</p>
                  )}
                  <div className="cem-list-meta">
                    <span>
                      🕐 {formatTime(ev.startTime)} – {formatTime(ev.endTime)}
                    </span>
                    {ev.location && <span>📍 {ev.location}</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

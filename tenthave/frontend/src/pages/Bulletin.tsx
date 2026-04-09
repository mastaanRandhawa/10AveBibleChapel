import React, { useState, useEffect, useCallback } from "react";
import { ScrollReveal } from "../components/ScrollReveal";
import PageHero from "../components/PageHero";
import PageContainer from "../components/PageContainer";
import {
  ChurchEventManager,
  ChurchEvent,
  CHURCH_CATEGORIES,
} from "../components/ui/event-manager";
import { announcementsAPI, calendarAPI, Announcement, CalendarEvent } from "../services/api";
import { useAuth } from "../context/AuthContext";
import useSEO from "../hooks/useSEO";
import "./Bulletin.css";

// ─── Helper: map API CalendarEvent → ChurchEvent ──────────────────────────────

function apiEventToChurchEvent(event: CalendarEvent): ChurchEvent {
  const start = new Date(event.startDate);
  const end = event.endDate ? new Date(event.endDate) : new Date(start.getTime() + 3600000);
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    startTime: start,
    endTime: end,
    color: apiColorToChurchColor(event.color),
    category: event.category || undefined,
    location: event.location || undefined,
  };
}

function apiColorToChurchColor(color?: string | null): string {
  if (!color) return "primary";
  const c = color.trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c)) return c;
  // If already a church color value, return as is
  const churchColors = ["primary", "dark", "success", "warning", "error", "gray"];
  if (churchColors.includes(color)) return color;
  // Map CSS variable names to church color tokens
  if (color.includes("primary")) return "primary";
  if (color.includes("success")) return "success";
  if (color.includes("warning")) return "warning";
  if (color.includes("error")) return "error";
  if (color.includes("muted-gray")) return "gray";
  return "primary";
}

function churchColorToCssVar(value: string): string {
  const map: Record<string, string> = {
    primary: "var(--cem-event-primary)",
    dark: "var(--color-dark)",
    success: "var(--color-success)",
    warning: "var(--color-warning)",
    error: "var(--color-error)",
    gray: "var(--color-muted-gray)",
  };
  return map[value] || "var(--cem-event-primary)";
}

// ─── Main Bulletin Component ──────────────────────────────────────────────────

const Bulletin: React.FC = () => {
  useSEO({
    title: "Bulletin & Events",
    description:
      "Stay up to date with announcements, upcoming events, and the church calendar at Tenth Avenue Bible Chapel in Burnaby, BC.",
    canonical: "https://www.tenthavechapel.com/bulletin",
  });

  const { isAdmin } = useAuth();

  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);

  // ─── Load data from API ───────────────────────────────────────────────

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setEventsError(null);

      // Fetch calendar events
      const calendarData = await calendarAPI.getAll(
        isAdmin ? undefined : { status: "PUBLISHED", isPublic: "true" }
      );
      setEvents(calendarData.map(apiEventToChurchEvent));

      // Fetch announcements
      const announcementData = await announcementsAPI.getAll(
        isAdmin ? undefined : { status: "PUBLISHED", isPublic: "true" }
      );
      setAnnouncements(announcementData);
    } catch (error) {
      console.error("Error loading bulletin data:", error);
      setEventsError("Failed to load calendar data.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Admin event handlers (wired to real API) ─────────────────────────

  const handleEventCreate = async (event: Omit<ChurchEvent, "id">) => {
    const payload = {
      title: event.title,
      description: event.description,
      startDate: event.startTime.toISOString(),
      endDate: event.endTime.toISOString(),
      isAllDay: false,
      category: event.category,
      color: churchColorToCssVar(event.color),
      location: event.location,
      status: "PUBLISHED",
      isPublic: true,
    };
    try {
      const created = await calendarAPI.create(payload);
      setEvents((prev) => [...prev, apiEventToChurchEvent(created)]);
    } catch (err) {
      console.error("Failed to create event:", err);
      throw err;
    }
  };

  const handleEventUpdate = async (id: string, updated: Partial<ChurchEvent>) => {
    const payload: Partial<CalendarEvent> = {};
    if (updated.title) payload.title = updated.title;
    if (updated.description !== undefined) payload.description = updated.description;
    if (updated.startTime) payload.startDate = updated.startTime.toISOString();
    if (updated.endTime) payload.endDate = updated.endTime.toISOString();
    if (updated.category) payload.category = updated.category;
    if (updated.location !== undefined) payload.location = updated.location;
    try {
      const result = await calendarAPI.update(id, payload);
      setEvents((prev) => prev.map((e) => (e.id === id ? apiEventToChurchEvent(result) : e)));
    } catch (err) {
      console.error("Failed to update event:", err);
      throw err;
    }
  };

  const handleEventDelete = async (id: string) => {
    try {
      await calendarAPI.delete(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Failed to delete event:", err);
      throw err;
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────

  return (
    <PageContainer>
      <div className="bulletin-page-wrapper">
        <PageHero
          eyebrow="CHURCH EVENTS & ANNOUNCEMENTS"
          title="BULLETIN"
          subtitle="Stay connected with our church community through upcoming events and important announcements"
        />

        <div className="bulletin-content">
          {/* Calendar / Event Manager Section */}
          <ScrollReveal className="bulletin-calendar-section">
            <div className="section-header">
              <h2>UPCOMING EVENTS & CALENDAR</h2>
              <p>
                Stay connected with our church community through our comprehensive event calendar
                {isAdmin && (
                  <span className="bulletin-admin-badge"> — Admin Mode</span>
                )}
              </p>
            </div>

            {loading ? (
              <div className="bulletin-loading">
                <div className="bulletin-loading-spinner" />
                <p>Loading calendar events...</p>
              </div>
            ) : eventsError ? (
              <div className="bulletin-error">
                <p>{eventsError}</p>
                <button className="bulletin-retry-btn" onClick={loadData}>
                  Retry
                </button>
              </div>
            ) : (
              <ChurchEventManager
                events={events}
                isAdmin={isAdmin}
                onEventCreate={isAdmin ? handleEventCreate : undefined}
                onEventUpdate={isAdmin ? handleEventUpdate : undefined}
                onEventDelete={isAdmin ? handleEventDelete : undefined}
                categories={CHURCH_CATEGORIES}
              />
            )}
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
              <p style={{ textAlign: "center" }}>No announcements at this time.</p>
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
                        <span className="announcement-category">{announcement.category}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollReveal>
        </div>
      </div>
    </PageContainer>
  );
};

export default Bulletin;

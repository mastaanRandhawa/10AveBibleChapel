import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import LoadingSpinner from "../components/LoadingSpinner";
import PageContainer from "../components/PageContainer";
import { SkeletonTable } from "../components/SkeletonLoader";
import {
  announcementsAPI,
  calendarAPI,
  sermonsAPI,
  prayerRequestsAPI,
  usersAPI,
  Announcement,
  CalendarEvent,
  Sermon,
  PrayerRequest,
  User,
} from "../services/api";
import { getUserFriendlyErrorMessage } from "../services/apiErrorHandler";
import "./Members.css";
import "./AdminDashboard.css";

const Members: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isAdmin,
    isMember,
    isLoading: authLoading,
  } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "announcements" | "calendar" | "sermons" | "prayers" | "users"
  >("prayers");

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.showInfo("Please log in to access the members area");
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate, toast]);

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <PageContainer>
    <div className="members-page-wrapper">
      <HeroSection
        title={isAdmin ? "ADMIN DASHBOARD" : "MEMBERS AREA"}
        subtitle={user?.name || ""}
        variant="simple"
      />

      <div className="members-content">
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === "prayers" ? "active" : ""}`}
            onClick={() => setActiveTab("prayers")}
          >
            Prayer Requests
          </button>
          {isAdmin && (
            <>
              <button
                className={`tab-button ${
                  activeTab === "announcements" ? "active" : ""
                }`}
                onClick={() => setActiveTab("announcements")}
              >
                Announcements
              </button>
              <button
                className={`tab-button ${
                  activeTab === "calendar" ? "active" : ""
                }`}
                onClick={() => setActiveTab("calendar")}
              >
                Calendar
              </button>
              <button
                className={`tab-button ${
                  activeTab === "sermons" ? "active" : ""
                }`}
                onClick={() => setActiveTab("sermons")}
              >
                Sermons
              </button>
              <button
                className={`tab-button ${
                  activeTab === "users" ? "active" : ""
                }`}
                onClick={() => setActiveTab("users")}
              >
                Users
              </button>
            </>
          )}
        </div>

        <div className="dashboard-content">
          {activeTab === "prayers" && <PrayerRequestsTab />}
          {activeTab === "announcements" && isAdmin && <AnnouncementsTab />}
          {activeTab === "calendar" && isAdmin && <CalendarTab />}
          {activeTab === "sermons" && isAdmin && <SermonsTab />}
          {activeTab === "users" && isAdmin && <UsersTab />}
        </div>
      </div>
    </div>
    </PageContainer>
  );
};

// Prayer Requests Tab
const PrayerRequestsTab: React.FC = () => {
  const { isAdmin } = useAuth();
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [filteredPrayers, setFilteredPrayers] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    loadPrayers();
  }, []);

  useEffect(() => {
    filterPrayers();
  }, [prayers, searchQuery, statusFilter, categoryFilter]);

  const loadPrayers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await prayerRequestsAPI.getAll({ status: "APPROVED" });
      setPrayers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterPrayers = () => {
    let filtered = [...prayers];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    setFilteredPrayers(filtered);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    if (!window.confirm(`Mark this prayer request as ${status}?`)) return;
    try {
      await prayerRequestsAPI.update(id, { status });
      loadPrayers();
    } catch (err: any) {
      alert("Failed to update prayer request: " + err.message);
    }
  };

  const getUniqueCategoriesFromPrayers = () => {
    const categories = prayers.map((p) => p.category).filter(Boolean);
    return Array.from(new Set(categories));
  };

  if (loading) {
    return (
      <div className="tab-content">
        <div className="skeleton-loader">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-line"></div>
              <div className="skeleton-line medium"></div>
              <div className="skeleton-line short"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tab-content">
        <div className="error-state">
          <h3>⚠️ Error Loading Prayer Requests</h3>
          <p>{error}</p>
          <button className="btn-primary" onClick={loadPrayers}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <div>
          <h2>Prayer Requests</h2>
          <p className="tab-header-description">
            View and manage prayer requests from the community
          </p>
        </div>
      </div>

      {prayers.length > 0 && (
        <div className="admin-filters">
          <input
            type="text"
            className="admin-search"
            placeholder="Search prayer requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="admin-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="ANSWERED">Answered</option>
          </select>
          <select
            className="admin-filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {getUniqueCategoriesFromPrayers().map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )}

      {prayers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🙏</div>
          <h3>No Prayer Requests Yet</h3>
          <p>
            Prayer requests will appear here once members submit them through
            the prayer page.
          </p>
        </div>
      ) : filteredPrayers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No Matching Prayer Requests</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="items-grid">
          {filteredPrayers.map((prayer) => (
            <div key={prayer.id} className="prayer-card">
              <h3>{prayer.title}</h3>
              <p>{prayer.description}</p>
              <div className="prayer-meta">
                <span className={`status-badge status-${prayer.status.toLowerCase()}`}>
                  {prayer.status}
                </span>
                <span className={`priority-badge priority-${prayer.priority.toLowerCase()}`}>
                  {prayer.priority}
                </span>
                <span>{prayer.category}</span>
                {prayer.requester && <span>By: {prayer.requester}</span>}
                <span>{new Date(prayer.createdAt).toLocaleDateString()}</span>
              </div>
              {isAdmin && (
                <div className="prayer-actions">
                  {prayer.status !== "ANSWERED" && (
                    <button
                      className="btn-success"
                      onClick={() => handleUpdateStatus(prayer.id, "ANSWERED")}
                    >
                      Mark Answered
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Announcements Tab
const AnnouncementsTab: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<
    Announcement[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadAnnouncements();
  }, []);

  useEffect(() => {
    filterAnnouncements();
  }, [announcements, searchQuery, statusFilter]);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await announcementsAPI.getAll();
      setAnnouncements(data);
    } finally {
      setLoading(false);
    }
  };

  const filterAnnouncements = () => {
    let filtered = [...announcements];

    if (searchQuery) {
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    setFilteredAnnouncements(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;
    try {
      await announcementsAPI.delete(id);
      loadAnnouncements();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="tab-content">
        <div className="skeleton-loader">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-line"></div>
              <div className="skeleton-line medium"></div>
              <div className="skeleton-line short"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <div>
          <h2>Announcements</h2>
          <p className="tab-header-description">
            Create and manage church announcements
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setShowForm(true);
            setEditingItem(null);
          }}
        >
          + Add Announcement
        </button>
      </div>

      {showForm && (
        <AnnouncementForm
          item={editingItem}
          onSave={() => {
            setShowForm(false);
            setEditingItem(null);
            loadAnnouncements();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}

      {announcements.length > 0 && !showForm && (
        <div className="admin-filters">
          <input
            type="text"
            className="admin-search"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="admin-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      )}

      {announcements.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📢</div>
          <h3>No Announcements Yet</h3>
          <p>Create your first announcement to share updates with your church community.</p>
          <button
            className="btn-primary"
            onClick={() => {
              setShowForm(true);
              setEditingItem(null);
            }}
          >
            Create First Announcement
          </button>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No Matching Announcements</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Visibility</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnnouncements.map((item) => (
                  <tr key={item.id}>
                    <td className="table-cell-title">
                      {item.pinned && <span style={{ marginRight: "0.5rem" }}>📌</span>}
                      {item.title}
                    </td>
                    <td>{item.category || "—"}</td>
                    <td>
                      <span
                        className={`status-badge status-${item.status.toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>{item.isPublic ? "Public" : "Members Only"}</td>
                    <td className="table-cell-date">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn-secondary"
                          onClick={() => {
                            setEditingItem(item);
                            setShowForm(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="items-list">
            {filteredAnnouncements.map((item) => (
              <div key={item.id} className="item-card">
                <h3>
                  {item.pinned && <span style={{ marginRight: "0.5rem" }}>📌</span>}
                  {item.title}
                </h3>
                <p>{item.content}</p>
                <div className="item-meta">
                  <span
                    className={`status-badge status-${item.status.toLowerCase()}`}
                  >
                    {item.status}
                  </span>
                  {item.category && <span>{item.category}</span>}
                  <span>{item.isPublic ? "Public" : "Members Only"}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="item-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setEditingItem(item);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Calendar Tab
const CalendarTab: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<CalendarEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchQuery, statusFilter]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await calendarAPI.getAll();
      setEvents(data);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    if (searchQuery) {
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (e.description &&
            e.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (e.location &&
            e.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((e) => e.status === statusFilter);
    }

    setFilteredEvents(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await calendarAPI.delete(id);
      loadEvents();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="tab-content">
        <div className="skeleton-loader">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-line"></div>
              <div className="skeleton-line medium"></div>
              <div className="skeleton-line short"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <div>
          <h2>Calendar Events</h2>
          <p className="tab-header-description">
            Manage church events and activities
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setShowForm(true);
            setEditingItem(null);
          }}
        >
          + Add Event
        </button>
      </div>

      {showForm && (
        <CalendarForm
          item={editingItem}
          onSave={() => {
            setShowForm(false);
            setEditingItem(null);
            loadEvents();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}

      {events.length > 0 && !showForm && (
        <div className="admin-filters">
          <input
            type="text"
            className="admin-search"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="admin-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      )}

      {events.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <h3>No Events Yet</h3>
          <p>
            Create your first event to keep your community informed about
            upcoming activities.
          </p>
          <button
            className="btn-primary"
            onClick={() => {
              setShowForm(true);
              setEditingItem(null);
            }}
          >
            Create First Event
          </button>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No Matching Events</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date & Time</th>
                  <th>Location</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((item) => (
                  <tr key={item.id}>
                    <td className="table-cell-title">{item.title}</td>
                    <td className="table-cell-date">
                      {new Date(item.startDate).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>{item.location || "—"}</td>
                    <td>{item.category || "—"}</td>
                    <td>
                      <span
                        className={`status-badge status-${item.status.toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn-secondary"
                          onClick={() => {
                            setEditingItem(item);
                            setShowForm(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="items-list">
            {filteredEvents.map((item) => (
              <div key={item.id} className="item-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="item-meta">
                  <span
                    className={`status-badge status-${item.status.toLowerCase()}`}
                  >
                    {item.status}
                  </span>
                  <span>
                    {new Date(item.startDate).toLocaleDateString()}
                  </span>
                  {item.category && <span>{item.category}</span>}
                  {item.location && <span>📍 {item.location}</span>}
                </div>
                <div className="item-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setEditingItem(item);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Sermons Tab
const SermonsTab: React.FC = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [filteredSermons, setFilteredSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Sermon | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [seriesFilter, setSeriesFilter] = useState("all");

  useEffect(() => {
    loadSermons();
  }, []);

  useEffect(() => {
    filterSermons();
  }, [sermons, searchQuery, statusFilter, seriesFilter]);

  const loadSermons = async () => {
    try {
      setLoading(true);
      const data = await sermonsAPI.getAll();
      setSermons(data);
    } finally {
      setLoading(false);
    }
  };

  const filterSermons = () => {
    let filtered = [...sermons];

    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.description &&
            s.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    if (seriesFilter !== "all") {
      filtered = filtered.filter((s) => s.series === seriesFilter);
    }

    setFilteredSermons(filtered);
  };

  const getUniqueSeriesFromSermons = () => {
    const series = sermons.map((s) => s.series).filter(Boolean);
    return Array.from(new Set(series));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this sermon?"))
      return;
    try {
      await sermonsAPI.delete(id);
      loadSermons();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="tab-content">
        <div className="skeleton-loader">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-line"></div>
              <div className="skeleton-line medium"></div>
              <div className="skeleton-line short"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <div>
          <h2>Sermons</h2>
          <p className="tab-header-description">
            Manage sermon recordings and series
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setShowForm(true);
            setEditingItem(null);
          }}
        >
          + Add Sermon
        </button>
      </div>

      {showForm && (
        <SermonForm
          item={editingItem}
          onSave={() => {
            setShowForm(false);
            setEditingItem(null);
            loadSermons();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}

      {sermons.length > 0 && !showForm && (
        <div className="admin-filters">
          <input
            type="text"
            className="admin-search"
            placeholder="Search sermons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="admin-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <select
            className="admin-filter-select"
            value={seriesFilter}
            onChange={(e) => setSeriesFilter(e.target.value)}
          >
            <option value="all">All Series</option>
            {getUniqueSeriesFromSermons().map((series) => (
              <option key={series} value={series}>
                {series}
              </option>
            ))}
          </select>
        </div>
      )}

      {sermons.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎙️</div>
          <h3>No Sermons Yet</h3>
          <p>
            Start adding sermons to share God's Word with your congregation.
          </p>
          <button
            className="btn-primary"
            onClick={() => {
              setShowForm(true);
              setEditingItem(null);
            }}
          >
            Add First Sermon
          </button>
        </div>
      ) : filteredSermons.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No Matching Sermons</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Speaker</th>
                  <th>Date</th>
                  <th>Series</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSermons.map((item) => (
                  <tr key={item.id}>
                    <td className="table-cell-title">{item.title}</td>
                    <td>{item.speaker}</td>
                    <td className="table-cell-date">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td>{item.series || "—"}</td>
                    <td>
                      <span
                        className={`status-badge status-${item.status.toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn-secondary"
                          onClick={() => {
                            setEditingItem(item);
                            setShowForm(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="items-list">
            {filteredSermons.map((item) => (
              <div key={item.id} className="item-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="item-meta">
                  <span
                    className={`status-badge status-${item.status.toLowerCase()}`}
                  >
                    {item.status}
                  </span>
                  <span>🎤 {item.speaker}</span>
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                  {item.series && <span>📚 {item.series}</span>}
                  {item.passage && <span>📖 {item.passage}</span>}
                </div>
                <div className="item-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setEditingItem(item);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Users Tab
const UsersTab: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await usersAPI.getAll();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (searchQuery) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleUpdateRole = async (id: string, role: string) => {
    if (
      !window.confirm(
        `Are you sure you want to change this user's role to ${role}?`
      )
    )
      return;
    try {
      await usersAPI.update(id, { role });
      loadUsers();
    } catch (err: any) {
      alert("Failed to update user: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="tab-content">
        <div className="skeleton-loader">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-line"></div>
              <div className="skeleton-line medium"></div>
              <div className="skeleton-line short"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <div>
          <h2>User Management</h2>
          <p className="tab-header-description">
            Manage user accounts and permissions
          </p>
        </div>
      </div>

      {users.length > 0 && (
        <div className="admin-filters">
          <input
            type="text"
            className="admin-search"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="admin-filter-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="ADMIN">Admins</option>
            <option value="MEMBER">Members</option>
            <option value="GUEST">Guests</option>
          </select>
        </div>
      )}

      {users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>No Users Found</h3>
          <p>Users will appear here once they register for an account.</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No Matching Users</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="table-cell-title">{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          user.isActive ? "status-approved" : "status-archived"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="table-cell-date">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="table-actions">
                        <select
                          className="admin-filter-select"
                          value={user.role}
                          onChange={(e) =>
                            handleUpdateRole(user.id, e.target.value)
                          }
                          style={{ minWidth: "120px" }}
                        >
                          <option value="GUEST">Guest</option>
                          <option value="MEMBER">Member</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="items-list">
            {filteredUsers.map((user) => (
              <div key={user.id} className="item-card">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <div className="item-meta">
                  <span className={`role-badge role-${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                  <span
                    className={`status-badge ${
                      user.isActive ? "status-approved" : "status-archived"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="item-actions">
                  <select
                    className="admin-filter-select"
                    value={user.role}
                    onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                  >
                    <option value="GUEST">Guest</option>
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Simple forms for CRUD operations
const AnnouncementForm: React.FC<{
  item: Announcement | null;
  onSave: () => void;
  onCancel: () => void;
}> = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: item?.title || "",
    content: item?.content || "",
    category: item?.category || "",
    priority: item?.priority || "normal",
    status: item?.status || "DRAFT",
    isPublic: item?.isPublic ?? true,
    pinned: item?.pinned ?? false,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dataToSend = {
        ...formData,
        publishedAt:
          formData.status === "PUBLISHED" && !item?.publishedAt
            ? new Date().toISOString()
            : item?.publishedAt,
      };
      if (item) {
        await announcementsAPI.update(item.id, dataToSend);
      } else {
        await announcementsAPI.create(dataToSend);
      }
      onSave();
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="crud-form">
      <h3 style={{ margin: "0 0 var(--spacing-lg) 0" }}>
        {item ? "Edit Announcement" : "Create New Announcement"}
      </h3>

      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          placeholder="Enter announcement title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">Content *</label>
        <textarea
          id="content"
          placeholder="Enter announcement content"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          required
          rows={6}
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <input
          id="category"
          type="text"
          placeholder="e.g., Event, Update, Important"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={formData.pinned}
            onChange={(e) =>
              setFormData({ ...formData, pinned: e.target.checked })
            }
          />
          {" "}Pin to top of announcements
        </label>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={formData.isPublic}
            onChange={(e) =>
              setFormData({ ...formData, isPublic: e.target.checked })
            }
          />
          {" "}Visible to public (non-members)
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving..." : item ? "Update" : "Create"}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const CalendarForm: React.FC<{
  item: CalendarEvent | null;
  onSave: () => void;
  onCancel: () => void;
}> = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: item?.title || "",
    description: item?.description || "",
    startDate: item?.startDate
      ? new Date(item.startDate).toISOString().slice(0, 16)
      : "",
    location: item?.location || "",
    category: item?.category || "",
    status: item?.status || "PUBLISHED",
    isPublic: item?.isPublic ?? true,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (item) {
        await calendarAPI.update(item.id, {
          ...formData,
          startDate: new Date(formData.startDate).toISOString(),
        });
      } else {
        await calendarAPI.create({
          ...formData,
          startDate: new Date(formData.startDate).toISOString(),
        });
      }
      onSave();
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="crud-form">
      <h3 style={{ margin: "0 0 var(--spacing-lg) 0" }}>
        {item ? "Edit Event" : "Create New Event"}
      </h3>

      <div className="form-group">
        <label htmlFor="event-title">Title *</label>
        <input
          id="event-title"
          type="text"
          placeholder="Enter event title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="event-description">Description</label>
        <textarea
          id="event-description"
          placeholder="Enter event description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="event-date">Date & Time *</label>
        <input
          id="event-date"
          type="datetime-local"
          value={formData.startDate}
          onChange={(e) =>
            setFormData({ ...formData, startDate: e.target.value })
          }
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="event-location">Location</label>
        <input
          id="event-location"
          type="text"
          placeholder="e.g., Main Sanctuary, Fellowship Hall"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="event-category">Category</label>
        <input
          id="event-category"
          type="text"
          placeholder="e.g., Worship, Youth, Prayer"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="event-status">Status</label>
        <select
          id="event-status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={formData.isPublic}
            onChange={(e) =>
              setFormData({ ...formData, isPublic: e.target.checked })
            }
          />
          {" "}Visible to public (non-members)
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving..." : item ? "Update" : "Create"}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const SermonForm: React.FC<{
  item: Sermon | null;
  onSave: () => void;
  onCancel: () => void;
}> = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: item?.title || "",
    description: item?.description || "",
    speaker: item?.speaker || "",
    date: item?.date ? new Date(item.date).toISOString().slice(0, 10) : "",
    passage: item?.passage || "",
    series: item?.series || "",
    videoUrl: item?.videoUrl || "",
    status: item?.status || "PUBLISHED",
    isPublic: item?.isPublic ?? true,
    isFeatured: item?.isFeatured ?? false,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (item) {
        await sermonsAPI.update(item.id, {
          ...formData,
          date: new Date(formData.date).toISOString(),
        });
      } else {
        await sermonsAPI.create({
          ...formData,
          date: new Date(formData.date).toISOString(),
        });
      }
      onSave();
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="crud-form">
      <h3 style={{ margin: "0 0 var(--spacing-lg) 0" }}>
        {item ? "Edit Sermon" : "Add New Sermon"}
      </h3>

      <div className="form-group">
        <label htmlFor="sermon-title">Title *</label>
        <input
          id="sermon-title"
          type="text"
          placeholder="Enter sermon title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="sermon-description">Description</label>
        <textarea
          id="sermon-description"
          placeholder="Enter sermon description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="sermon-speaker">Speaker *</label>
        <input
          id="sermon-speaker"
          type="text"
          placeholder="Enter speaker name"
          value={formData.speaker}
          onChange={(e) =>
            setFormData({ ...formData, speaker: e.target.value })
          }
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="sermon-date">Date *</label>
        <input
          id="sermon-date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="sermon-passage">Bible Passage</label>
        <input
          id="sermon-passage"
          type="text"
          placeholder="e.g., John 3:16-21"
          value={formData.passage}
          onChange={(e) =>
            setFormData({ ...formData, passage: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="sermon-series">Series Name</label>
        <input
          id="sermon-series"
          type="text"
          placeholder="Enter sermon series name (if applicable)"
          value={formData.series}
          onChange={(e) => setFormData({ ...formData, series: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="sermon-video">Video URL</label>
        <input
          id="sermon-video"
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          value={formData.videoUrl}
          onChange={(e) =>
            setFormData({ ...formData, videoUrl: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="sermon-status">Status</label>
        <select
          id="sermon-status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={formData.isPublic}
            onChange={(e) =>
              setFormData({ ...formData, isPublic: e.target.checked })
            }
          />
          {" "}Visible to public (non-members)
        </label>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) =>
              setFormData({ ...formData, isFeatured: e.target.checked })
            }
          />
          {" "}Feature on homepage
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving..." : item ? "Update" : "Create"}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default Members;

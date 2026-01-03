import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import LoadingSpinner from "../components/LoadingSpinner";
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
import "./Members.css";

const Members: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isAdmin,
    isMember,
    isLoading: authLoading,
  } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "announcements" | "calendar" | "sermons" | "prayers" | "users"
  >("prayers");

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
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
  );
};

// Prayer Requests Tab
const PrayerRequestsTab: React.FC = () => {
  const { isAdmin } = useAuth();
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPrayers();
  }, []);

  const loadPrayers = async () => {
    try {
      setLoading(true);
      const data = await prayerRequestsAPI.getAll({ status: "APPROVED" });
      setPrayers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await prayerRequestsAPI.update(id, { status });
      loadPrayers();
    } catch (err: any) {
      alert("Failed to update prayer request: " + err.message);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="tab-content">
      <h2>Prayer Requests</h2>
      <div className="items-grid">
        {prayers.length === 0 ? (
          <p>No prayer requests found.</p>
        ) : (
          prayers.map((prayer) => (
            <div key={prayer.id} className="prayer-card">
              <h3>{prayer.title}</h3>
              <p>{prayer.description}</p>
              <div className="prayer-meta">
                <span>Category: {prayer.category}</span>
                <span>Priority: {prayer.priority}</span>
                <span>Status: {prayer.status}</span>
                {prayer.requester && <span>By: {prayer.requester}</span>}
              </div>
              {isAdmin && (
                <div className="prayer-actions">
                  {prayer.status !== "ANSWERED" && (
                    <button
                      onClick={() => handleUpdateStatus(prayer.id, "ANSWERED")}
                    >
                      Mark Answered
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Announcements Tab
const AnnouncementsTab: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await announcementsAPI.getAll();
      setAnnouncements(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await announcementsAPI.delete(id);
      loadAnnouncements();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Announcements</h2>
        <button
          className="btn-primary"
          onClick={() => {
            setShowForm(true);
            setEditingItem(null);
          }}
        >
          Add New
        </button>
      </div>
      {showForm && (
        <AnnouncementForm
          item={editingItem}
          onSave={() => {
            setShowForm(false);
            loadAnnouncements();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
      <div className="items-list">
        {announcements.map((item) => (
          <div key={item.id} className="item-card">
            <h3>{item.title}</h3>
            <p>{item.content}</p>
            <div className="item-meta">
              <span>{item.status}</span>
              <span>{item.category}</span>
            </div>
            <div className="item-actions">
              <button
                onClick={() => {
                  setEditingItem(item);
                  setShowForm(true);
                }}
              >
                Edit
              </button>
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Calendar Tab
const CalendarTab: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await calendarAPI.getAll();
      setEvents(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await calendarAPI.delete(id);
      loadEvents();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Calendar Events</h2>
        <button
          className="btn-primary"
          onClick={() => {
            setShowForm(true);
            setEditingItem(null);
          }}
        >
          Add New
        </button>
      </div>
      {showForm && (
        <CalendarForm
          item={editingItem}
          onSave={() => {
            setShowForm(false);
            loadEvents();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
      <div className="items-list">
        {events.map((item) => (
          <div key={item.id} className="item-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className="item-meta">
              <span>{new Date(item.startDate).toLocaleDateString()}</span>
              <span>{item.category}</span>
              <span>{item.location}</span>
            </div>
            <div className="item-actions">
              <button
                onClick={() => {
                  setEditingItem(item);
                  setShowForm(true);
                }}
              >
                Edit
              </button>
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sermons Tab
const SermonsTab: React.FC = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Sermon | null>(null);

  useEffect(() => {
    loadSermons();
  }, []);

  const loadSermons = async () => {
    try {
      setLoading(true);
      const data = await sermonsAPI.getAll();
      setSermons(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this sermon?")) return;
    try {
      await sermonsAPI.delete(id);
      loadSermons();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Sermons</h2>
        <button
          className="btn-primary"
          onClick={() => {
            setShowForm(true);
            setEditingItem(null);
          }}
        >
          Add New
        </button>
      </div>
      {showForm && (
        <SermonForm
          item={editingItem}
          onSave={() => {
            setShowForm(false);
            loadSermons();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
      <div className="items-list">
        {sermons.map((item) => (
          <div key={item.id} className="item-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className="item-meta">
              <span>Speaker: {item.speaker}</span>
              <span>Date: {new Date(item.date).toLocaleDateString()}</span>
              {item.series && <span>Series: {item.series}</span>}
            </div>
            <div className="item-actions">
              <button
                onClick={() => {
                  setEditingItem(item);
                  setShowForm(true);
                }}
              >
                Edit
              </button>
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Users Tab
const UsersTab: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await usersAPI.getAll();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (id: string, role: string) => {
    try {
      await usersAPI.update(id, { role });
      loadUsers();
    } catch (err: any) {
      alert("Failed to update user: " + err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="tab-content">
      <h2>User Management</h2>
      <div className="items-list">
        {users.map((user) => (
          <div key={user.id} className="item-card">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <div className="item-meta">
              <span>Role: {user.role}</span>
              <span>Status: {user.isActive ? "Active" : "Inactive"}</span>
            </div>
            <div className="item-actions">
              <select
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
    status: item?.status || "PUBLISHED",
    isPublic: item?.isPublic ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (item) {
        await announcementsAPI.update(item.id, formData);
      } else {
        await announcementsAPI.create(formData);
      }
      onSave();
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="crud-form">
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <textarea
        placeholder="Content"
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      />
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          Save
        </button>
        <button type="button" onClick={onCancel}>
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
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    }
  };

  return (
    <form onSubmit={handleSubmit} className="crud-form">
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />
      <input
        type="datetime-local"
        value={formData.startDate}
        onChange={(e) =>
          setFormData({ ...formData, startDate: e.target.value })
        }
        required
      />
      <input
        type="text"
        placeholder="Location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
      />
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          Save
        </button>
        <button type="button" onClick={onCancel}>
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
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    }
  };

  return (
    <form onSubmit={handleSubmit} className="crud-form">
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Speaker"
        value={formData.speaker}
        onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
        required
      />
      <input
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Bible Passage"
        value={formData.passage}
        onChange={(e) => setFormData({ ...formData, passage: e.target.value })}
      />
      <input
        type="text"
        placeholder="Series Name"
        value={formData.series}
        onChange={(e) => setFormData({ ...formData, series: e.target.value })}
      />
      <input
        type="url"
        placeholder="Video URL"
        value={formData.videoUrl}
        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
      />
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          Save
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default Members;

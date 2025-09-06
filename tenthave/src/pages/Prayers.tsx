import React, { useState } from "react";
import { ScrollReveal } from "../components/ScrollReveal";
import "./Prayers.css";

// Prayer request interface
interface PrayerRequest {
  id: string;
  title: string;
  description: string;
  requester: string;
  date: string;
  isAnswered: boolean;
  category: "health" | "family" | "work" | "spiritual" | "community" | "other";
  priority: "urgent" | "high" | "normal";
  isPrivate: boolean;
  answeredDate?: string;
}

// Mock prayer requests data
const MOCK_PRAYER_REQUESTS: PrayerRequest[] = [
  {
    id: "1",
    title: "Health and Healing",
    description:
      "Praying for strength and recovery during this difficult time. Please pray for complete healing and restoration.",
    requester: "Anonymous",
    date: "2024-01-15",
    isAnswered: false,
    category: "health",
    priority: "urgent",
    isPrivate: false,
  },
  {
    id: "2",
    title: "Family Unity",
    description:
      "Praying for reconciliation and peace within our family. We need God's intervention to heal broken relationships.",
    requester: "Anonymous",
    date: "2024-01-14",
    isAnswered: false,
    category: "family",
    priority: "high",
    isPrivate: false,
  },
  {
    id: "3",
    title: "Job Opportunities",
    description:
      "Seeking God's guidance for new employment opportunities. Praying for the right doors to open.",
    requester: "Anonymous",
    date: "2024-01-13",
    isAnswered: true,
    category: "work",
    priority: "normal",
    isPrivate: false,
    answeredDate: "2024-01-20",
  },
  {
    id: "4",
    title: "Spiritual Growth",
    description:
      "Praying for deeper relationship with God and spiritual maturity in our walk with Christ.",
    requester: "Anonymous",
    date: "2024-01-12",
    isAnswered: false,
    category: "spiritual",
    priority: "normal",
    isPrivate: false,
  },
  {
    id: "5",
    title: "Community Outreach",
    description:
      "Praying for our church's outreach programs and that we may reach more people with the Gospel.",
    requester: "Anonymous",
    date: "2024-01-11",
    isAnswered: false,
    category: "community",
    priority: "high",
    isPrivate: false,
  },
  {
    id: "6",
    title: "Missionary Support",
    description:
      "Praying for our missionaries serving overseas, for their safety and effectiveness in ministry.",
    requester: "Anonymous",
    date: "2024-01-10",
    isAnswered: false,
    category: "community",
    priority: "normal",
    isPrivate: false,
  },
];

// Prayer Request Card Component
const PrayerRequestCard: React.FC<{ request: PrayerRequest }> = ({
  request,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "health":
        return "🏥";
      case "family":
        return "👨‍👩‍👧‍👦";
      case "work":
        return "💼";
      case "spiritual":
        return "🙏";
      case "community":
        return "🌍";
      default:
        return "💭";
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "priority-urgent";
      case "high":
        return "priority-high";
      case "normal":
        return "priority-normal";
      default:
        return "";
    }
  };

  return (
    <div
      className={`prayer-card ${
        request.isAnswered ? "answered" : ""
      } ${getPriorityClass(request.priority)}`}
    >
      <div className="prayer-header">
        <div className="prayer-title-section">
          <h3 className="prayer-title">{request.title}</h3>
          <div className="prayer-badges">
            <span className="category-badge">
              {getCategoryIcon(request.category)}{" "}
              {request.category.toUpperCase()}
            </span>
            <span
              className={`priority-badge ${getPriorityClass(request.priority)}`}
            >
              {request.priority.toUpperCase()}
            </span>
            {request.isAnswered && (
              <span className="answered-badge">Answered</span>
            )}
          </div>
        </div>
      </div>
      <p className="prayer-description">{request.description}</p>
      <div className="prayer-meta">
        <span className="prayer-date">{formatDate(request.date)}</span>
        {request.isAnswered && request.answeredDate && (
          <span className="answered-date">
            Answered: {formatDate(request.answeredDate)}
          </span>
        )}
        <span className="prayer-requester">
          Requested by: {request.requester}
        </span>
      </div>
    </div>
  );
};

// Prayer Request Form Component
const PrayerRequestForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requester: "",
    category: "other" as const,
    priority: "normal" as const,
    isPrivate: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Prayer request submitted:", formData);
    // Reset form
    setFormData({
      title: "",
      description: "",
      requester: "",
      category: "other",
      priority: "normal",
      isPrivate: false,
    });
  };

  return (
    <form className="prayer-form" onSubmit={handleSubmit}>
      <h3>Submit a Prayer Request</h3>
      <div className="form-group">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Prayer Request Title"
          required
        />
      </div>
      <div className="form-group">
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your prayer request"
          rows={4}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="requester"
          value={formData.requester}
          onChange={handleChange}
          placeholder="Your Name (optional)"
        />
      </div>
      <div className="form-group">
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="health">🏥 Health & Healing</option>
          <option value="family">👨‍👩‍👧‍👦 Family</option>
          <option value="work">💼 Work & Career</option>
          <option value="spiritual">🙏 Spiritual Growth</option>
          <option value="community">🌍 Community & Outreach</option>
          <option value="other">💭 Other</option>
        </select>
      </div>
      <div className="form-group">
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          required
        >
          <option value="normal">Normal Priority</option>
          <option value="high">High Priority</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            name="isPrivate"
            checked={formData.isPrivate}
            onChange={handleChange}
          />
          Keep this request private (only visible to church leadership)
        </label>
      </div>
      <button type="submit" className="submit-btn">
        Submit Prayer Request
      </button>
    </form>
  );
};

// Prayer Verses Component
const PrayerVerses: React.FC = () => {
  return (
    <div className="prayer-verses">
      <ScrollReveal className="textJohn">
        <h2>MATTHEW 18:20</h2>
        <p>
          "For where two or three are gathered together in My name, I am there
          in the midst of them."
        </p>
      </ScrollReveal>
    </div>
  );
};

// Main Prayers Component
const Prayers: React.FC = () => {
  const [prayerRequests] = useState<PrayerRequest[]>(MOCK_PRAYER_REQUESTS);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRequests = prayerRequests.filter((request) => {
    const matchesCategory =
      filterCategory === "all" || request.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "answered" && request.isAnswered) ||
      (filterStatus === "pending" && !request.isAnswered);
    const matchesSearch =
      searchTerm === "" ||
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="prayers-page-wrapper">
      <ScrollReveal className="prayers-hero">
        <h1>Prayer Requests</h1>
        <p>Join us in prayer for our church family and community</p>
      </ScrollReveal>

      <div className="prayers-content">
        <ScrollReveal className="prayer-form-section">
          <PrayerRequestForm />
        </ScrollReveal>

        <ScrollReveal className="prayer-requests-section">
          <div className="requests-header">
            <h2>Current Prayer Requests</h2>
            <div className="filters">
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="category-filter"
              >
                <option value="all">All Categories</option>
                <option value="health">Health & Healing</option>
                <option value="family">Family</option>
                <option value="work">Work & Career</option>
                <option value="spiritual">Spiritual Growth</option>
                <option value="community">Community & Outreach</option>
                <option value="other">Other</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="status-filter"
              >
                <option value="all">All Requests</option>
                <option value="pending">Pending</option>
                <option value="answered">Answered</option>
              </select>
            </div>
          </div>
          <div className="prayer-grid">
            {filteredRequests.map((request) => (
              <PrayerRequestCard key={request.id} request={request} />
            ))}
            {filteredRequests.length === 0 && (
              <div className="no-requests">
                <p>No prayer requests found matching your criteria.</p>
              </div>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal className="prayer-verses-section">
          <PrayerVerses />
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Prayers;

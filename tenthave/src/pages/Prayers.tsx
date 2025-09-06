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

// Prayer Statistics Component
const PrayerStats: React.FC<{ requests: PrayerRequest[] }> = ({ requests }) => {
  const totalRequests = requests.length;
  const answeredRequests = requests.filter((r) => r.isAnswered).length;
  const urgentRequests = requests.filter(
    (r) => r.priority === "urgent" && !r.isAnswered
  ).length;
  const answeredPercentage =
    totalRequests > 0
      ? Math.round((answeredRequests / totalRequests) * 100)
      : 0;

  return (
    <div className="prayer-stats">
      <h2>Prayer Statistics</h2>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-number">{totalRequests}</div>
          <div className="stat-label">Total Requests</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{answeredRequests}</div>
          <div className="stat-label">Answered Prayers</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{urgentRequests}</div>
          <div className="stat-label">Urgent Requests</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{answeredPercentage}%</div>
          <div className="stat-label">Answered Rate</div>
        </div>
      </div>
    </div>
  );
};

// Prayer Verses Component
const PrayerVerses: React.FC = () => {
  const verses = [
    {
      reference: "Matthew 18:20",
      text: "For where two or three are gathered together in my name, there am I in the midst of them.",
    },
    {
      reference: "Philippians 4:6-7",
      text: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.",
    },
    {
      reference: "James 5:16",
      text: "Confess your faults one to another, and pray one for another, that ye may be healed. The effectual fervent prayer of a righteous man availeth much.",
    },
  ];

  return (
    <div className="prayer-verses">
      <h2>Scripture for Prayer</h2>
      <div className="verses-grid">
        {verses.map((verse, index) => (
          <div key={index} className="verse-card">
            <blockquote>"{verse.text}"</blockquote>
            <cite>— {verse.reference}</cite>
          </div>
        ))}
      </div>
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

        <ScrollReveal className="prayer-stats-section">
          <PrayerStats requests={prayerRequests} />
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

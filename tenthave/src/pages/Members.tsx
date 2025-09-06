import React, { useState } from "react";
import { ScrollReveal } from "../components/ScrollReveal";
import { WEEKLY_SERVICES, SPECIAL_MINISTRIES } from "../constants";
import "./Members.css";

// Member interface
interface Member {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  ministry?: string;
  isActive: boolean;
}

// Member announcement interface
interface MemberAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: "high" | "medium" | "low";
  category: "general" | "ministry" | "event" | "prayer";
}

// Mock data for members
const MOCK_MEMBERS: Member[] = [
  {
    id: "1",
    name: "Pastor John Smith",
    role: "Senior Pastor",
    email: "pastor@10thavebiblechapel.com",
    phone: "(604) 222-7777",
    ministry: "Leadership",
    isActive: true,
  },
  {
    id: "2",
    name: "Mary Johnson",
    role: "Sunday School Director",
    email: "sundayschool@10thavebiblechapel.com",
    ministry: "Children's Ministry",
    isActive: true,
  },
  {
    id: "3",
    name: "David Chen",
    role: "Worship Leader",
    phone: "(604) 333-8888",
    ministry: "Worship",
    isActive: true,
  },
  {
    id: "4",
    name: "Sarah Williams",
    role: "ESL Coordinator",
    email: "esl@10thavebiblechapel.com",
    ministry: "ESL Ministry",
    isActive: false,
  },
  {
    id: "5",
    name: "Robert Garcia",
    role: "Spanish Ministry Leader",
    phone: "(604) 444-9999",
    ministry: "Spanish Ministry",
    isActive: true,
  },
];

// Mock data for announcements
const MOCK_ANNOUNCEMENTS: MemberAnnouncement[] = [
  {
    id: "1",
    title: "Church Potluck This Sunday",
    content:
      "Join us for our monthly potluck after the Family Bible Hour. Please bring a dish to share!",
    date: "2024-01-15",
    priority: "high",
    category: "event",
  },
  {
    id: "2",
    title: "Sunday School Teacher Needed",
    content:
      "We are looking for a volunteer to help with our Sunday School program. Contact Mary Johnson for more information.",
    date: "2024-01-12",
    priority: "medium",
    category: "ministry",
  },
  {
    id: "3",
    title: "Prayer Request: Missionary Family",
    content:
      "Please keep the Johnson family in your prayers as they prepare for their mission trip to Guatemala next month.",
    date: "2024-01-10",
    priority: "high",
    category: "prayer",
  },
  {
    id: "4",
    title: "Church Office Hours Update",
    content:
      "The church office will be closed on Monday, January 20th for Martin Luther King Jr. Day.",
    date: "2024-01-08",
    priority: "low",
    category: "general",
  },
];

// Member Directory Component
const MemberDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const filteredMembers = MOCK_MEMBERS.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.ministry?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      filterRole === "all" ||
      member.role.toLowerCase().includes(filterRole.toLowerCase());
    return matchesSearch && matchesRole && member.isActive;
  });

  return (
    <div className="member-directory">
      <h2>Member Directory</h2>

      <div className="directory-filters">
        <input
          type="text"
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="role-filter"
        >
          <option value="all">All Roles</option>
          <option value="pastor">Pastor</option>
          <option value="director">Director</option>
          <option value="leader">Leader</option>
          <option value="coordinator">Coordinator</option>
        </select>
      </div>

      <div className="members-grid">
        {filteredMembers.map((member) => (
          <div key={member.id} className="member-card">
            <h3>{member.name}</h3>
            <p className="member-role">{member.role}</p>
            {member.ministry && (
              <p className="member-ministry">{member.ministry}</p>
            )}
            <div className="member-contact">
              {member.email && (
                <a href={`mailto:${member.email}`} className="contact-link">
                  📧 {member.email}
                </a>
              )}
              {member.phone && (
                <a href={`tel:${member.phone}`} className="contact-link">
                  📞 {member.phone}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Member Announcements Component
const MemberAnnouncements: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState("all");

  const filteredAnnouncements = MOCK_ANNOUNCEMENTS.filter((announcement) => {
    return filterCategory === "all" || announcement.category === filterCategory;
  });

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "";
    }
  };

  return (
    <div className="member-announcements">
      <h2>Member Announcements</h2>

      <div className="announcement-filters">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="category-filter"
        >
          <option value="all">All Categories</option>
          <option value="general">General</option>
          <option value="ministry">Ministry</option>
          <option value="event">Events</option>
          <option value="prayer">Prayer</option>
        </select>
      </div>

      <div className="announcements-list">
        {filteredAnnouncements.map((announcement) => (
          <div
            key={announcement.id}
            className={`announcement-card ${getPriorityClass(
              announcement.priority
            )}`}
          >
            <div className="announcement-header">
              <h3>{announcement.title}</h3>
              <span
                className={`priority-badge ${getPriorityClass(
                  announcement.priority
                )}`}
              >
                {announcement.priority.toUpperCase()}
              </span>
            </div>
            <p className="announcement-content">{announcement.content}</p>
            <div className="announcement-meta">
              <span className="announcement-date">
                {new Date(announcement.date).toLocaleDateString()}
              </span>
              <span className="announcement-category">
                {announcement.category.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Member Resources Component
const MemberResources: React.FC = () => {
  const resources = [
    {
      title: "Church Constitution",
      description: "Our church constitution and bylaws",
      type: "document",
      url: "#",
    },
    {
      title: "Ministry Guidelines",
      description: "Guidelines for church ministries and volunteers",
      type: "document",
      url: "#",
    },
    {
      title: "Prayer Request Form",
      description: "Submit prayer requests online",
      type: "form",
      url: "#",
    },
    {
      title: "Event Planning Guide",
      description: "Guidelines for planning church events",
      type: "document",
      url: "#",
    },
    {
      title: "Volunteer Application",
      description: "Apply to serve in various ministries",
      type: "form",
      url: "#",
    },
    {
      title: "Financial Reports",
      description: "Monthly financial reports and budgets",
      type: "document",
      url: "#",
    },
  ];

  return (
    <div className="member-resources">
      <h2>Member Resources</h2>
      <div className="resources-grid">
        {resources.map((resource, index) => (
          <div key={index} className="resource-card">
            <h3>{resource.title}</h3>
            <p>{resource.description}</p>
            <button
              className="resource-link"
              onClick={() => alert("This feature will be available soon!")}
            >
              {resource.type === "document"
                ? "📄 View Document"
                : "📝 Access Form"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Service Schedule Component
const ServiceSchedule: React.FC = () => (
  <div className="service-schedule">
    <h2>Service Schedule</h2>
    <div className="schedule-grid">
      {WEEKLY_SERVICES.map((service) => (
        <div key={service.id} className="schedule-item">
          <h3>{service.name}</h3>
          <p className="schedule-time">
            {service.time.day} {service.time.start} - {service.time.end}
          </p>
          <p className="schedule-description">{service.description}</p>
          {service.zoomLink && (
            <a
              href={service.zoomLink}
              target="_blank"
              rel="noopener noreferrer"
              className="zoom-link"
            >
              Join Online
            </a>
          )}
        </div>
      ))}
    </div>
  </div>
);

// Ministry Opportunities Component
const MinistryOpportunities: React.FC = () => (
  <div className="ministry-opportunities">
    <h2>Ministry Opportunities</h2>
    <div className="opportunities-grid">
      {SPECIAL_MINISTRIES.map((ministry) => (
        <div
          key={ministry.id}
          className={`opportunity-card ${!ministry.isActive ? "inactive" : ""}`}
        >
          <h3>{ministry.name}</h3>
          <p>{ministry.description}</p>
          {ministry.isActive ? (
            <button
              className="volunteer-link"
              onClick={() => alert("Contact the church office to volunteer!")}
            >
              Volunteer Here
            </button>
          ) : (
            <span className="inactive-badge">Currently Inactive</span>
          )}
        </div>
      ))}
    </div>
  </div>
);

// Main Members Component
const Members: React.FC = () => {
  return (
    <div className="members-page-wrapper">
      <ScrollReveal className="members-hero">
        <h1>Members Area</h1>
        <p>
          Welcome to the members area. Access resources, announcements, and
          connect with your church family.
        </p>
      </ScrollReveal>

      <div className="members-content">
        <ScrollReveal className="announcements-section">
          <MemberAnnouncements />
        </ScrollReveal>

        <ScrollReveal className="directory-section">
          <MemberDirectory />
        </ScrollReveal>

        <ScrollReveal className="resources-section">
          <MemberResources />
        </ScrollReveal>

        <ScrollReveal className="schedule-section">
          <ServiceSchedule />
        </ScrollReveal>

        <ScrollReveal className="ministry-section">
          <MinistryOpportunities />
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Members;

import React, { useState, useMemo } from "react";
import { ScrollReveal } from "../components/ScrollReveal";
import SermonCard from "../components/SermonCard";
import "./Sermon.css";

// Mock sermon data - in a real app, this would come from an API
const MOCK_SERMONS = [
  {
    id: "2",
    name: "RECENT SERMON",
    title: "WALKING IN FAITH",
    description: "A message about trusting in God's plan for our lives.",
    time: {
      day: "Sunday",
      start: "11:30 AM",
      end: "12:30 PM",
    },
    location: "7103 - 10th Ave., Burnaby, BC V3N 2R5",
    link: "https://example.com/video1",
    image: "/assets/sermonCardImg.svg",
    speaker: "Pastor John Smith",
    date: "2024-01-14",
    category: "Sunday Service",
    buttonText: "WATCH NOW",
    showSpeaker: true,
    showDate: true,
  },
  {
    id: "3",
    name: "RECENT SERMON",
    title: "THE POWER OF PRAYER",
    description:
      "Understanding how prayer transforms our relationship with God.",
    time: {
      day: "Sunday",
      start: "11:30 AM",
      end: "12:30 PM",
    },
    location: "7103 - 10th Ave., Burnaby, BC V3N 2R5",
    link: "https://example.com/video2",
    image: "/assets/sermonCardImg.svg",
    speaker: "Pastor John Smith",
    date: "2024-01-07",
    category: "Sunday Service",
    buttonText: "WATCH NOW",
    showSpeaker: true,
    showDate: true,
  },
  {
    id: "4",
    name: "RECENT SERMON",
    title: "LOVE YOUR NEIGHBOR",
    description: "Learning to show Christ's love in our daily interactions.",
    time: {
      day: "Sunday",
      start: "11:30 AM",
      end: "12:30 PM",
    },
    location: "7103 - 10th Ave., Burnaby, BC V3N 2R5",
    link: "https://example.com/video3",
    image: "/assets/sermonCardImg.svg",
    speaker: "Pastor Sarah Johnson",
    date: "2023-12-31",
    category: "Sunday Service",
    buttonText: "WATCH NOW",
    showSpeaker: true,
    showDate: true,
  },
  {
    id: "5",
    name: "RECENT SERMON",
    title: "FORGIVENESS AND HEALING",
    description: "The transformative power of forgiveness in our lives.",
    time: {
      day: "Sunday",
      start: "11:30 AM",
      end: "12:30 PM",
    },
    location: "7103 - 10th Ave., Burnaby, BC V3N 2R5",
    link: "https://example.com/video4",
    image: "/assets/sermonCardImg.svg",
    speaker: "Pastor John Smith",
    date: "2023-12-24",
    category: "Christmas Service",
    buttonText: "WATCH NOW",
    showSpeaker: true,
    showDate: true,
  },
  {
    id: "6",
    name: "RECENT SERMON",
    title: "HOPE IN DARK TIMES",
    description: "Finding light and hope when life seems overwhelming.",
    time: {
      day: "Sunday",
      start: "11:30 AM",
      end: "12:30 PM",
    },
    location: "7103 - 10th Ave., Burnaby, BC V3N 2R5",
    link: "https://example.com/video5",
    image: "/assets/sermonCardImg.svg",
    speaker: "Pastor Michael Brown",
    date: "2023-12-17",
    category: "Sunday Service",
    buttonText: "WATCH NOW",
    showSpeaker: true,
    showDate: true,
  },
  {
    id: "7",
    name: "RECENT SERMON",
    title: "GRATITUDE AND THANKSGIVING",
    description: "Cultivating a heart of gratitude in all circumstances.",
    time: {
      day: "Sunday",
      start: "11:30 AM",
      end: "12:30 PM",
    },
    location: "7103 - 10th Ave., Burnaby, BC V3N 2R5",
    link: "https://example.com/video6",
    image: "/assets/sermonCardImg.svg",
    speaker: "Pastor Sarah Johnson",
    date: "2023-11-26",
    category: "Thanksgiving Service",
    buttonText: "WATCH NOW",
    showSpeaker: true,
    showDate: true,
  },
  {
    id: "8",
    name: "RECENT SERMON",
    title: "SERVING WITH JOY",
    description: "Discovering the joy that comes from serving others.",
    time: {
      day: "Sunday",
      start: "11:30 AM",
      end: "12:30 PM",
    },
    location: "7103 - 10th Ave., Burnaby, BC V3N 2R5",
    link: "https://example.com/video7",
    image: "/assets/sermonCardImg.svg",
    speaker: "Pastor John Smith",
    date: "2023-11-19",
    category: "Sunday Service",
    buttonText: "WATCH NOW",
    showSpeaker: true,
    showDate: true,
  },
  {
    id: "9",
    name: "RECENT SERMON",
    title: "WISDOM FOR DAILY LIVING",
    description: "Applying biblical wisdom to everyday decisions.",
    time: {
      day: "Sunday",
      start: "11:30 AM",
      end: "12:30 PM",
    },
    location: "7103 - 10th Ave., Burnaby, BC V3N 2R5",
    link: "https://example.com/video8",
    image: "/assets/sermonCardImg.svg",
    speaker: "Pastor Michael Brown",
    date: "2023-11-12",
    category: "Sunday Service",
    buttonText: "WATCH NOW",
    showSpeaker: true,
    showDate: true,
  },
  {
    id: "10",
    name: "RECENT SERMON",
    title: "COMMUNITY AND FELLOWSHIP",
    description: "Building strong Christian community in our church.",
    time: {
      day: "Sunday",
      start: "11:30 AM",
      end: "12:30 PM",
    },
    location: "7103 - 10th Ave., Burnaby, BC V3N 2R5",
    link: "https://example.com/video9",
    image: "/assets/sermonCardImg.svg",
    speaker: "Pastor Sarah Johnson",
    date: "2023-11-05",
    category: "Sunday Service",
    buttonText: "WATCH NOW",
    showSpeaker: true,
    showDate: true,
  },
];

// Search and Filter Component
const SearchAndFilter: React.FC<{
  searchTerm: string;
  onSearchChange: (term: string) => void;
  groupBy: string;
  onGroupByChange: (group: string) => void;
  totalResults: number;
}> = ({
  searchTerm,
  onSearchChange,
  groupBy,
  onGroupByChange,
  totalResults,
}) => {
  return (
    <div className="sermon-controls">
      <div className="sermon-controls__search">
        <input
          type="text"
          placeholder="Search sermons by title..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="sermon-search-input"
        />
        <span className="sermon-search-icon">🔍</span>
      </div>

      <div className="sermon-controls__filters">
        <label htmlFor="group-select">Group by:</label>
        <select
          id="group-select"
          value={groupBy}
          onChange={(e) => onGroupByChange(e.target.value)}
          className="sermon-group-select"
        >
          <option value="none">No Grouping</option>
          <option value="category">Category</option>
          <option value="speaker">Speaker</option>
          <option value="month">Month</option>
        </select>
      </div>

      <div className="sermon-controls__results">
        <span className="sermon-results-count">
          {totalResults} sermon{totalResults !== 1 ? "s" : ""} found
        </span>
      </div>
    </div>
  );
};

// Pagination Component
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="sermon-pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="sermon-pagination__btn sermon-pagination__btn--prev"
      >
        ← Previous
      </button>

      <div className="sermon-pagination__numbers">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`sermon-pagination__btn sermon-pagination__btn--number ${
              page === currentPage ? "sermon-pagination__btn--active" : ""
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="sermon-pagination__btn sermon-pagination__btn--next"
      >
        Next →
      </button>
    </div>
  );
};

// Group Header Component
const GroupHeader: React.FC<{ title: string; count: number }> = ({
  title,
  count,
}) => (
  <div className="sermon-group-header">
    <h3 className="sermon-group-title">{title}</h3>
    <span className="sermon-group-count">
      {count} sermon{count !== 1 ? "s" : ""}
    </span>
  </div>
);

// Main Sermon Component
const SermonPage: React.FC = () => {
  const [sermons] = useState(MOCK_SERMONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupBy, setGroupBy] = useState("none");
  const [currentPage, setCurrentPage] = useState(1);
  const sermonsPerPage = 3;

  // Filter and search sermons
  const filteredSermons = useMemo(() => {
    return sermons.filter(
      (sermon) =>
        sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.speaker?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sermons, searchTerm]);

  // Group sermons
  const groupedSermons = useMemo(() => {
    if (groupBy === "none") {
      return { "All Sermons": filteredSermons };
    }

    const groups: { [key: string]: typeof filteredSermons } = {};

    filteredSermons.forEach((sermon) => {
      let groupKey = "";

      switch (groupBy) {
        case "category":
          groupKey = sermon.category || "Uncategorized";
          break;
        case "speaker":
          groupKey = sermon.speaker || "Unknown Speaker";
          break;
        case "month":
          if (sermon.date) {
            const date = new Date(sermon.date);
            groupKey = date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            });
          } else {
            groupKey = "No Date";
          }
          break;
        default:
          groupKey = "All Sermons";
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(sermon);
    });

    return groups;
  }, [filteredSermons, groupBy]);

  // Paginate grouped sermons
  const paginatedGroups = useMemo(() => {
    const allSermons = Object.values(groupedSermons).flat();
    const totalPages = Math.ceil(allSermons.length / sermonsPerPage);
    const startIndex = (currentPage - 1) * sermonsPerPage;
    const endIndex = startIndex + sermonsPerPage;
    const paginatedSermons = allSermons.slice(startIndex, endIndex);

    return {
      sermons: paginatedSermons,
      totalPages,
      totalResults: allSermons.length,
    };
  }, [groupedSermons, currentPage, sermonsPerPage]);

  // Reset to first page when search or group changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, groupBy]);

  return (
    <div className="sermon-page-wrapper">
      <ScrollReveal className="sermon-hero">
        <h1>Recent Sermons</h1>
        <p>Watch and listen to our latest messages</p>
      </ScrollReveal>

      <div className="sermon-content">
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          groupBy={groupBy}
          onGroupByChange={setGroupBy}
          totalResults={paginatedGroups.totalResults}
        />

        <ScrollReveal className="sermon-grid">
          {Object.entries(groupedSermons).map(
            ([groupTitle, sermonsInGroup]) => (
              <div key={groupTitle}>
                {groupBy !== "none" && (
                  <GroupHeader
                    title={groupTitle}
                    count={sermonsInGroup.length}
                  />
                )}
                {sermonsInGroup.map((sermon) => (
                  <SermonCard key={sermon.id} {...sermon} />
                ))}
              </div>
            )
          )}
        </ScrollReveal>

        {paginatedGroups.sermons.length === 0 && (
          <div className="sermon-no-results">
            <p>No sermons found matching your search criteria.</p>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={paginatedGroups.totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default SermonPage;

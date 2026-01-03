import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FeaturedSermonCard from "../components/FeaturedSermonCard";
import IndividualSermonCard from "../components/IndividualSermonCard";
import SermonFilter from "../components/SermonFilter";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";
import { sermonsAPI, Sermon } from "../services/api";
import sermonCardImg from "../assets/sermonCardImg.svg";
import "./SermonSeriesDetail.css";

const SermonSeriesDetail: React.FC = () => {
  const { seriesId } = useParams<{ seriesId: string }>();
  const navigate = useNavigate();
  const [selectedSpeaker, setSelectedSpeaker] = useState("All Speakers");
  const [currentPage, setCurrentPage] = useState(1);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 6; // Show 6 sermons per page

  const loadSermons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all sermons and filter by series
      const allSermons = await sermonsAPI.getAll({ status: "PUBLISHED", isPublic: "true" });
      
      // Filter by series - match seriesId to series name
      const seriesSermons = allSermons.filter((sermon) => {
        if (!sermon.series) {
          return seriesId === "standalone-sermons";
        }
        // Convert series name to ID format and compare
        const sermonSeriesId = sermon.series.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        return sermonSeriesId === seriesId?.toLowerCase();
      });

      if (seriesSermons.length === 0) {
        setError("Series not found");
        return;
      }

      // Sort by date (newest first)
      seriesSermons.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setSermons(seriesSermons);
    } catch (err: any) {
      console.error("Error loading sermon series:", err);
      setError(err.message || "Failed to load sermon series");
    } finally {
      setLoading(false);
    }
  }, [seriesId]);

  useEffect(() => {
    if (seriesId) {
      loadSermons();
    }
  }, [seriesId, loadSermons]);

  // Get unique speakers
  const speakers = useMemo(() => {
    const uniqueSpeakers = Array.from(new Set(sermons.map((s) => s.speaker)));
    return ["All Speakers", ...uniqueSpeakers];
  }, [sermons]);

  // Get featured sermon (most recent or first one)
  const featuredSermon = useMemo(() => {
    if (sermons.length === 0) return null;
    return sermons[0]; // Already sorted by date, newest first
  }, [sermons]);

  const filteredSermons = useMemo(() => {
    if (selectedSpeaker === "All Speakers") {
      return sermons;
    }
    return sermons.filter((sermon) => sermon.speaker === selectedSpeaker);
  }, [sermons, selectedSpeaker]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredSermons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSermons = filteredSermons.slice(startIndex, endIndex);

  const handleSpeakerChange = (speaker: string) => {
    setSelectedSpeaker(speaker);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleReset = () => {
    setSelectedSpeaker("All Speakers");
    setCurrentPage(1); // Reset to first page when filter resets
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of sermons grid when page changes
    const gridElement = document.querySelector(".sermons-grid") as HTMLElement;
    if (gridElement) {
      window.scrollTo({
        top: gridElement.offsetTop,
        behavior: "smooth",
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" });
  };

  if (loading) {
    return (
      <div className="sermon-series-detail-page">
        <div className="container" style={{ padding: "4rem", textAlign: "center" }}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || sermons.length === 0) {
    return (
      <div className="sermon-series-detail-page">
        <div className="container">
          <div className="error-message">
            <h1>Series Not Found</h1>
            <p>The sermon series you're looking for doesn't exist.</p>
            <button onClick={() => navigate("/sermon")} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
              Back to Sermons
            </button>
          </div>
        </div>
      </div>
    );
  }

  const seriesTitle = sermons[0]?.series || "Standalone Sermons";

  return (
    <div className="sermon-series-detail-page">
      <div className="container">
        {/* Series Header */}
        <div className="series-header">
          <div className="series-label">SERMON SERIES</div>
          <h1 className="series-title">{seriesTitle}</h1>
        </div>

        {/* Featured Sermon */}
        {featuredSermon && (
          <FeaturedSermonCard
            image={featuredSermon.thumbnail || sermonCardImg}
            title={featuredSermon.title}
            subtitle={featuredSermon.description || ""}
            passage={featuredSermon.passage || ""}
            speaker={featuredSermon.speaker}
            date={formatDate(featuredSermon.date)}
            link={featuredSermon.videoUrl || featuredSermon.audioUrl || "#"}
          />
        )}

        {/* Filter Section */}
        {speakers.length > 2 && (
          <SermonFilter
            speakers={speakers}
            selectedSpeaker={selectedSpeaker}
            onSpeakerChange={handleSpeakerChange}
            onReset={handleReset}
          />
        )}

        {/* Sermons Grid */}
        <div className="sermons-grid">
          {paginatedSermons.map((sermon, index) => (
            <IndividualSermonCard
              key={sermon.id}
              image={sermon.thumbnail || sermonCardImg}
              title={sermon.title}
              subtitle={sermon.description || ""}
              speaker={sermon.speaker}
              date={formatDate(sermon.date)}
              link={sermon.videoUrl || sermon.audioUrl || "#"}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            showFirstLast={true}
            maxVisiblePages={5}
          />
        )}
      </div>
    </div>
  );
};

export default SermonSeriesDetail;

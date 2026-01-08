import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import SermonCard from "../components/SermonCard";
import SermonCardSkeleton from "../components/SermonCardSkeleton";
import Pagination from "../components/Pagination";
import PageContainer from "../components/PageContainer";
import { sermonsAPI, Sermon } from "../services/api";
import crossMountain from "../assets/crosss-mountain.png";
import "./Sermon.css";

interface SermonSeries {
  id: string;
  seriesName: string;
  latestSermon: Sermon;
  episodeCount: number;
}

const SermonPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"series" | "all">("series");
  const [currentPage, setCurrentPage] = useState(1);
  const [sermonSeries, setSermonSeries] = useState<SermonSeries[]>([]);
  const [allSermons, setAllSermons] = useState<Sermon[]>([]);
  const [filteredSeries, setFilteredSeries] = useState<SermonSeries[]>([]);
  const [filteredSermons, setFilteredSermons] = useState<Sermon[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 8; // Show 8 items per page

  const loadSermons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const sermons = await sermonsAPI.getAll({
        status: "PUBLISHED",
        isPublic: "true",
      });

      // Group sermons by series
      const seriesMap = new Map<string, Sermon[]>();
      sermons.forEach((sermon) => {
        const seriesName = sermon.series || "Standalone Sermons";
        if (!seriesMap.has(seriesName)) {
          seriesMap.set(seriesName, []);
        }
        seriesMap.get(seriesName)!.push(sermon);
      });

      // Convert to series array with latest sermon
      const seriesArray: SermonSeries[] = Array.from(seriesMap.entries()).map(
        ([seriesName, seriesSermons]) => {
          // Sort sermons by date (newest first)
          const sortedSermons = [...seriesSermons].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          // Create a clean ID from series name
          const seriesId =
            seriesName === "Standalone Sermons"
              ? "standalone-sermons"
              : seriesName
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "");

          return {
            id: seriesId,
            seriesName: seriesName,
            latestSermon: sortedSermons[0], // Get the most recent sermon
            episodeCount: seriesSermons.length,
          };
        }
      );

      // Sort by latest sermon date (most recent first)
      seriesArray.sort(
        (a, b) =>
          new Date(b.latestSermon.date).getTime() -
          new Date(a.latestSermon.date).getTime()
      );

      // Sort all sermons by date (newest first)
      const sortedSermons = sermons.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setSermonSeries(seriesArray);
      setFilteredSeries(seriesArray);
      setAllSermons(sortedSermons);
      setFilteredSermons(sortedSermons);
    } catch (err: any) {
      console.error("Error loading sermons:", err);
      setError(err.message || "Failed to load sermons");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSermons();
  }, [loadSermons]);

  // Filter based on search query and view mode
  useEffect(() => {
    if (viewMode === "series") {
      if (!searchQuery.trim()) {
        setFilteredSeries(sermonSeries);
      } else {
        const filtered = sermonSeries.filter(
          (series) =>
            series.seriesName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            series.latestSermon.title
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            series.latestSermon.speaker
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        );
        setFilteredSeries(filtered);
      }
    } else {
      if (!searchQuery.trim()) {
        setFilteredSermons(allSermons);
      } else {
        const filtered = allSermons.filter(
          (sermon) =>
            sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sermon.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (sermon.series &&
              sermon.series
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) ||
            (sermon.passage &&
              sermon.passage.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredSermons(filtered);
      }
    }
    setCurrentPage(1); // Reset to first page when filtering or switching views
  }, [searchQuery, sermonSeries, allSermons, viewMode]);

  // Calculate pagination based on view mode
  const totalPages =
    viewMode === "series"
      ? Math.ceil(filteredSeries.length / itemsPerPage)
      : Math.ceil(filteredSermons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSeries = filteredSeries.slice(startIndex, endIndex);
  const paginatedSermons = filteredSermons.slice(startIndex, endIndex);

  const handleSeriesClick = (seriesId: string) => {
    navigate(`/sermon/${seriesId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of content when page changes
    const contentElement = document.querySelector(
      ".sermon-content-section"
    ) as HTMLElement;
    if (contentElement) {
      window.scrollTo({
        top: contentElement.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  const handleViewModeChange = (mode: "series" | "all") => {
    setViewMode(mode);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="sermon-page">
          <HeroSection
            title="SERMON SERIES"
            subtitle="EXPLORE GOD'S WORD"
            description="Discover inspiring messages and biblical teachings from our weekly services and special series"
            backgroundImage={`url(${crossMountain})`}
            variant="centered"
          />
          <section className="sermon-series-section">
            <div className="container">
              <div className="sermon-series-grid">
                <SermonCardSkeleton />
                <SermonCardSkeleton />
                <SermonCardSkeleton />
                <SermonCardSkeleton />
              </div>
            </div>
          </section>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="sermon-page">
          <HeroSection
            title="SERMON SERIES"
            subtitle="EXPLORE GOD'S WORD"
            description="Discover inspiring messages and biblical teachings from our weekly services and special series"
            backgroundImage={`url(${crossMountain})`}
            variant="centered"
          />
          <section className="sermon-series-section">
            <div className="container">
              <div
                style={{
                  padding: "3rem",
                  textAlign: "center",
                  color: "var(--color-error)",
                }}
              >
                <p>{error}</p>
                <p
                  style={{
                    marginTop: "1rem",
                    color: "var(--color-muted-gray)",
                  }}
                >
                  Please try again later.
                </p>
              </div>
            </div>
          </section>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="sermon-page">
        {/* Hero Section */}
        <HeroSection
          title="SERMON SERIES"
          subtitle="EXPLORE GOD'S WORD"
          description="Discover inspiring messages and biblical teachings from our weekly services and special series"
          backgroundImage={`url(${crossMountain})`}
          variant="centered"
        />

        {/* Sermon Content Section */}
        <section className="sermon-series-section sermon-content-section">
          <div className="container">
            {/* View Mode Toggle */}
            <div className="sermon-view-toggle">
              <button
                className={`sermon-view-button ${
                  viewMode === "series" ? "active" : ""
                }`}
                onClick={() => handleViewModeChange("series")}
                aria-label="View sermon series"
              >
                SERMON SERIES ({sermonSeries.length})
              </button>
              <button
                className={`sermon-view-button ${
                  viewMode === "all" ? "active" : ""
                }`}
                onClick={() => handleViewModeChange("all")}
                aria-label="View all sermons"
              >
                ALL SERMONS ({allSermons.length})
              </button>
            </div>

            {/* Section Header */}
            <div className="section-header">
              <div className="section-label">
                {viewMode === "series" ? "SERMON SERIES" : "ALL SERMONS"}
              </div>
              <h2 className="section-title">
                {viewMode === "series"
                  ? `Browse ${sermonSeries.length} Sermon Series`
                  : `Browse ${allSermons.length} Sermons`}
              </h2>
              <p className="section-description">
                {viewMode === "series"
                  ? "Explore our collection of sermon series"
                  : "Browse all individual sermons"}
              </p>
            </div>

            {/* Search */}
            {(sermonSeries.length > 0 || allSermons.length > 0) && (
              <div className="sermon-search-container">
                <input
                  type="text"
                  className="sermon-search-input"
                  placeholder={
                    viewMode === "series"
                      ? "Search sermon series..."
                      : "Search sermons..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label={
                    viewMode === "series"
                      ? "Search sermon series"
                      : "Search sermons"
                  }
                />
                {searchQuery && (
                  <button
                    className="sermon-search-clear"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            {(viewMode === "series" && filteredSeries.length === 0) ||
            (viewMode === "all" && filteredSermons.length === 0) ? (
              <div
                style={{
                  padding: "3rem",
                  textAlign: "center",
                  color: "var(--color-muted-gray)",
                }}
              >
                <p>
                  No {viewMode === "series" ? "sermon series" : "sermons"} match
                  your search.
                </p>
                <button
                  className="btn-primary"
                  onClick={() => setSearchQuery("")}
                  style={{ marginTop: "1rem" }}
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <>
                <div className="sermon-series-grid">
                  {viewMode === "series"
                    ? paginatedSeries.map((series) => (
                        <SermonCard
                          key={series.id}
                          title={series.seriesName}
                          series={series.seriesName}
                          speaker={series.latestSermon.speaker}
                          date={series.latestSermon.date}
                          passage={series.latestSermon.passage}
                          videoUrl={series.latestSermon.videoUrl}
                          audioUrl={series.latestSermon.audioUrl}
                          isSeries={true}
                          episodeCount={series.episodeCount}
                          onClick={() => handleSeriesClick(series.id)}
                        />
                      ))
                    : paginatedSermons.map((sermon) => (
                        <SermonCard
                          key={sermon.id}
                          title={sermon.title}
                          series={sermon.series}
                          speaker={sermon.speaker}
                          date={sermon.date}
                          passage={sermon.passage}
                          videoUrl={sermon.videoUrl}
                          audioUrl={sermon.audioUrl}
                          isSeries={false}
                          onClick={() => {
                            if (sermon.series) {
                              const seriesId = sermon.series
                                .toLowerCase()
                                .replace(/\s+/g, "-")
                                .replace(/[^a-z0-9-]/g, "");
                              navigate(`/sermon/${seriesId}`);
                            }
                          }}
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
              </>
            )}
          </div>
        </section>
      </div>
    </PageContainer>
  );
};

export default SermonPage;

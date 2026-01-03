import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import SermonSeriesCard from "../components/SermonSeriesCard";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";
import { sermonsAPI, Sermon } from "../services/api";
import sermonCardImg from "../assets/sermonCardImg.svg";
import crossMountain from "../assets/crosss-mountain.png";
import "./Sermon.css";

interface SermonSeries {
  id: string;
  title: string;
  episodeCount: number;
  image: string;
  link: string;
}

const SermonPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [sermonSeries, setSermonSeries] = useState<SermonSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 8; // Show 8 series per page

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

      // Convert to series array
      const seriesArray: SermonSeries[] = Array.from(seriesMap.entries()).map(
        ([seriesName, seriesSermons]) => {
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
            title: seriesName,
            episodeCount: seriesSermons.length,
            image: sermonCardImg,
            link: `/sermon/${seriesId}`,
          };
        }
      );

      // Sort by episode count (most sermons first)
      seriesArray.sort((a, b) => b.episodeCount - a.episodeCount);

      setSermonSeries(seriesArray);
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

  // Calculate pagination
  const totalPages = Math.ceil(sermonSeries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSeries = sermonSeries.slice(startIndex, endIndex);

  const handleSeriesClick = (seriesId: string) => {
    navigate(`/sermon/${seriesId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of series grid when page changes
    const gridElement = document.querySelector(
      ".sermon-series-grid"
    ) as HTMLElement;
    if (gridElement) {
      window.scrollTo({
        top: gridElement.offsetTop,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="sermon-page">
        <HeroSection
          title="SERMON SERIES"
          subtitle="EXPLORE GOD'S WORD"
          description="Discover inspiring messages and biblical teachings from our weekly services and special series"
          backgroundImage={`url(${crossMountain})`}
          variant="centered"
        />
        <div style={{ padding: "4rem", textAlign: "center" }}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sermon-page">
        <HeroSection
          title="SERMON SERIES"
          subtitle="EXPLORE GOD'S WORD"
          description="Discover inspiring messages and biblical teachings from our weekly services and special series"
          backgroundImage={`url(${crossMountain})`}
          variant="centered"
        />
        <div style={{ padding: "4rem", textAlign: "center" }}>
          <p style={{ color: "red" }}>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sermon-page">
      {/* Hero Section */}
      <HeroSection
        title="SERMON SERIES"
        subtitle="EXPLORE GOD'S WORD"
        description="Discover inspiring messages and biblical teachings from our weekly services and special series"
        backgroundImage={`url(${crossMountain})`}
        variant="centered"
      />

      {/* Sermon Series Section */}
      <section className="sermon-series-section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">SERMON SERIES</div>
            <h2 className="section-title">Browse Sermon Series</h2>
          </div>

          {sermonSeries.length === 0 ? (
            <p style={{ textAlign: "center", padding: "2rem" }}>
              No sermon series found.
            </p>
          ) : (
            <>
              <div className="sermon-series-grid">
                {paginatedSeries.map((series, index) => (
                  <div
                    key={series.id}
                    onClick={() => handleSeriesClick(series.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <SermonSeriesCard
                      image={series.image}
                      title={series.title}
                      episodeCount={series.episodeCount}
                      link={series.link}
                    />
                  </div>
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
  );
};

export default SermonPage;

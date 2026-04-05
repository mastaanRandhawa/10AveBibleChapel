import React, { useState, useEffect, useCallback, useMemo } from "react";
import HeroSection from "../components/HeroSection";
import VoiceRecordingCard from "../components/VoiceRecordingCard";
import PageContainer from "../components/PageContainer";
import Pagination from "../components/Pagination";
import { ScrollReveal } from "../components/ScrollReveal";
import { voiceRecordingsAPI, VoiceRecording } from "../services/api";
import prayingImage from "../assets/praying.jpg";
import "./VoiceRecordings.css";

const ITEMS_PER_PAGE = 8;

const VoiceRecordingsPage: React.FC = () => {
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const loadRecordings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await voiceRecordingsAPI.getAll({
        status: "PUBLISHED",
        isPublic: "true",
      });
      setRecordings(data);
    } catch (err: any) {
      setError(err.message || "Failed to load recordings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecordings();
  }, [loadRecordings]);

  const categories = useMemo(() => {
    const cats = recordings
      .map((r) => r.category)
      .filter((c): c is string => Boolean(c));
    return ["all", ...Array.from(new Set(cats))];
  }, [recordings]);

  const filtered = useMemo(() => {
    let list = [...recordings];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.speaker.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q)) ||
          (r.passage && r.passage.toLowerCase().includes(q))
      );
    }
    if (categoryFilter !== "all") {
      list = list.filter((r) => r.category === categoryFilter);
    }
    return list;
  }, [recordings, searchQuery, categoryFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const featuredRecordings = useMemo(
    () => recordings.filter((r) => r.isFeatured).slice(0, 3),
    [recordings]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setCategoryFilter(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const el = document.querySelector(".vr-grid") as HTMLElement;
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  };

  return (
    <PageContainer>
      <div className="vr-page">
        <HeroSection
          title="VOICE RECORDINGS"
          subtitle="LISTEN & GROW"
          description="Audio messages, devotionals, and teachings from our church community"
          backgroundImage={`url(${prayingImage})`}
          variant="centered"
        />

        <div className="vr-page__body">
          {/* Featured Section */}
          {!loading && featuredRecordings.length > 0 && (
            <ScrollReveal className="vr-featured-section">
              <div className="vr-section-header">
                <p className="vr-section-label">FEATURED</p>
                <h2 className="vr-section-title">Featured Recordings</h2>
                <div className="vr-section-accent" />
              </div>
              <div className="vr-featured-grid">
                {featuredRecordings.map((r) => (
                  <VoiceRecordingCard key={r.id} recording={r} />
                ))}
              </div>
            </ScrollReveal>
          )}

          {/* Search & Filter */}
          <ScrollReveal className="vr-controls-section">
            <div className="vr-controls">
              <input
                type="text"
                className="vr-search"
                placeholder="Search recordings, speakers, passages…"
                value={searchQuery}
                onChange={handleSearch}
                aria-label="Search recordings"
              />
              <div className="vr-category-tabs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`vr-category-btn ${categoryFilter === cat ? "active" : ""}`}
                    onClick={() => handleCategoryChange(cat)}
                    type="button"
                  >
                    {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* All Recordings */}
          <div className="vr-section-header">
            <p className="vr-section-label">LISTEN</p>
            <h2 className="vr-section-title">All Recordings</h2>
            <div className="vr-section-accent" />
          </div>

          {loading ? (
            <div className="vr-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="vr-skeleton" aria-hidden="true">
                  <div className="vr-skeleton__label" />
                  <div className="vr-skeleton__title" />
                  <div className="vr-skeleton__accent" />
                  <div className="vr-skeleton__meta" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="vr-error">
              <h3>Unable to load recordings</h3>
              <p>{error}</p>
              <button className="vr-retry-btn" onClick={loadRecordings}>
                Try Again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="vr-empty">
              {recordings.length === 0 ? (
                <>
                  <span className="vr-empty__icon">🎙</span>
                  <h3>No Recordings Yet</h3>
                  <p>Check back soon — recordings will appear here once published.</p>
                </>
              ) : (
                <>
                  <span className="vr-empty__icon">🔍</span>
                  <h3>No Matching Recordings</h3>
                  <p>Try a different search or category.</p>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="vr-grid">
                {paginated.map((r) => (
                  <VoiceRecordingCard key={r.id} recording={r} />
                ))}
              </div>
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
      </div>
    </PageContainer>
  );
};

export default VoiceRecordingsPage;

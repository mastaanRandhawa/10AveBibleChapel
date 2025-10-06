import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import SermonSeriesCard from "../components/SermonSeriesCard";
import Pagination from "../components/Pagination";
import sermonCardImg from "../assets/sermonCardImg.svg";
import "./Sermon.css";

// Mock data for sermon series
const SERMON_SERIES = [
  {
    id: "relationships-anonymous",
    title: "Relationships Anonymous",
    episodeCount: 4,
    image: sermonCardImg,
    link: "/sermon/relationships-anonymous",
  },
  {
    id: "romans",
    title: "Romans",
    episodeCount: 11,
    image: sermonCardImg,
    link: "/sermon/romans",
  },
  {
    id: "bigger-than-us",
    title: "Bigger Than Us",
    episodeCount: 12,
    image: sermonCardImg,
    link: "/sermon/bigger-than-us",
  },
  {
    id: "follow-me",
    title: "Follow Me",
    episodeCount: 4,
    image: sermonCardImg,
    link: "/sermon/follow-me",
  },
  {
    id: "a-great-light",
    title: "A Great Light",
    episodeCount: 3,
    image: sermonCardImg,
    link: "/sermon/a-great-light",
  },
  {
    id: "the-exodus",
    title: "The Exodus",
    episodeCount: 8,
    image: sermonCardImg,
    link: "/sermon/the-exodus",
  },
  {
    id: "beyond",
    title: "Beyond",
    episodeCount: 6,
    image: sermonCardImg,
    link: "/sermon/beyond",
  },
  {
    id: "recapturing-humanity",
    title: "Recapturing Humanity",
    episodeCount: 7,
    image: sermonCardImg,
    link: "/sermon/recapturing-humanity",
  },
  {
    id: "faith-journey",
    title: "Faith Journey",
    episodeCount: 9,
    image: sermonCardImg,
    link: "/sermon/faith-journey",
  },
  {
    id: "hope-restored",
    title: "Hope Restored",
    episodeCount: 5,
    image: sermonCardImg,
    link: "/sermon/hope-restored",
  },
  {
    id: "love-unconditional",
    title: "Love Unconditional",
    episodeCount: 6,
    image: sermonCardImg,
    link: "/sermon/love-unconditional",
  },
  {
    id: "grace-abundant",
    title: "Grace Abundant",
    episodeCount: 8,
    image: sermonCardImg,
    link: "/sermon/grace-abundant",
  },
  {
    id: "peace-that-passes",
    title: "Peace That Passes",
    episodeCount: 4,
    image: sermonCardImg,
    link: "/sermon/peace-that-passes",
  },
  {
    id: "joy-unspeakable",
    title: "Joy Unspeakable",
    episodeCount: 7,
    image: sermonCardImg,
    link: "/sermon/joy-unspeakable",
  },
  {
    id: "victory-assured",
    title: "Victory Assured",
    episodeCount: 10,
    image: sermonCardImg,
    link: "/sermon/victory-assured",
  },
  {
    id: "eternal-life",
    title: "Eternal Life",
    episodeCount: 6,
    image: sermonCardImg,
    link: "/sermon/eternal-life",
  },
  {
    id: "kingdom-come",
    title: "Kingdom Come",
    episodeCount: 5,
    image: sermonCardImg,
    link: "/sermon/kingdom-come",
  },
  {
    id: "new-creation",
    title: "New Creation",
    episodeCount: 8,
    image: sermonCardImg,
    link: "/sermon/new-creation",
  },
  {
    id: "divine-purpose",
    title: "Divine Purpose",
    episodeCount: 9,
    image: sermonCardImg,
    link: "/sermon/divine-purpose",
  },
  {
    id: "heavenly-call",
    title: "Heavenly Call",
    episodeCount: 7,
    image: sermonCardImg,
    link: "/sermon/heavenly-call",
  },
];

const SermonPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Show 8 series per page

  // Calculate pagination
  const totalPages = Math.ceil(SERMON_SERIES.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSeries = SERMON_SERIES.slice(startIndex, endIndex);

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

  return (
    <div className="sermon-page">
      {/* Hero Section */}
      <HeroSection title="SERMON SERIES" variant="simple" />

      {/* Sermon Series Section */}
      <section className="sermon-series-section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">SERMON SERIES</div>
            <h2 className="section-title">Browse Sermon Series</h2>
          </div>

          <div className="sermon-series-grid">
            {paginatedSeries.map((series, index) => (
              <div
                key={startIndex + index}
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            showFirstLast={true}
            maxVisiblePages={5}
          />
        </div>
      </section>
    </div>
  );
};

export default SermonPage;

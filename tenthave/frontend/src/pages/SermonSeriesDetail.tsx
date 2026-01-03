import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import FeaturedSermonCard from "../components/FeaturedSermonCard";
import IndividualSermonCard from "../components/IndividualSermonCard";
import SermonFilter from "../components/SermonFilter";
import Pagination from "../components/Pagination";
import sermonCardImg from "../assets/sermonCardImg.svg";
import "./SermonSeriesDetail.css";

// Mock data for sermon series
const SERMON_SERIES_DATA = {
  "bigger-than-us": {
    id: "bigger-than-us",
    title: "Bigger Than Us",
    description:
      "A series exploring how God's plan is bigger than our individual stories",
    featuredSermon: {
      image: sermonCardImg,
      title: "BEST IS YET TO COME",
      subtitle: "A Future Bigger Than Us",
      passage: "Hebrews 11:8-10",
      speaker: "Finu type",
      date: "06.01.25",
      link: "#",
    },
    sermons: [
      {
        image: sermonCardImg,
        title: "LIVE A BIGGER STORY",
        subtitle: "A Story That's Bigger Than Us",
        speaker: "Finu type",
        date: "05.04.25",
        link: "#",
      },
      {
        image: sermonCardImg,
        title: "NOTHING IS TOO BIG",
        subtitle: "A God Who's Bigger than Us",
        speaker: "Finu type",
        date: "05.11.25",
        link: "#",
      },
      {
        image: sermonCardImg,
        title: "THIS IS WHY WE GO",
        subtitle: "A Mission Bigger Than Us",
        speaker: "Chris de Mony",
        date: "05.18.25",
        link: "#",
      },
      {
        image: sermonCardImg,
        title: "LEGACY STARTS NOW",
        subtitle: "A Legacy Bigger Than Us",
        speaker: "Finu lypa",
        date: "05.25.25",
        link: "#",
      },
      {
        image: sermonCardImg,
        title: "BEST IS YET TO COME",
        subtitle: "A Future Bigger Than Us",
        speaker: "Finu lype",
        date: "06.01.25",
        link: "#",
      },
      {
        image: sermonCardImg,
        title: "FAITH BEYOND FEAR",
        subtitle: "Trusting in God's Plan",
        speaker: "Finu type",
        date: "06.08.25",
        link: "#",
      },
      {
        image: sermonCardImg,
        title: "HOPE IN THE DARKNESS",
        subtitle: "Finding Light in Difficult Times",
        speaker: "Chris de Mony",
        date: "06.15.25",
        link: "#",
      },
      {
        image: sermonCardImg,
        title: "LOVE WITHOUT LIMITS",
        subtitle: "God's Unconditional Love",
        speaker: "Finu lypa",
        date: "06.22.25",
        link: "#",
      },
      {
        image: sermonCardImg,
        title: "GRACE THAT TRANSFORMS",
        subtitle: "The Power of God's Grace",
        speaker: "Finu lype",
        date: "06.29.25",
        link: "#",
      },
      {
        image: sermonCardImg,
        title: "PURPOSE IN THE PAIN",
        subtitle: "Finding Meaning in Suffering",
        speaker: "Finu type",
        date: "07.06.25",
        link: "#",
      },
      {
        image: sermonCardImg,
        title: "VICTORY IN CHRIST",
        subtitle: "Overcoming Through Faith",
        speaker: "Chris de Mony",
        date: "07.13.25",
        link: "#",
      },
      {
        image: sermonCardImg,
        title: "ETERNAL PERSPECTIVE",
        subtitle: "Living for What Matters Most",
        speaker: "Finu lypa",
        date: "07.20.25",
        link: "#",
      },
    ],
    speakers: [
      "All Speakers",
      "Finu type",
      "Chris de Mony",
      "Finu lypa",
      "Finu lype",
    ],
  },
  "relationships-anonymous": {
    id: "relationships-anonymous",
    title: "Relationships Anonymous",
    description: "Exploring healthy relationships and community",
    featuredSermon: {
      image: sermonCardImg,
      title: "LOVE WITHOUT CONDITIONS",
      subtitle: "Building Healthy Relationships",
      passage: "1 Corinthians 13:4-7",
      speaker: "Pastor John",
      date: "04.15.25",
      link: "#",
    },
    sermons: [
      {
        image: sermonCardImg,
        title: "LOVE WITHOUT CONDITIONS",
        subtitle: "Building Healthy Relationships",
        speaker: "Pastor John",
        date: "04.15.25",
        link: "#",
      },
      {
        image: sermonCardImg,
        title: "FORGIVENESS FIRST",
        subtitle: "The Foundation of Strong Relationships",
        speaker: "Pastor John",
        date: "04.22.25",
        link: "#",
      },
      {
        image: sermonCardImg,
        title: "COMMUNITY MATTERS",
        subtitle: "Finding Your People",
        speaker: "Pastor Sarah",
        date: "04.29.25",
        link: "#",
      },
      {
        image: sermonCardImg,
        title: "BOUNDARIES & BALANCE",
        subtitle: "Healthy Limits in Relationships",
        speaker: "Pastor John",
        date: "05.06.25",
        link: "#",
      },
    ],
    speakers: ["All Speakers", "Pastor John", "Pastor Sarah"],
  },
};

const SermonSeriesDetail: React.FC = () => {
  const { seriesId } = useParams<{ seriesId: string }>();
  const [selectedSpeaker, setSelectedSpeaker] = useState("All Speakers");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Show 6 sermons per page

  const series = seriesId
    ? SERMON_SERIES_DATA[seriesId as keyof typeof SERMON_SERIES_DATA]
    : null;

  const filteredSermons = useMemo(() => {
    if (!series) return [];

    if (selectedSpeaker === "All Speakers") {
      return series.sermons;
    }

    return series.sermons.filter(
      (sermon) => sermon.speaker === selectedSpeaker
    );
  }, [series, selectedSpeaker]);

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

  if (!series) {
    return (
      <div className="sermon-series-detail-page">
        <div className="container">
          <div className="error-message">
            <h1>Series Not Found</h1>
            <p>The sermon series you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sermon-series-detail-page">
      <div className="container">
        {/* Series Header */}
        <div className="series-header">
          <div className="series-label">SERMON SERIES</div>
          <h1 className="series-title">{series.title}</h1>
        </div>

        {/* Featured Sermon */}
        <FeaturedSermonCard
          image={series.featuredSermon.image}
          title={series.featuredSermon.title}
          subtitle={series.featuredSermon.subtitle}
          passage={series.featuredSermon.passage}
          speaker={series.featuredSermon.speaker}
          date={series.featuredSermon.date}
          link={series.featuredSermon.link}
        />

        {/* Filter Section */}
        <SermonFilter
          speakers={series.speakers}
          selectedSpeaker={selectedSpeaker}
          onSpeakerChange={handleSpeakerChange}
          onReset={handleReset}
        />

        {/* Sermons Grid */}
        <div className="sermons-grid">
          {paginatedSermons.map((sermon, index) => (
            <IndividualSermonCard
              key={startIndex + index}
              image={sermon.image}
              title={sermon.title}
              subtitle={sermon.subtitle}
              speaker={sermon.speaker}
              date={sermon.date}
              link={sermon.link}
            />
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
    </div>
  );
};

export default SermonSeriesDetail;

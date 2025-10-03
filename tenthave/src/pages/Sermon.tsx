import React from "react";
import SermonHeroSection from "../components/SermonHeroSection";
import UpcomingSermonCard from "../components/UpcomingSermonCard";
import RecentSermonCard from "../components/RecentSermonCard";
import ShowAllButton from "../components/ShowAllButton";
import "./Sermon.css";

// Mock data for upcoming sermon
const UPCOMING_SERMON = {
  title: "WATCH AND LISTEN TO OUR SERMONS",
  description: "Join us in person or online through our sermons.",
  time: "Sunday 11:30 AM - 12:30 PM",
  location: "7103 - 10th Ave., Burnaby, BC V3N 2R5",
};

// Mock data for recent sermons
const RECENT_SERMONS = [
  {
    date: "20 JULY",
    title: "100 RANDOM ACTS OF KINDNESS",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    time: "Friday 23:39 IST Saturday 11:20 ISD",
    location: "No 233 Main St. New York, United States",
  },
  {
    date: "20 JULY",
    title: "FAITH IS A PROCESS, NOT A DESTINATION",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    time: "Friday 23:39 IST Saturday 11:20 ISD",
    location: "No 233 Main St. New York, United States",
  },
  {
    date: "20 JULY",
    title: "THERE IS NOTHING IMPOSSIBLE",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    time: "Friday 23:39 IST Saturday 11:20 ISD",
    location: "No 233 Main St. New York, United States",
  },
  {
    date: "20 JULY",
    title: "WATCH AND LISTEN TO OUR SERMONS",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    time: "Friday 23:39 IST Saturday 11:20 ISD",
    location: "No 233 Main St. New York, United States",
  },
];

const SermonPage: React.FC = () => {
  const handleWatchClick = () => {
    // Handle watch button click
    console.log("Watch button clicked");
  };

  const handleShowAllClick = () => {
    // Handle show all sermons click
    console.log("Show all sermons clicked");
  };

  return (
    <div className="sermon-page">
      {/* Hero Section */}
      <SermonHeroSection title="SERMON RECORDINGS" />

      {/* Upcoming Sermons Section */}
      <section className="upcoming-sermons-section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">UPCOMING SERMONS</div>
            <h2 className="section-title">
              JOIN US AND BECOME PART OF SOMETHING GREAT
            </h2>
          </div>

          <div className="upcoming-sermons-content">
            <div className="upcoming-sermons-left">
              <UpcomingSermonCard
                title={UPCOMING_SERMON.title}
                description={UPCOMING_SERMON.description}
                time={UPCOMING_SERMON.time}
                location={UPCOMING_SERMON.location}
                buttonText="WATCH"
                onButtonClick={handleWatchClick}
              />
            </div>

            <div className="upcoming-sermons-right">
              <div className="bible-image">
                <img
                  src="/assets/bible.svg"
                  alt="Hands holding Bible"
                  className="bible-image__img"
                />
              </div>
            </div>
          </div>

          <div className="show-all-container">
            <ShowAllButton
              text="SHOW ALL SERMONS"
              onClick={handleShowAllClick}
            />
          </div>
        </div>
      </section>

      {/* Recent Sermons Section */}
      <section className="recent-sermons-section">
        <div className="container">
          <h2 className="section-title">RECENT SERMONS</h2>

          <div className="recent-sermons-grid">
            {RECENT_SERMONS.map((sermon, index) => (
              <RecentSermonCard
                key={index}
                date={sermon.date}
                title={sermon.title}
                description={sermon.description}
                time={sermon.time}
                location={sermon.location}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SermonPage;

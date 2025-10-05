import React from "react";
import SermonHeroSection from "../components/SermonHeroSection";
import SermonCard from "../components/SermonCard";
import ShowAllButton from "../components/ShowAllButton";
import sermonCardImg from "../assets/sermonCardImg.svg";
import "./Sermon.css";

// Mock data for upcoming sermon
const UPCOMING_SERMON = {
  title: "WATCH AND LISTEN TO OUR SERMONS",
  description: "Join us in person or online through our sermons.",
  time: { day: "Sunday", start: "11:30 AM", end: "12:30 PM" },
  location: "7103 - 10th Ave., Burnaby, BC V3N 2R5",
  date: "2024-01-21",
};

// Mock data for recent sermons
const RECENT_SERMONS = [
  {
    title: "100 RANDOM ACTS OF KINDNESS",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    time: { day: "Friday", start: "23:39 IST", end: "Saturday 11:20 ISD" },
    location: "No 233 Main St. New York, United States",
    date: "2024-07-20",
  },
  {
    title: "FAITH IS A PROCESS, NOT A DESTINATION",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    time: { day: "Friday", start: "23:39 IST", end: "Saturday 11:20 ISD" },
    location: "No 233 Main St. New York, United States",
    date: "2024-07-20",
  },
  {
    title: "THERE IS NOTHING IMPOSSIBLE",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    time: { day: "Friday", start: "23:39 IST", end: "Saturday 11:20 ISD" },
    location: "No 233 Main St. New York, United States",
    date: "2024-07-20",
  },
  {
    title: "WATCH AND LISTEN TO OUR SERMONS",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    time: { day: "Friday", start: "23:39 IST", end: "Saturday 11:20 ISD" },
    location: "No 233 Main St. New York, United States",
    date: "2024-07-20",
  },
];

const SermonPage: React.FC = () => {
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

          <SermonCard
            name="UPCOMING EVENT"
            image={sermonCardImg}
            title={UPCOMING_SERMON.title}
            description={UPCOMING_SERMON.description}
            time={UPCOMING_SERMON.time}
            location={UPCOMING_SERMON.location}
            date={UPCOMING_SERMON.date}
            buttonText="WATCH"
            link="#"
            variant="featured"
            showTime={true}
            showLocation={true}
            showImage={true}
          />

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
              <div key={index} className="recent-sermon-item">
                <SermonCard
                  image={sermonCardImg}
                  title={sermon.title}
                  description={sermon.description}
                  time={sermon.time}
                  location={sermon.location}
                  date={sermon.date}
                  buttonText="WATCH"
                  link="#"
                  variant="compact"
                  showTime={true}
                  showLocation={true}
                  showDate={false}
                  showImage={false}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SermonPage;

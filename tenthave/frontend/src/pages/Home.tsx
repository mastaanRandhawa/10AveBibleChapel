import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import SpecialCard from "../components/SpecialCard";
import HeroSection from "../components/HeroSection";
import LocationMap from "../components/LocationMap";
import SermonCard from "../components/SermonCard";
import SermonCardSkeleton from "../components/SermonCardSkeleton";
import PageContainer from "../components/PageContainer";
import LoadingSpinner from "../components/LoadingSpinner";
import { ScrollReveal } from "../components/ScrollReveal";
import { WEEKLY_SERVICES, SPECIAL_MINISTRIES, CHURCH_INFO } from "../constants";
import { sermonsAPI, Sermon } from "../services/api";
import "./Home.css";

// Import assets
import churchTriPicture from "../assets/sunday-school.jpg";
import churchPicture from "../assets/churchPicture.svg";
// Home Hero Section Component
const HomeHeroSection: React.FC = () => (
  <HeroSection
    title="10TH AVENUE BIBLE CHAPEL"
    subtitle="WELCOME TO OUR CHURCH"
    description="A SMALL BIBLE BELIEVING CHRISTIAN FELLOWSHIP"
    showButton={true}
    buttonText="LEARN MORE"
    buttonLink="#"
    backgroundImage={`url(${churchPicture})`}
  />
);

// Weekly Services Section Component
const WeeklyServicesSection: React.FC = () => (
  <section className="weeklyServices" aria-labelledby="weekly-services-heading">
    <ScrollReveal className="textServices">
      <h2 id="weekly-services-heading">WEEKLY SERVICES</h2>
    </ScrollReveal>

    <ScrollReveal
      className="weeklyServicesCard"
      role="list"
      aria-label="Weekly church services"
    >
      {WEEKLY_SERVICES.map((service) => (
        <Card
          key={service.id}
          iconlink={service.icon}
          headingOne={service.name}
          paragraph={service.description}
          linkToService={service.zoomLink}
        />
      ))}
    </ScrollReveal>

    <ScrollReveal className="textJohn">
      <h2>{CHURCH_INFO.john316.reference}</h2>
      <blockquote cite="John 3:16">
        <p>{CHURCH_INFO.john316.verse}</p>
      </blockquote>
    </ScrollReveal>
  </section>
);

// Special Services Section Component
const SpecialServicesSection: React.FC = () => (
  <>
    <section
      className="specialServices"
      aria-labelledby="special-ministries-heading"
    >
      <img
        src={churchTriPicture}
        alt="10th Avenue Bible Chapel building exterior"
      />

      <ScrollReveal className="learnAboutUs">
        <h2>LEARN MORE ABOUT US</h2>
        <p>
          Discover our mission, values, and the community that makes 10th Avenue
          Bible Chapel a welcoming place for all who seek to grow in faith.
        </p>
      </ScrollReveal>

      <Link to="/about" aria-label="Learn more about 10th Avenue Bible Chapel">
        <Button variant="button-primary" buttonText="LEARN MORE" />
      </Link>
    </section>
    <section className="specialMinistries">
      <ScrollReveal className="specialMinistriesHeading">
        <h2 id="special-ministries-heading">SPECIAL MINISTRIES & EVENTS</h2>
      </ScrollReveal>

      <ScrollReveal
        className="specialServicesCard"
        role="list"
        aria-label="Special ministries and events"
      >
        {SPECIAL_MINISTRIES.map((ministry) => (
          <SpecialCard
            key={ministry.id}
            headingOne={ministry.name}
            paragraph={ministry.description}
            iconlink={ministry.icon}
          />
        ))}
      </ScrollReveal>
    </section>
  </>
);

// Recorded Sermons Section Component
const RecordedSermonsSection: React.FC = () => {
  const navigate = useNavigate();
  const [latestSermon, setLatestSermon] = useState<Sermon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLatestSermon = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch published and public sermons
        const sermons = await sermonsAPI.getAll({
          status: "PUBLISHED",
          isPublic: "true",
        });

        if (sermons && sermons.length > 0) {
          // Sort by date (newest first) and get the latest sermon
          const sortedSermons = sermons.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setLatestSermon(sortedSermons[0]);
        }
      } catch (err: any) {
        console.error("Error loading latest sermon:", err);
        setError(err.message || "Failed to load sermons");
      } finally {
        setLoading(false);
      }
    };

    loadLatestSermon();
  }, []);

  return (
    <section className="recordedSermon">
      <ScrollReveal className="recentSermonsHeading">
        <h2>LATEST SERMON</h2>
        <p>Join us in exploring God's word through our latest messages</p>
      </ScrollReveal>

      {loading && (
        <div style={{ padding: "2rem 0" }}>
          <SermonCardSkeleton />
        </div>
      )}

      {error && !loading && (
        <div
          style={{
            padding: "3rem",
            textAlign: "center",
            color: "var(--color-error)",
          }}
        >
          <p>{error}</p>
          <p style={{ marginTop: "1rem", color: "var(--color-muted-gray)" }}>
            Please try again later.
          </p>
        </div>
      )}

      {!loading && !error && !latestSermon && (
        <div
          style={{
            padding: "3rem",
            textAlign: "center",
            color: "var(--color-muted-gray)",
          }}
        >
          <p>No sermons available right now.</p>
          <p style={{ marginTop: "1rem" }}>Check back soon for new messages.</p>
        </div>
      )}

      {!loading && !error && latestSermon && (
        <>
          <ScrollReveal className="featured-sermon-container">
            <SermonCard
              title={latestSermon.title}
              series={latestSermon.series}
              speaker={latestSermon.speaker}
              date={latestSermon.date}
              passage={latestSermon.passage}
              videoUrl={latestSermon.videoUrl}
              audioUrl={latestSermon.audioUrl}
              onClick={() => navigate("/sermon")}
            />
          </ScrollReveal>

          <ScrollReveal className="view-all-sermons">
            <Link to="/sermon">
              <Button variant="button-primary" buttonText="VIEW ALL SERMONS" />
            </Link>
          </ScrollReveal>
        </>
      )}
    </section>
  );
};

// Main Home Component
const Home: React.FC = () => {
  return (
    <PageContainer>
      <main className="wrapperMAIN">
        <HomeHeroSection />
        <WeeklyServicesSection />
        <SpecialServicesSection />
        <RecordedSermonsSection />
        <LocationMap />
      </main>
    </PageContainer>
  );
};

export default Home;

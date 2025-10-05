import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import SpecialCard from "../components/SpecialCard";
import HeroSection from "../components/HeroSection";
import { ScrollReveal } from "../components/ScrollReveal";
import { WEEKLY_SERVICES, SPECIAL_MINISTRIES, CHURCH_INFO } from "../constants";
import "./Home.css";

// Import assets
import churchTriPicture from "../assets/churchTriPhoto.svg";

// Home Hero Section Component
const HomeHeroSection: React.FC = () => (
  <HeroSection
    title="10TH AVENUE BIBLE CHAPEL"
    subtitle="WELCOME TO OUR CHURCH"
    description="A SMALL BIBLE BELIEVING CHRISTIAN FELLOWSHIP"
    showButton={true}
    buttonText="LEARN MORE"
    buttonLink="#"
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
);

// Recorded Sermons Section Component
const RecordedSermonsSection: React.FC = () => (
  <section className="recordedSermon">
    <ScrollReveal className="recentSermonsHeading">
      <h2>RECORDED SERMONS</h2>
      <Link to="/sermon">
        <Button variant="button-primary" buttonText="VIEW ALL SERMONS" />
      </Link>
    </ScrollReveal>
  </section>
);

// Main Home Component
const Home: React.FC = () => {
  return (
    <main className="wrapperMAIN">
      <HomeHeroSection />
      <WeeklyServicesSection />
      <SpecialServicesSection />
      <RecordedSermonsSection />
    </main>
  );
};

export default Home;

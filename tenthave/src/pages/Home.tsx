import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import SpecialCard from "../components/SpecialCard";
import SermonCard from "../components/SermonCard";
import { ScrollReveal } from "../components/ScrollReveal";
import { WEEKLY_SERVICES, SPECIAL_MINISTRIES, CHURCH_INFO } from "../constants";
import "./Home.css";

// Import assets
import churchTriPicture from "../assets/churchTriPhoto.svg";
import sermonCardImg from "../assets/sermonCardImg.svg";

// Hero Section Component
const HeroSection: React.FC = () => (
  <ScrollReveal className="hero">
    <div className="hero-overlay">
      <h2 className="hero-subtitle">{CHURCH_INFO.welcomeMessage}</h2>
      <h1 className="hero-title">
        10TH AVENUE <br /> BIBLE CHAPEL
      </h1>
      <div className="hero-description">
        <h3>—</h3>
        <h3 className="text-hero-description">{CHURCH_INFO.tagline}</h3>
      </div>
      <Button variant="button-primary" buttonText="JOIN US" buttonLink="#" />
    </div>
  </ScrollReveal>
);

// Weekly Services Section Component
const WeeklyServicesSection: React.FC = () => (
  <section className="weeklyServices">
    <ScrollReveal className="textServices">
      <h2>WEEKLY SERVICES</h2>
    </ScrollReveal>

    <ScrollReveal className="weeklyServicesCard">
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
      <p>{CHURCH_INFO.john316.verse}</p>
    </ScrollReveal>
  </section>
);

// Special Services Section Component
const SpecialServicesSection: React.FC = () => (
  <section className="specialServices">
    <img src={churchTriPicture} alt="Church" />

    <ScrollReveal className="learnAboutUs">
      <h2>LEARN MORE ABOUT US</h2>
      <p>
        Discover our mission, values, and the community that makes 10th Avenue
        Bible Chapel a welcoming place for all who seek to grow in faith.
      </p>
    </ScrollReveal>

    <Link to="/about">
      <Button variant="button-primary" buttonText="LEARN MORE" />
    </Link>

    <ScrollReveal className="specialMinistriesHeading">
      <h2>SPECIAL MINISTRIES & EVENTS</h2>
    </ScrollReveal>

    <ScrollReveal className="specialServicesCard">
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

// Recent Sermons Section Component
const RecentSermonsSection: React.FC = () => (
  <section className="recordedSermon">
    <ScrollReveal className="recentSermonsHeading">
      <h2>RECENT SERMONS</h2>
    </ScrollReveal>
    <SermonCard
      name="Recent Sermons"
      image={sermonCardImg}
      link="/sermon"
      title="WATCH AND LISTEN TO OUR SERMONS"
      description="Join us in person or online through our sermons."
      time={{ day: "Sunday", start: "11:30 AM", end: "12:30 PM" }}
      location="7103 - 10th Ave., Burnaby, BC V3N 2R5"
      buttonText="VIEW SERMONS"
      variant="featured"
    />
  </section>
);

// Main Home Component
const Home: React.FC = () => {
  return (
    <div className="wrapperMAIN">
      <HeroSection />
      <WeeklyServicesSection />
      <SpecialServicesSection />
      <RecentSermonsSection />
    </div>
  );
};

export default Home;

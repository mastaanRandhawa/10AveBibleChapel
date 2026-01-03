import React from "react";
import { ScrollReveal } from "../components/ScrollReveal";
import HeroSection from "../components/HeroSection";
import mountainsImage from "../assets/mountains.jpg";
import "./About.css";

// Belief item interface
interface BeliefItem {
  text: string;
  reference: string;
}

// Beliefs data
const BELIEFS: BeliefItem[] = [
  {
    text: 'The Bible is the inspired "Word" of God, our final authority in matters of faith and conduct.',
    reference: "II Timothy 3:16-17",
  },
  {
    text: "There is one God, revealing Himself in three Persons: the Father, the Son, and the Holy Spirit.",
    reference: "Hebrews 9:14; Matthew 28:19",
  },
  {
    text: "In the essential deity and true humanity of Jesus Christ our Lord, who lived on earth, died upon the cross, rose from the dead, ascended to heaven, and will soon return in person.",
    reference: "Philippians 2:6-11; I Thessalonians 4:16",
  },
  {
    text: "Man is sinful by nature and practice but through grace can be restored to fellowship with God.",
    reference: "Romans 3:23; Ephesians 2:8-9",
  },
  {
    text: "The only way for man to be right with God is through faith in Christ alone, whose sinless life and saving death were for our redemption.",
    reference: "Romans 10:8-10",
  },
  {
    text: "There is one true Church under the sole authority of Christ, comprised of all believers in the Lord Jesus Christ.",
    reference: "Ephesians 1:19-23; Galatians 3:28",
  },
  {
    text: "In the Christian ordinances: believer's baptism by immersion and the Lord's Supper.",
    reference: "Matthew 28:19; Luke 22:19-20",
  },
];

// Who We Are Section Component
const WhoWeAreSection: React.FC = () => (
  <div className="who-we-are">
    <div className="section-divider"></div>
    <div className="section-content">
      <h2 className="section-heading">Who Are We?</h2>
      <div className="content-grid">
        <div className="content-text">
          <p>
            We believe in a personal God, who cares for all men, offering
            forgiveness and a fulfilling life through faith in the Lord Jesus.
            No matter one's past, or who we might be, we know that Jesus came to
            offer hope and salvation to all. Jesus said:
          </p>
          <div className="verse-highlight">
            <blockquote>
              "Come to me, all who labor and are heavy laden, and I will give
              you rest."
            </blockquote>
            <cite>
              — <strong>Matthew 11:28</strong>
            </cite>
          </div>
          <p>
            As a small church, with almost 100 years of history and having been
            directly involved in missionary work around the world, we warmly
            welcome young and old, rich and poor—not to join a church, but to
            come to know, through faith, the Lord Jesus.
          </p>
          <p>
            We are delighted to have this opportunity to invite you to our
            services and look forward to your visit.
          </p>
        </div>
      </div>
    </div>
    <div className="section-divider"></div>
  </div>
);

// Beliefs List Component
const BeliefsList: React.FC = () => (
  <div className="beliefs-container">
    <div className="beliefs-two-column">
      <div className="beliefs-column">
        {BELIEFS.slice(0, 4).map((belief, index) => (
          <div key={index} className="belief-item">
            <div className="belief-bullet"></div>
            <div className="belief-content">
              <p className="belief-text">{belief.text}</p>
              <div className="belief-reference">
                <strong>{belief.reference}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="beliefs-column">
        {BELIEFS.slice(4).map((belief, index) => (
          <div key={index + 4} className="belief-item">
            <div className="belief-bullet"></div>
            <div className="belief-content">
              <p className="belief-text">{belief.text}</p>
              <div className="belief-reference">
                <strong>{belief.reference}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Main About Component
const About: React.FC = () => {
  return (
    <div className="about-page-wrapper">
      <HeroSection
        title="ABOUT US"
        subtitle="WHO WE ARE"
        description="Discover our mission, beliefs, and the heart of our church community"
        backgroundImage={`url(${mountainsImage})`}
        variant="centered"
      />

      <div className="about-content">
        <ScrollReveal className="who-we-are-section">
          <WhoWeAreSection />
        </ScrollReveal>

        <ScrollReveal className="beliefs-section">
          <div className="beliefs-images">
            <div className="belief-image">
              <img
                src="/assets/prayingiconround.svg"
                alt="Man praying with Bible"
              />
            </div>
            <div className="belief-image">
              <img src="/assets/bible.svg" alt="People reading Bible" />
            </div>
            <div className="belief-image">
              <img src="/assets/breakingofbread.svg" alt="Baptism ceremony" />
            </div>
          </div>
          <div className="beliefs-header">
            <h3 className="mission-subtitle">OUR MISSION & VISION</h3>
            <h2 className="section-heading2">What Do We Believe?</h2>
          </div>
          <BeliefsList />
        </ScrollReveal>
      </div>
    </div>
  );
};

export default About;

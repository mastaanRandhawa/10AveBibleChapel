import React, { useEffect } from "react";
import "./About.css";
// import aboutImage from "../assets/aboutus.avif"; // Make sure to use the actual uploaded image path

function About() {
  useEffect(() => {
    const elements = document.querySelectorAll(".scroll-reveal");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, { threshold: 0.1 });

    elements.forEach((el) => observer.observe(el));

    return () => elements.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <div className="about-page-wrapper">
      <section className="about-hero scroll-reveal">
        {/* <img src={aboutImage} alt="Inside the Church" className="about-image" /> */}
      </section>

      <section className="about-content scroll-reveal">
        <div className="who-we-are">
          <hr></hr>
          <h2 className="section-heading">Who Are We?</h2>
          <p>
            We believe in a personal God, who cares for all men, offering forgiveness and a fulfilling life through faith in the Lord Jesus.
            No matter one's past, or who we might be, we know that Jesus came to offer hope and salvation to all. Jesus said:
          </p>
          <blockquote>“Come to me, all who labor and are heavy laden, and I will give you rest.” – <strong>Matthew 11:28</strong> </blockquote>
          <p>
            As a small church, with almost 100 years of history and having been directly involved in missionary work around the world,
            we warmly welcome young and old, rich and poor—not to join a church, but to come to know, through faith, the Lord Jesus.
          </p>
          <p>We are delighted to have this opportunity to invite you to our services and look forward to your visit.</p>

          <hr></hr>
        </div>
        <h2 className="section-heading2">What Do We Believe?</h2>
        <ul className="beliefs-list">
          <li>
            The Bible is the inspired “Word” of God, our final authority in matters of faith and conduct.
            <br /><strong>II Timothy 3:16-17</strong>
          </li>
          <li>
            There is one God, revealing Himself in three Persons: the Father, the Son, and the Holy Spirit.
            <br /><strong>Hebrews 9:14; Matthew 28:19</strong>
          </li>
          <li>
            In the essential deity and true humanity of Jesus Christ our Lord, who lived on earth, died upon the cross, rose from the dead, ascended to heaven, and will soon return in person.
            <br /><strong>Philippians 2:6-11; I Thessalonians 4:16</strong>
          </li>
          <li>
            Man is sinful by nature and practice but through grace can be restored to fellowship with God.
            <br /><strong>Romans 3:23; Ephesians 2:8-9</strong>
          </li>
          <li>
            The only way for man to be right with God is through faith in Christ alone, whose sinless life and saving death were for our redemption.
            <br /><strong>Romans 10:8-10</strong>
          </li>
          <li>
            There is one true Church under the sole authority of Christ, comprised of all believers in the Lord Jesus Christ.
            <br /><strong>Ephesians 1:19-23; Galatians 3:28</strong>
          </li>
          <li>
            In the Christian ordinances: believer’s baptism by immersion and the Lord’s Supper.
            <br /><strong>Matthew 28:19; Luke 22:19-20</strong>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default About;


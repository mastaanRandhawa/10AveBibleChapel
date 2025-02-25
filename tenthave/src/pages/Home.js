import { Link } from "react-router-dom";
import { useEffect } from "react";
import Button from "../components/Button"
import Card from "../components/Card"
import SpecialCard from "../components/SpecialCard";

import "./Home.css";

import breakingofbread from '../assets/breakingofbread.svg';
import prayingSymbol from '../assets/prayingiconround.svg';
import bible from '../assets/bible.svg';
import churchTriPicture from '../assets/churchTriPhoto.svg'
import sundaySchool from '../assets/sundaySchool.png'
import spanishStudy from '../assets/spanishBible.png'
import eslPNG from '../assets/ESL.png'

function HeroSection() {
  // Effect to handle scrolling animations
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
    <>
      <section className="hero scroll-reveal">
        <div className="hero-overlay">
          <h2 className="hero-subtitle ">WELCOME TO OUR CHURCH</h2>
          <h1 className="hero-title ">10TH AVENUE <br /> BIBLE CHAPEL</h1>
          <div className="hero-description">
            <h3>—</h3>
            <h3 className="text-hero-description">A SMALL BIBLE BELIEVING <br /> CHRISTIAN FELLOWSHIP</h3>
          </div>
          <Button variant="button-primary" buttonText="JOIN US" buttonLink="#" />
        </div>
      </section>


      <section className="weeklyServices">
        <div className="textServices scroll-reveal">
          <h2>WEEKLY SERVICES</h2>
          <p>Services at the chapel are at the times and days indicated below. You can also join virtually by clicking on the desired service at the day and time indicated to be connected via Zoom. All are welcome. If you have any further questions please contact us.</p>
        </div>

        <div className="weeklyServicesCard scroll-reveal">

          {/* Add logic to add Card here via Admin LogIn   */}

          <Card iconlink={prayingSymbol}
            headingOne="BREAKING OF BREAD"
            paragraph="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            linkToService="https://us02web.zoom.us/j/6042227777?pwd=R2tDVy92NGlsWVkyb1BEendaRllPQT09"
          ></Card>

          <Card iconlink={bible}
            headingOne="FAMILY BIBLE HOUR"
            paragraph="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            linkToService="https://us02web.zoom.us/j/6042227777?pwd=R2tDVy92NGlsWVkyb1BEendaRllPQT09"
          ></Card>

          <Card iconlink={breakingofbread}
            headingOne="ESTUDIO BÍBLICO"
            paragraph="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            linkToService="https://us02web.zoom.us/j/6042227777?pwd=R2tDVy92NGlsWVkyb1BEendaRllPQT09"
          ></Card>
        </div>
        <div className="textJohn scroll-reveal">
          <h2>JOHN 3:16</h2>
          <p>"FOR GOD SO LOVED THE WORLD THAT HE GAVE HIS ONLY BEGOTTEN SON, THAT WHOEVER BELIEVES IN HIM SHOULD NOT PERSIH BUT HAVE EVERLASTING LIFE."</p>
        </div>
      </section>

      <section className="specialServices scroll-reveal">

        <img src={churchTriPicture} alt="church" />
        <div className="learnAboutUs scroll-reveal">
          <h2>LEARN MORE ABOUT US</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>

        <Link to="/about">
          <Button variant="button-primary" buttonText="LEARN MORE" />
        </Link>

        <h2 className="specialMinistriesHeading scroll-reveal">SPECIAL MINISTERIES & EVENTS</h2>

        <div className="specialServicesCard scroll-reveal">
          <SpecialCard
            headingOne="SUNDAY SCHOOL CLASS"
            paragraph="Weekly kids club, Sundays from 11:30 am to 12:30 pm, for children ages 8 through 14."
            iconlink={sundaySchool}
          />
          <SpecialCard
            headingOne="SPANISH BIBLE STUDY"
            paragraph="Weekly kids club, Sundays from 11:30 am to 12:30 pm, for children ages 8 through 14."
            iconlink={spanishStudy}
          />
          <SpecialCard
            headingOne="ESL (CANCELLED)"
            paragraph="Weekly kids club, Sundays from 11:30 am to 12:30 pm, for children ages 8 through 14."
            iconlink={eslPNG}
          />
        </div>
      </section>


    </>



  );
}

export default HeroSection;


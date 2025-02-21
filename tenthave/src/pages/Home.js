import Button from "../components/Button"
import Card from "../components/Card"
import breakingofbread from '../assets/breakingofbread.svg';
import "./Home.css";

function HeroSection() {
  return (
    <>
      <section className="hero">
        <div className="hero-overlay">
          <h2 className="hero-subtitle">WELCOME TO OUR CHURCH</h2>
          <h1 className="hero-title">10TH AVENUE <br /> BIBLE CHAPEL</h1>
          <div className="hero-description">
            <h3>—</h3>
            <h3 className="text-hero-description">A SMALL BIBLE BELIEVING <br /> CHRISTIAN FELLOWSHIP</h3>
          </div>
          <Button variant="button-primary" buttonText="Learn More" buttonLink="#" />
        </div>
      </section>

      <section className="weeklyServices">
        <h2>WEEKLEY SERVICES</h2>
        <div className="weeklyServicesCard">

          <Card iconlink={breakingofbread}
            headingOne="BREAKING OF BREAD"
            paragraph="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            linkToService="https://google.com"
          ></Card>

          <Card iconlink={breakingofbread}
            headingOne="BREAKING OF BREAD"
            paragraph="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            linkToService="https://google.com"
          ></Card>

          <Card iconlink={breakingofbread}
            headingOne="BREAKING OF BREAD"
            paragraph="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            linkToService="https://google.com"
          ></Card>
        </div>


      </section>
    </>



  );
}

export default HeroSection;


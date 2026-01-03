import React from "react";
import { ScrollReveal } from "./ScrollReveal";
import { CONTACT_INFO } from "../constants";
import "./LocationMap.css";

const LocationMap: React.FC = () => {
  return (
    <section className="locationMap" aria-labelledby="location-heading">
      <div className="locationMapContainer">
        <ScrollReveal className="locationInfo">
          <div className="locationSection">
            <h2 id="location-heading">LOCATION</h2>
            <p className="address">{CONTACT_INFO.address}</p>
          </div>

          <div className="hoursSection">
            <h2>HOURS</h2>
            <div className="hoursList">
              <p>Sunday: {CONTACT_INFO.hours.sunday}</p>
              <p>Wednesday: {CONTACT_INFO.hours.wednesday}</p>
            </div>
          </div>

          <div className="accentBar"></div>
        </ScrollReveal>

        <ScrollReveal className="mapSection">
          <div className="mapContainer">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyB2NIWI3Tv9iDPrlnowr_0ZqZWoAQydKJU&q=Tenth%20Ave%20Bible%20Chapel%2C%2010th%20Avenue%2C%20Burnaby%2C%20BC%2C%20Canada&zoom=14&maptype=roadmap"
              allowFullScreen
              title="10th Avenue Bible Chapel Location"
              aria-label="Interactive map showing the location of 10th Avenue Bible Chapel"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default LocationMap;

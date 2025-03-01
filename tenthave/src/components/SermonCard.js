import React from "react";
import "../components/SermonCard.css";
import Button from "../components/Button"

const SermonEvent = ({ image, link, title, description, time, location }) => {
    return (
        <div className="sermon-event-container">
            <div className="sermon-event-content">
                <p className="event-label">UPCOMING EVENT</p>
                <h2 className="event-title">{title}</h2>
                <p className="event-description">{description}</p>
                <div className="event-details">
                    <div className="event-detail">
                        <div>
                            <p>{time.day}</p>
                            <p>{time.start} - {time.end}</p>
                        </div>
                    </div>
                    <div className="event-detail">
                        <div>
                            <p>{location.address}</p>
                            <p>{location.city}, {location.zip}</p>
                        </div>
                    </div>
                </div>
                <Button variant="button-secondary" buttonText="JOIN US" buttonLink={link} />
            </div>
            <div className="sermon-event-image">
                <img src={image} alt="Sermon Event" />
            </div>
        </div>
    );
};

export default SermonEvent;
import React from "react";
import "../components/SermonCard.css";
import Button from "../components/Button2"

const SermonEventExample = ({ image, link, title, description, time}) => {
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
                    <Button variant="button-secondary" buttonText="VIEW ALL" buttonLink={link} />
                </div>
            </div>
            <div className="sermon-event-image">
                <img src={image} alt="Sermon Event" />
            </div>
        </div>
    );
};

export default SermonEventExample;
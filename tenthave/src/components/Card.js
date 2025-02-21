import React from "react";
import "./Card.css";
import Button from "./Button"
function Card({ linkToService, headingOne, paragraph, iconlink }) {
    return (
        <div className="card">
            <img src={iconlink} alt="Icon" />
            <h3 className="card-title">{headingOne}</h3>
            <p className="card-text">{paragraph}</p>
            <Button variant="button-secondary" buttonText="Zoom Link" buttonLink={linkToService} />
        </div>
    );
}

export default Card;

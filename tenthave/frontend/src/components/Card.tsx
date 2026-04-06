import React from "react";
import { CardProps } from "../types";
import Button from "./Button";
import "./Card.css";

const Card: React.FC<CardProps> = ({
  linkToService,
  headingOne,
  paragraph,
  iconlink,
  className = "",
  time,
}) => {
  return (
    <div className={`card ${className}`.trim()}>
      <img src={iconlink} alt="Service Icon" />
      <h3 className="card-title">{headingOne}</h3>
      {time && (
        <div className="card-time">
          <span className="card-time-day">{time.day}</span>
          <span className="card-time-hours">
            {time.start} – {time.end}
          </span>
        </div>
      )}
      <p className="card-text">{paragraph}</p>
      {linkToService && (
        <Button
          variant="button-secondary"
          buttonText="Join Service"
          buttonLink={linkToService}
        />
      )}
    </div>
  );
};

export default Card;

import React from "react";
import { SpecialCardProps } from "../types";
import "./SpecialCard.css";

const SpecialCard: React.FC<SpecialCardProps> = ({
  headingOne,
  paragraph,
  iconlink,
  className = "",
}) => {
  return (
    <div
      className={`specialCard ${className}`.trim()}
      style={{ background: `url(${iconlink}) no-repeat center center/cover grey` }}
      title="Special service background"
    >
      <h3 className="specialCard-title">{headingOne}</h3>
      <p className="specialCard-text">{paragraph}</p>
    </div>
  );
};

export default SpecialCard;

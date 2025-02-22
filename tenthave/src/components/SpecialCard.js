import React from "react";
import "./SpecialCard.css";

function SpecialCard({ headingOne, paragraph, iconlink }) {
    return (
        <div className="specialCard" style={{ background: `url(${iconlink}) no-repeat center center/cover` }} alt="Image for special sevice.">
            <h3 className="specialCard-title">{headingOne}</h3>
            <p className="specialCard-text">{paragraph}</p>
        </div>
    );
}

export default SpecialCard;

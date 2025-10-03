import React from "react";
import "./ShowAllButton.css";

interface ShowAllButtonProps {
  text?: string;
  onClick?: () => void;
  className?: string;
}

const ShowAllButton: React.FC<ShowAllButtonProps> = ({
  text = "SHOW ALL SERMONS",
  onClick,
  className = "",
}) => {
  return (
    <button className={`show-all-button ${className}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default ShowAllButton;

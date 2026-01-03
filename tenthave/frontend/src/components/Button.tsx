import React from "react";
import { Link } from "react-router-dom";
import { ButtonProps } from "../types";
import "./Button.css";

const Button: React.FC<ButtonProps> = ({
  variant,
  buttonText,
  buttonLink,
  onClick,
  className = "",
}) => {
  const buttonClass = `${variant} ${className}`.trim();

  if (buttonLink) {
    // External link
    if (buttonLink.startsWith("http") || buttonLink.startsWith("#")) {
      return (
        <a
          href={buttonLink}
          className={buttonClass}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
        >
          {buttonText}
        </a>
      );
    }

    // Internal route
    return (
      <Link to={buttonLink} className={buttonClass} onClick={onClick}>
        {buttonText}
      </Link>
    );
  }

  // Button without link
  return (
    <button className={buttonClass} onClick={onClick}>
      {buttonText}
    </button>
  );
};

export default Button;

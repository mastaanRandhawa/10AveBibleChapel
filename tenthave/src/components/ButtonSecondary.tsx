import React from "react";
import { ButtonProps } from "../types";
import "./Button.css";

const ButtonSecondary: React.FC<ButtonProps> = ({
  variant,
  buttonLink,
  buttonText,
  onClick,
  className = "",
}) => {
  const buttonClass = `${variant} ${className}`.trim();

  return (
    <a
      href={buttonLink}
      className={buttonClass}
      rel="noopener noreferrer"
      onClick={onClick}
    >
      {buttonText}
    </a>
  );
};

export default ButtonSecondary;

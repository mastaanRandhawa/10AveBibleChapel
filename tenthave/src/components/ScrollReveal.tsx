import React from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { ScrollRevealProps } from "../types";

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = "",
  threshold,
}) => {
  const { elementRef, isVisible } = useScrollReveal(threshold);

  return (
    <div
      ref={elementRef}
      className={`scroll-reveal ${isVisible ? "visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

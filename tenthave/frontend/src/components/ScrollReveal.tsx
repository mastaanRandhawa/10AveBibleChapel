import React from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { ScrollRevealProps } from "../types";

export const ScrollReveal: React.FC<
  ScrollRevealProps & React.HTMLAttributes<HTMLDivElement>
> = ({ children, className = "", threshold, ...props }) => {
  const { elementRef, isVisible } = useScrollReveal(threshold);

  return (
    <div
      ref={elementRef}
      className={`scroll-reveal ${isVisible ? "visible" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

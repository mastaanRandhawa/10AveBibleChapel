import React, { ReactNode } from "react";
import "./PageContainer.css";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * PageContainer - Wraps page content with consistent animations
 * Provides subtle fade-in + slide-up transition on mount
 */
const PageContainer: React.FC<PageContainerProps> = ({ children, className = "" }) => {
  return (
    <div className={`page-container page-enter ${className}`.trim()}>
      {children}
    </div>
  );
};

export default PageContainer;


import React from "react";
import "./Badge.css";

export type BadgeVariant =
  | "draft"
  | "published"
  | "archived"
  | "pinned"
  | "pending"
  | "approved"
  | "rejected"
  | "answered"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning";

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ variant, children, className = "" }) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;


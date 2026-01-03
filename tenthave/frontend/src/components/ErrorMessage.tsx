import React from "react";

interface ErrorMessageProps {
  message: string;
  type?: "error" | "warning" | "info";
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  role?: "alert" | "status";
}

/**
 * ErrorMessage component for displaying user-friendly error messages
 * Supports different message types and dismissible functionality
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  type = "error",
  dismissible = false,
  onDismiss,
  className = "",
  role = "alert",
}) => {
  const getIcon = () => {
    switch (type) {
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "❌";
    }
  };

  const getTypeClass = () => {
    switch (type) {
      case "error":
        return "error-message--error";
      case "warning":
        return "error-message--warning";
      case "info":
        return "error-message--info";
      default:
        return "error-message--error";
    }
  };

  return (
    <div
      className={`error-message ${getTypeClass()} ${className}`}
      role={role}
      aria-live="polite"
    >
      <div className="error-message-content">
        <span className="error-message-icon" aria-hidden="true">
          {getIcon()}
        </span>
        <span className="error-message-text">{message}</span>
        {dismissible && onDismiss && (
          <button
            className="error-message-dismiss"
            onClick={onDismiss}
            aria-label="Dismiss message"
            type="button"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;

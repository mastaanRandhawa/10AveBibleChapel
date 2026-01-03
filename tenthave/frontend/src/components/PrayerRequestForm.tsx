import React, { useState } from "react";
import Button from "./Button";
import ErrorMessage from "./ErrorMessage";

export interface PrayerRequestFormData {
  title: string;
  description: string;
  requester: string;
  category: "health" | "family" | "work" | "spiritual" | "community" | "other";
  priority: "urgent" | "high" | "normal";
  isPrivate: boolean;
}

interface PrayerRequestFormProps {
  onSubmit: (data: PrayerRequestFormData) => Promise<void>;
  onLoginClick: () => void;
  className?: string;
  isLoading?: boolean;
}

/**
 * PrayerRequestForm component for submitting prayer requests
 * Includes proper form validation and accessibility features
 */
const PrayerRequestForm: React.FC<PrayerRequestFormProps> = ({
  onSubmit,
  onLoginClick,
  className = "",
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<PrayerRequestFormData>({
    title: "",
    description: "",
    requester: "",
    category: "other",
    priority: "normal",
    isPrivate: false,
  });

  const [errors, setErrors] = useState<Partial<PrayerRequestFormData>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof PrayerRequestFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PrayerRequestFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (validateForm()) {
      try {
        await onSubmit(formData);
        // Reset form after successful submission
        setFormData({
          title: "",
          description: "",
          requester: "",
          category: "other",
          priority: "normal",
          isPrivate: false,
        });
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Failed to submit prayer request. Please try again."
        );
      }
    }
  };

  return (
    <section
      className={`prayer-form-section ${className}`}
      aria-labelledby="prayer-form-heading"
    >
      <div className="prayer-form-header">
        <h3 id="prayer-form-heading">Submit a Prayer Request</h3>
        <p className="prayer-form-subtitle">
          Share your prayer needs with our community. All requests are kept
          confidential and prayed for by our church family.
        </p>
      </div>

      {submitError && (
        <ErrorMessage
          message={submitError}
          type="error"
          dismissible
          onDismiss={() => setSubmitError(null)}
        />
      )}

      <form className="prayer-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="prayer-title" className="form-label">
            Prayer Request Title *
          </label>
          <input
            id="prayer-title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Prayer Request Title"
            aria-label="Prayer request title"
            aria-required="true"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "title-error" : undefined}
            className={errors.title ? "error" : ""}
            required
          />
          {errors.title && (
            <div id="title-error" className="error-message" role="alert">
              {errors.title}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="prayer-description" className="form-label">
            Description *
          </label>
          <textarea
            id="prayer-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your prayer request"
            rows={4}
            aria-label="Describe your prayer request"
            aria-required="true"
            aria-invalid={!!errors.description}
            aria-describedby={
              errors.description ? "description-error" : undefined
            }
            className={errors.description ? "error" : ""}
            required
          />
          {errors.description && (
            <div id="description-error" className="error-message" role="alert">
              {errors.description}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="prayer-requester" className="form-label">
            Your Name (optional)
          </label>
          <input
            id="prayer-requester"
            type="text"
            name="requester"
            value={formData.requester}
            onChange={handleChange}
            placeholder="Your Name (optional)"
            aria-label="Your name (optional)"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="prayer-category" className="form-label">
              Category
            </label>
            <select
              id="prayer-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              aria-label="Prayer request category"
            >
              <option value="health">Health</option>
              <option value="family">Family</option>
              <option value="work">Work</option>
              <option value="spiritual">Spiritual</option>
              <option value="community">Community</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="prayer-priority" className="form-label">
              Priority
            </label>
            <select
              id="prayer-priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              aria-label="Prayer request priority"
            >
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isPrivate"
              checked={formData.isPrivate}
              onChange={handleChange}
              aria-describedby="private-help"
            />
            <span className="checkbox-text">Keep this request private</span>
          </label>
          <div id="private-help" className="form-help">
            Private requests will only be visible to church leadership
          </div>
        </div>

        <Button
          variant="button-primary"
          buttonText={isLoading ? "Submitting..." : "Submit Prayer Request"}
          onClick={() => {}}
          className={isLoading ? "loading" : ""}
        />
      </form>

      <div className="prayer-form-footer">
        <p className="login-prompt">
          Want to view and pray for others?
          <Button
            variant="button-secondary"
            buttonText="Sign in to access prayer requests"
            onClick={onLoginClick}
          />
        </p>
      </div>
    </section>
  );
};

export default PrayerRequestForm;

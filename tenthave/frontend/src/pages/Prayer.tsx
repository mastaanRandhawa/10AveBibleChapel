import React, { useState, useEffect } from "react";
import { ScrollReveal } from "../components/ScrollReveal";
import HeroSection from "../components/HeroSection";
import LoginModal from "../components/LoginModal";
import Button from "../components/Button";
import PageContainer from "../components/PageContainer";
import { Skeleton } from "../components/SkeletonLoader";
import { useToast } from "../context/ToastContext";
import { prayerRequestsAPI, PrayerRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getUserFriendlyErrorMessage } from "../services/apiErrorHandler";
import prayingImage from "../assets/praying.jpg";
import "./Prayer.css";

// Prayer Request Form Component
const PrayerRequestForm: React.FC<{ onLoginClick: () => void }> = ({
  onLoginClick,
}) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requester: "",
    isPrivate: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await prayerRequestsAPI.create({
        title: formData.title,
        description: formData.description,
        requester: formData.requester || undefined,
        isPrivate: formData.isPrivate,
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        requester: "",
        isPrivate: false,
      });
      setSuccess(true);
      toast.showSuccess("Prayer request submitted successfully");
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      const errorMessage = getUserFriendlyErrorMessage(err);
      setError(errorMessage);
      toast.showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prayer-form-section">
      {success && (
        <div
          className="success-message"
          style={{
            padding: "1rem",
            marginBottom: "1rem",
            background: "var(--color-success, #10B981)",
            color: "white",
            borderRadius: "4px",
          }}
        >
          Prayer request submitted successfully! It will be reviewed by our
          team.
        </div>
      )}
      {error && (
        <div
          className="error-message"
          style={{
            padding: "1rem",
            marginBottom: "1rem",
            background: "var(--color-error, #EF4444)",
            color: "white",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}
      <form className="prayer-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Prayer Request Title"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your prayer request"
            rows={4}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="requester"
            value={formData.requester}
            onChange={handleChange}
            placeholder="Your Name (optional)"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="isPrivate"
              checked={formData.isPrivate}
              onChange={handleChange}
              disabled={loading}
            />
            Keep this request private (only visible to church leadership)
          </label>
        </div>
        <Button
          variant="button-primary"
          buttonText={loading ? "Submitting..." : "Submit Prayer Request"}
          onClick={() => {}}
        />
      </form>

      <div className="prayer-form-footer">
        <p className="login-prompt">
          Want to view and pray for others?
          <button className="login-link-btn" onClick={onLoginClick}>
            Sign in to access prayer requests
          </button>
        </p>
      </div>
    </div>
  );
};

// Prayer Requests List Component
const PrayerRequestsList: React.FC<{
  onLoginClick: () => void;
}> = ({ onLoginClick }) => {
  const { isAuthenticated, isApproved, isAdmin, isLoading: authLoading } = useAuth();
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only fetch if user is authorized (approved or admin)
  useEffect(() => {
    const fetchPrayerRequests = async () => {
      if (!isAuthenticated || (!isApproved && !isAdmin)) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const requests = await prayerRequestsAPI.getAll({
          status: "APPROVED",
        });
        setPrayerRequests(requests);
      } catch (err: any) {
        console.error("Failed to fetch prayer requests:", err);
        setError(err.message || "Failed to load prayer requests");
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerRequests();
  }, [isAuthenticated, isApproved, isAdmin]);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Show loading state during auth check
  if (authLoading) {
    return (
      <div className="prayer-requests-section">
        <div className="section-header">
          <h2>PRAYER REQUESTS</h2>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="prayer-requests-section">
        <div className="section-header">
          <h2>PRAYER REQUESTS</h2>
          <p>View and pray for our community's prayer needs</p>
        </div>
        <div className="prayer-login-prompt">
          <div className="prayer-login-card">
            <div className="prayer-login-icon">🔒</div>
            <h3>Login Required</h3>
            <p>
              Prayer requests are private and only available to our church
              members. Please log in to view and pray for these requests.
            </p>
            <button className="prayer-login-btn" onClick={onLoginClick}>
              Log In to View Requests
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show approval required message if logged in but not approved
  if (!isApproved && !isAdmin) {
    return (
      <div className="prayer-requests-section">
        <div className="section-header">
          <h2>PRAYER REQUESTS</h2>
          <p>View and pray for our community's prayer needs</p>
        </div>
        <div className="prayer-login-prompt">
          <div className="prayer-login-card">
            <div className="prayer-login-icon">⏳</div>
            <h3>Approval Pending</h3>
            <p>
              Your account is pending admin approval. Once approved by church leadership, 
              you will be able to view and pray for community prayer requests. 
              Please contact the church office if you have questions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Authorized user view
  return (
    <div className="prayer-requests-section print-area">
      <div className="section-header">
        <div className="section-header-content">
          <div className="section-header-text">
            <h2>PRAYER REQUESTS</h2>
            <p>Join us in praying for these needs</p>
          </div>
          <button className="print-btn no-print" onClick={handlePrint}>
            PRINT
          </button>
        </div>
      </div>

      {/* Print-only header */}
      <div className="print-only print-header">
        <h1>Prayer Requests</h1>
        <p className="print-date">
          Printed on {new Date().toLocaleDateString()}
        </p>
      </div>

      {loading && (
        <div className="prayer-loading">
          <p>Loading prayer requests...</p>
        </div>
      )}

      {error && (
        <div className="prayer-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {!loading && !error && prayerRequests.length === 0 && (
        <div className="prayer-empty">
          <p>No prayer requests at this time.</p>
        </div>
      )}

      {!loading && !error && prayerRequests.length > 0 && (
        <div className="prayer-requests-list">
          {prayerRequests.map((request) => (
            <div
              key={request.id}
              className={`prayer-card ${request.isAnswered ? "answered" : ""}`}
            >
              <div className="prayer-header">
                <div className="prayer-title-section">
                  <h3 className="prayer-title">{request.title}</h3>
                  <div className="prayer-badges">
                    {request.isAnswered && (
                      <span className="answered-badge">✓ Answered</span>
                    )}
                    {request.priority === "URGENT" && (
                      <span className="priority-badge urgent">Urgent</span>
                    )}
                    {request.priority === "HIGH" && (
                      <span className="priority-badge high">High Priority</span>
                    )}
                    {request.isPrivate && (
                      <span className="privacy-badge">Private</span>
                    )}
                  </div>
                </div>
              </div>

              <p className="prayer-description">{request.description}</p>

              {request.isAnswered && request.answerNotes && (
                <div className="prayer-answer">
                  <strong>Answer:</strong> {request.answerNotes}
                </div>
              )}

              <div className="prayer-meta">
                {request.requester && (
                  <p className="prayer-requester">
                    Requested by: {request.requester}
                  </p>
                )}
                <p className="prayer-date">
                  Submitted: {formatDate(request.createdAt)}
                </p>
                {request.isAnswered && request.answeredAt && (
                  <p className="answered-date">
                    Answered: {formatDate(request.answeredAt)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Prayer Component
const Prayer: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginSuccess = (userData: any) => {
    console.log("User logged in:", userData);
    setIsLoginModalOpen(false);
    // Reload to fetch prayer requests
    window.location.reload();
  };

  return (
    <PageContainer>
    <div className="prayer-page-wrapper">
      <HeroSection
        title="PRAYER REQUESTS"
        subtitle="SHARE YOUR PRAYER NEEDS"
        description="Join our caring community in prayer and share your prayer requests with us"
        backgroundImage={`url(${prayingImage})`}
        variant="centered"
      />

      <div className="prayer-content">
        {/* Prayer Request Form Section */}
        <ScrollReveal className="prayer-form-section">
          <div className="section-header">
            <h2>SUBMIT A PRAYER REQUEST</h2>
            <p>Share your prayer needs with our caring church community</p>
          </div>
          <PrayerRequestForm onLoginClick={handleLoginClick} />
        </ScrollReveal>

        {/* Prayer Requests List Section */}
        <ScrollReveal>
          <PrayerRequestsList onLoginClick={handleLoginClick} />
        </ScrollReveal>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginModalClose}
        onLogin={handleLoginSuccess}
      />
    </div>
    </PageContainer>
  );
};

export default Prayer;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import PageHero from "../components/PageHero";
import PageContainer from "../components/PageContainer";
import LoadingSpinner from "../components/LoadingSpinner";
import "./Profile.css";
import profileImage from "../assets/worship.jpg";

const Profile: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    updateProfile,
  } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.showInfo("Please log in to access your profile");
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated, navigate]);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updates: { name?: string; email?: string } = {};

      if (formData.name !== user?.name) {
        updates.name = formData.name;
      }
      if (formData.email !== user?.email) {
        updates.email = formData.email;
      }

      if (Object.keys(updates).length === 0) {
        toast.showInfo("No changes to save");
        setLoading(false);
        return;
      }

      await updateProfile(updates);
      setHasChanges(false);
    } catch (err: any) {
      toast.showError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
      setHasChanges(false);
    }
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <PageContainer>
      <div className="profile-page-wrapper">
        <PageHero
          backgroundImage={profileImage}
          title="MY PROFILE"
          subtitle="Update your account information"
        />

        <div className="profile-content">
          <div className="profile-container">
            <div className="profile-header">
              <h2>Account Information</h2>
              <p className="profile-description">
                Update your personal information below. Changes will be saved to
                your account.
              </p>
            </div>

            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                  />
                  <span className="form-helper">
                    Your name as it will appear on the site
                  </span>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your email address"
                    required
                    disabled={loading}
                  />
                  <span className="form-helper">
                    Used for login and notifications
                  </span>
                </div>

                <div className="form-group readonly-group">
                  <label className="form-label">Role</label>
                  <div className="readonly-field">
                    <span
                      className={`role-badge role-${user.role.toLowerCase()}`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <span className="form-helper">
                    Contact an administrator to change your role
                  </span>
                </div>

                <div className="form-group readonly-group">
                  <label className="form-label">Account Status</label>
                  <div className="readonly-field">
                    <span
                      className={`status-badge ${
                        user.isApproved ? "status-approved" : "status-pending"
                      }`}
                    >
                      {user.isApproved ? "Approved" : "Pending Approval"}
                    </span>
                  </div>
                  {!user.isApproved && (
                    <span className="form-helper form-helper-warning">
                      Your account is pending admin approval
                    </span>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading || !hasChanges}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                {hasChanges && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Profile;

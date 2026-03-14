import React from "react";
import "./PageHeader.css";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  children,
}) => {
  return (
    <div className="page-header">
      <div className="page-header-content">
        <div className="page-header-text">
          <h1 className="page-header-title">{title}</h1>
          {description && (
            <p className="page-header-description">{description}</p>
          )}
        </div>
        {actions && <div className="page-header-actions">{actions}</div>}
      </div>
      {children && <div className="page-header-extra">{children}</div>}
    </div>
  );
};

export default PageHeader;


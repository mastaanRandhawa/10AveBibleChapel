import React from "react";
import "./Pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

/**
 * Pagination component for navigating through paginated data
 *
 * @example
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={handlePageChange}
 *   showFirstLast={true}
 *   maxVisiblePages={5}
 * />
 */

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  showFirstLast = true,
  maxVisiblePages = 5,
}) => {
  // Don't render if there's only one page or no pages
  if (totalPages <= 1) return null;

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // Adjust if we're near the beginning or end
    if (currentPage <= halfVisible) {
      endPage = Math.min(totalPages, maxVisiblePages);
    }
    if (currentPage > totalPages - halfVisible) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (showFirstLast && startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("...");
      }
    }

    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if needed
    if (showFirstLast && endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number") {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={`pagination ${className}`}>
      <button
        className={`pagination__button pagination__button--prev ${
          currentPage === 1 ? "disabled" : ""
        }`}
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M7.5 9L4.5 6L7.5 3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="pagination__pages">
        {visiblePages.map((page, index) => (
          <button
            key={index}
            className={`pagination__button pagination__button--page ${
              page === currentPage ? "active" : ""
            } ${typeof page === "string" ? "ellipsis" : ""}`}
            onClick={() => handlePageClick(page)}
            disabled={typeof page === "string"}
            aria-label={
              typeof page === "number" ? `Go to page ${page}` : "More pages"
            }
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className={`pagination__button pagination__button--next ${
          currentPage === totalPages ? "disabled" : ""
        }`}
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M4.5 3L7.5 6L4.5 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;

import React from 'react';

interface PaginationControlsProps {
  currentPage: number;
  setPage: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function PaginationControls({
  currentPage,
  setPage,
  totalItems,
  itemsPerPage
}: PaginationControlsProps): JSX.Element | null {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) {
    return null; // Don't render pagination if only one page
  }

  // Calculate page numbers to display (e.g., current +/- 2)
  const pages: number[] = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav aria-label="Page navigation" className="mt-3">
      <ul className="pagination justify-content-center">
        {/* First Button */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => setPage(1)} disabled={currentPage === 1}>First</button>
        </li>
        {/* Previous Button */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => setPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>Previous</button>
        </li>

        {/* Page Numbers */}
        {pages.map(pageNum => (
          <li key={pageNum} className={`page-item ${pageNum === currentPage ? 'active' : ''}`}>
            <button className="page-link" onClick={() => setPage(pageNum)}>
              {pageNum}
            </button>
          </li>
        ))}

        {/* Next Button */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => setPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>Next</button>
        </li>
        {/* Last Button */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => setPage(totalPages)} disabled={currentPage === totalPages}>Last</button>
        </li>
      </ul>
    </nav>
  );
} 
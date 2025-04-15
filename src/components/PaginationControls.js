import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function PaginationControls({ currentPage, setPage, totalItems, itemsPerPage }) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) {
        return null; // Don't render pagination if only one page
    }
    // Calculate page numbers to display (e.g., current +/- 2)
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }
    return (_jsx("nav", { "aria-label": "Page navigation", className: "mt-3", children: _jsxs("ul", { className: "pagination justify-content-center", children: [_jsx("li", { className: `page-item ${currentPage === 1 ? 'disabled' : ''}`, children: _jsx("button", { className: "page-link", onClick: () => setPage(1), disabled: currentPage === 1, children: "First" }) }), _jsx("li", { className: `page-item ${currentPage === 1 ? 'disabled' : ''}`, children: _jsx("button", { className: "page-link", onClick: () => setPage(Math.max(1, currentPage - 1)), disabled: currentPage === 1, children: "Previous" }) }), pages.map(pageNum => (_jsx("li", { className: `page-item ${pageNum === currentPage ? 'active' : ''}`, children: _jsx("button", { className: "page-link", onClick: () => setPage(pageNum), children: pageNum }) }, pageNum))), _jsx("li", { className: `page-item ${currentPage === totalPages ? 'disabled' : ''}`, children: _jsx("button", { className: "page-link", onClick: () => setPage(Math.min(totalPages, currentPage + 1)), disabled: currentPage === totalPages, children: "Next" }) }), _jsx("li", { className: `page-item ${currentPage === totalPages ? 'disabled' : ''}`, children: _jsx("button", { className: "page-link", onClick: () => setPage(totalPages), disabled: currentPage === totalPages, children: "Last" }) })] }) }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import FilterBadge from './FilterBadge';
export default function FilterControls({ searchTerm, setSearchTerm, badgeFilters, toggleBadgeFilter, toggleAllFilters, resetPage }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        resetPage();
    };
    const getActiveFilterCount = () => {
        return Object.values(badgeFilters).filter(Boolean).length;
    };
    const getActiveFilterIcons = () => {
        const icons = [];
        if (badgeFilters.correct)
            icons.push({ name: 'check-circle', className: 'text-success' });
        if (badgeFilters.late)
            icons.push({ name: 'clock-history', className: 'text-warning' });
        if (badgeFilters.missing)
            icons.push({ name: 'exclamation-triangle', className: 'text-danger' });
        if (badgeFilters.dayOff)
            icons.push({ name: 'calendar-check', className: 'text-secondary' });
        if (badgeFilters.didntWork)
            icons.push({ name: 'x-circle', className: 'text-dark' });
        if (badgeFilters.futureShift)
            icons.push({ name: 'calendar-date', className: 'text-primary' });
        return icons.length > 0 ? (_jsx("span", { className: "ms-2 active-filter-icons", children: icons.map((icon, index) => (_jsx("i", { className: `bi bi-${icon.name} me-1 ${icon.className}` }, index))) })) : null;
    };
    return (_jsx("div", { className: "mb-3", children: _jsxs("div", { className: "row", children: [_jsx("div", { className: "col-md-6 mb-2", children: _jsx("input", { type: "text", className: "form-control", placeholder: "Search by name or ID...", value: searchTerm, onChange: handleSearchChange }) }), _jsx("div", { className: "col-md-6 mb-2", children: _jsxs("div", { className: `dropdown ${isDropdownOpen ? 'show' : ''}`, children: [_jsxs("button", { className: "btn btn-outline-secondary dropdown-toggle w-100", type: "button", onClick: () => setIsDropdownOpen(!isDropdownOpen), "aria-expanded": isDropdownOpen, children: ["Filter by Status", getActiveFilterCount() > 0 &&
                                        _jsx("span", { className: "filter-counter ms-1", children: getActiveFilterCount() }), getActiveFilterIcons()] }), _jsxs("div", { className: `dropdown-menu p-3 filter-dropdown-menu ${isDropdownOpen ? 'show' : ''}`, style: { minWidth: '300px', width: '100%' }, children: [_jsxs("div", { className: "d-flex justify-content-between mb-2", children: [_jsx("button", { className: "btn btn-sm btn-outline-primary", onClick: (e) => { e.preventDefault(); e.stopPropagation(); toggleAllFilters(true); }, children: "Select All" }), _jsx("button", { className: "btn btn-sm btn-outline-secondary", onClick: (e) => { e.preventDefault(); e.stopPropagation(); toggleAllFilters(false); }, children: "Clear All" })] }), _jsx("div", { className: "dropdown-divider mb-2" }), _jsxs("div", { className: "d-flex flex-column gap-2", children: [_jsx(FilterBadge, { active: badgeFilters.correct, onClick: () => toggleBadgeFilter('correct'), className: "bg-success text-white", icon: "check-circle", text: "Correct Attendance" }), _jsx(FilterBadge, { active: badgeFilters.late, onClick: () => toggleBadgeFilter('late'), className: "bg-warning", icon: "clock-history", text: "Late/Early Departure" }), _jsx(FilterBadge, { active: badgeFilters.missing, onClick: () => toggleBadgeFilter('missing'), className: "bg-danger text-white", icon: "exclamation-triangle", text: "Missing Clock In/Out" }), _jsx(FilterBadge, { active: badgeFilters.dayOff, onClick: () => toggleBadgeFilter('dayOff'), className: "bg-secondary text-white", icon: "calendar-check", text: "Scheduled Day Off" }), _jsx(FilterBadge, { active: badgeFilters.didntWork, onClick: () => toggleBadgeFilter('didntWork'), className: "bg-dark text-white", icon: "x-circle", text: "Didn't Work" }), _jsx(FilterBadge, { active: badgeFilters.futureShift, onClick: () => toggleBadgeFilter('futureShift'), className: "bg-primary text-white", icon: "calendar-date", text: "Future Shift" })] })] })] }) })] }) }));
}

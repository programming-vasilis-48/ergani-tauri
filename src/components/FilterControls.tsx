import React, { useState } from 'react';
import FilterBadge from './FilterBadge';

export interface BadgeFilterState {
  correct: boolean;
  late: boolean;
  missing: boolean;
  dayOff: boolean;
  didntWork: boolean;
  futureShift: boolean;
}

interface FilterControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  badgeFilters: BadgeFilterState;
  toggleBadgeFilter: (filter: keyof BadgeFilterState) => void;
  toggleAllFilters: (state: boolean) => void;
  resetPage: () => void; // Function to reset pagination (e.g., setCurrentPage(1))
}

interface IconInfo {
  name: string;
  className: string;
}

export default function FilterControls({
  searchTerm,
  setSearchTerm,
  badgeFilters,
  toggleBadgeFilter,
  toggleAllFilters,
  resetPage
}: FilterControlsProps): JSX.Element {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    resetPage();
  };

  const getActiveFilterCount = () => {
    return Object.values(badgeFilters).filter(Boolean).length;
  };

  const getActiveFilterIcons = () => {
    const icons: IconInfo[] = [];
    if (badgeFilters.correct) icons.push({ name: 'check-circle', className: 'text-success' });
    if (badgeFilters.late) icons.push({ name: 'clock-history', className: 'text-warning' });
    if (badgeFilters.missing) icons.push({ name: 'exclamation-triangle', className: 'text-danger' });
    if (badgeFilters.dayOff) icons.push({ name: 'calendar-check', className: 'text-secondary' });
    if (badgeFilters.didntWork) icons.push({ name: 'x-circle', className: 'text-dark' });
    if (badgeFilters.futureShift) icons.push({ name: 'calendar-date', className: 'text-primary' });
    
    return icons.length > 0 ? (
      <span className="ms-2 active-filter-icons">
        {icons.map((icon, index) => (
          <i key={index} className={`bi bi-${icon.name} me-1 ${icon.className}`}></i>
        ))}
      </span>
    ) : null;
  };

  return (
    <div className="mb-3">
      <div className="row">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="col-md-6 mb-2">
          <div className={`dropdown ${isDropdownOpen ? 'show' : ''}`}>
            <button 
              className="btn btn-outline-secondary dropdown-toggle w-100" 
              type="button" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
            >
              Filter by Status
              {getActiveFilterCount() > 0 && 
                <span className="filter-counter ms-1">{getActiveFilterCount()}</span>
              }
              {getActiveFilterIcons()}
            </button>
            <div 
              className={`dropdown-menu p-3 filter-dropdown-menu ${isDropdownOpen ? 'show' : ''}`} 
              style={{ minWidth: '300px', width: '100%' }}
            >
              <div className="d-flex justify-content-between mb-2">
                <button 
                  className="btn btn-sm btn-outline-primary" 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleAllFilters(true); }}
                >
                  Select All
                </button>
                <button 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleAllFilters(false); }}
                >
                  Clear All
                </button>
              </div>
              <div className="dropdown-divider mb-2"></div>
              <div className="d-flex flex-column gap-2">
                <FilterBadge 
                  active={badgeFilters.correct}
                  onClick={() => toggleBadgeFilter('correct')}
                  className="bg-success text-white"
                  icon="check-circle"
                  text="Correct Attendance"
                />
                <FilterBadge 
                  active={badgeFilters.late}
                  onClick={() => toggleBadgeFilter('late')}
                  className="bg-warning"
                  icon="clock-history"
                  text="Late/Early Departure"
                />
                <FilterBadge 
                  active={badgeFilters.missing}
                  onClick={() => toggleBadgeFilter('missing')}
                  className="bg-danger text-white"
                  icon="exclamation-triangle"
                  text="Missing Clock In/Out"
                />
                <FilterBadge 
                  active={badgeFilters.dayOff}
                  onClick={() => toggleBadgeFilter('dayOff')}
                  className="bg-secondary text-white"
                  icon="calendar-check"
                  text="Scheduled Day Off"
                />
                <FilterBadge 
                  active={badgeFilters.didntWork}
                  onClick={() => toggleBadgeFilter('didntWork')}
                  className="bg-dark text-white"
                  icon="x-circle"
                  text="Didn't Work"
                />
                <FilterBadge 
                  active={badgeFilters.futureShift}
                  onClick={() => toggleBadgeFilter('futureShift')}
                  className="bg-primary text-white"
                  icon="calendar-date"
                  text="Future Shift"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
import React from 'react';
import FilterControls, { BadgeFilterState } from './FilterControls';
import EmployeeSortControls from './EmployeeSortControls';
import { SortDirection, isWeekend, getDateRowClass, getSortIndicator, getStatusBadge, getSeverityBadge, renderHoursWithDetails, renderTimeVertically, renderDifferences } from '../utils/displayUtils';
import { CombinedDataRow, EmployeeGroup } from '../types';

export type EmployeeTableColumns = 'Date' | 'ScheduledTime' | 'ActualTime' | 'Hours' | 'Difference' | 'Status' | 'Severity';

interface CombinedDataTableProps {
  combinedData: CombinedDataRow[];
  paginatedGroups: EmployeeGroup[];
  totalGroups: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  badgeFilters: BadgeFilterState;
  toggleBadgeFilter: (filter: keyof BadgeFilterState) => void;
  toggleAllFilters: (state: boolean) => void;
  employeeSort: {column: EmployeeTableColumns, direction: SortDirection};
  handleEmployeeSort: (column: EmployeeTableColumns) => void;
  employeeGroupSort: {column: 'AFM' | 'FirstName' | 'LastName', direction: SortDirection};
  handleEmployeeGroupSort: (column: 'AFM' | 'FirstName' | 'LastName') => void;
  downloadCsv: (data: CombinedDataRow[], filename: string) => void;
}

export default function CombinedDataTable({
  combinedData,
  paginatedGroups,
  totalGroups,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  searchTerm,
  setSearchTerm,
  badgeFilters,
  toggleBadgeFilter,
  toggleAllFilters,
  employeeSort,
  handleEmployeeSort,
  employeeGroupSort,
  handleEmployeeGroupSort,
  downloadCsv
}: CombinedDataTableProps): JSX.Element {
  
  // Paginator control
  const totalPages = Math.ceil(totalGroups / itemsPerPage);
  
  // Handler for employee sort column click
  const handleEmployeeSortClick = (column: EmployeeTableColumns) => {
    handleEmployeeSort(column);
  };
  
  return (
    <div className="combined-data-table">
      <div className="row mb-3 align-items-center">
        <div className="col-md-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search by AFM, Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="btn btn-outline-secondary" 
              type="button"
              onClick={() => downloadCsv(combinedData, 'ergani-data.csv')}
            >
              <i className="bi bi-download"></i> CSV
            </button>
          </div>
        </div>
        
        <div className="col-md-9">
          <FilterControls 
            badgeFilters={badgeFilters}
            toggleBadgeFilter={toggleBadgeFilter}
            toggleAllFilters={toggleAllFilters}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            resetPage={() => setCurrentPage(1)}
          />
        </div>
      </div>
      
      {/* Employee Group Sort Controls */}
      <EmployeeSortControls
        sortConfig={employeeGroupSort}
        onSort={handleEmployeeGroupSort}
      />
      
      {paginatedGroups.length > 0 ? (
        <>
          {paginatedGroups.map((group) => (
            <div key={group.afm} className="card mb-4 employee-card">
              <div className="card-header">
                <div className="row">
                  <div className="col">
                    <strong>Last Name:</strong> {group.data[0]["Last Name"]}
                    {' | '}
                    <strong>First Name:</strong> {group.data[0]["First Name"]}
                    {' | '}
                    <strong>AFM:</strong> {group.afm}
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-bordered table-striped table-hover mb-0">
                    <thead>
                      <tr>
                        <th className="cursor-pointer" onClick={() => handleEmployeeSortClick('Status')}>
                          Status {getSortIndicator(employeeSort.column, 'Status', employeeSort.direction)}
                        </th>
                        <th className="cursor-pointer" onClick={() => handleEmployeeSortClick('Date')}>
                          Date {getSortIndicator(employeeSort.column, 'Date', employeeSort.direction)}
                        </th>
                        <th className="cursor-pointer" onClick={() => handleEmployeeSortClick('ScheduledTime')}>
                          Scheduled Time {getSortIndicator(employeeSort.column, 'ScheduledTime', employeeSort.direction)}
                        </th>
                        <th className="cursor-pointer" onClick={() => handleEmployeeSortClick('ActualTime')}>
                          Actual Time {getSortIndicator(employeeSort.column, 'ActualTime', employeeSort.direction)}
                        </th>
                        <th className="cursor-pointer" onClick={() => handleEmployeeSortClick('Hours')}>
                          Hours {getSortIndicator(employeeSort.column, 'Hours', employeeSort.direction)}
                        </th>
                        <th className="cursor-pointer" onClick={() => handleEmployeeSortClick('Difference')}>
                          Difference {getSortIndicator(employeeSort.column, 'Difference', employeeSort.direction)}
                        </th>
                        <th className="cursor-pointer" onClick={() => handleEmployeeSortClick('Severity')}>
                          Severity {getSortIndicator(employeeSort.column, 'Severity', employeeSort.direction)}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.data.map((row, rowIndex) => {
                        // Get date for row
                        const dateStr = row["Schedule Start Date"] || row["Date"] || '';
                        const isHoliday = row["Is Holiday"] === 'True';
                        
                        return (
                          <tr 
                            key={rowIndex} 
                            className={getDateRowClass(dateStr, isHoliday)}
                          >
                            <td>
                              {getStatusBadge(row.Summary || '')}
                            </td>
                            <td>
                              {dateStr}
                              {isHoliday && <span className="badge bg-info ms-1">Holiday</span>}
                            </td>
                            <td>
                              {renderTimeVertically(
                                row["Schedule Start Time"] || '', 
                                row["Schedule End Time"] || ''
                              )}
                            </td>
                            <td>
                              {renderTimeVertically(
                                row["Actual Start Time"] || '', 
                                row["Actual End Time"] || ''
                              )}
                            </td>
                            <td>
                              {renderHoursWithDetails(row)}
                            </td>
                            <td>
                              {renderDifferences(
                                row["Start Diff"] || '',
                                row["Finish Diff"] || '',
                                row.Summary && row.Summary.includes("Total diff:") 
                                  ? row.Summary.split("Total diff:")[1].trim() 
                                  : ''
                              )}
                            </td>
                            <td>
                              {getSeverityBadge(row.Severity || '')}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
          
          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <label htmlFor="itemsPerPage" className="me-2">Items per page:</label>
              <select
                id="itemsPerPage"
                className="form-select form-select-sm"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="ms-3">
                Showing {paginatedGroups.length} of {totalGroups} employees
              </span>
            </div>
            
            <nav aria-label="Page navigation">
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Calculate which page numbers to show
                  let pageNum = i + 1;
                  if (totalPages > 5) {
                    if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                  }
                  
                  return (
                    <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    </li>
                  );
                })}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </>
      ) : (
        <div className="alert alert-info">No data found matching your criteria.</div>
      )}
    </div>
  );
} 
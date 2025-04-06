import React from 'react';
import PaginationControls from './PaginationControls';
import { getSortIndicator, getHoursDiffClass, SortDirection } from '../utils/displayUtils';
import { SummaryDataRow } from '../types';

export type SummaryTableColumns = 'AFM' | 'PLANNED_HOURS' | 'ACTUAL_HOURS' | 'DIFFERENCE_HOURS' | 'MISSED_DAYS' | 'FORGOT_TO_CLOCK_IN_OUT';

interface SummaryDataTableProps {
  summaryData: SummaryDataRow[];
  paginatedSummary: SummaryDataRow[];
  summaryPage: number;
  setSummaryPage: (page: number) => void;
  summaryPerPage: number;
  setSummaryPerPage: (perPage: number) => void;
  summarySearch: string;
  setSummarySearch: (term: string) => void;
  summarySort: { column: SummaryTableColumns; direction: SortDirection };
  handleSummarySort: (column: SummaryTableColumns) => void;
  downloadCsv: (data: SummaryDataRow[], filename: string) => void;
}

export default function SummaryDataTable({
  summaryData,
  paginatedSummary,
  summaryPage,
  setSummaryPage,
  summaryPerPage,
  setSummaryPerPage,
  summarySearch,
  setSummarySearch,
  summarySort,
  handleSummarySort,
  downloadCsv
}: SummaryDataTableProps): JSX.Element {

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSummaryPerPage(Number(e.target.value));
    setSummaryPage(1); // Reset to first page
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSummarySearch(e.target.value);
    setSummaryPage(1); // Reset to first page
  };

  return (
    <section id="summarySection" className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Employee Summary</h3>
        <div className="d-flex gap-2">
          <select 
            className="form-select" 
            value={summaryPerPage} 
            onChange={handleItemsPerPageChange}
            style={{ width: 'auto' }}
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </select>
          <button
            className="btn btn-outline-secondary"
            onClick={() => downloadCsv(summaryData, 'summary_data.csv')}
            disabled={!summaryData || summaryData.length === 0}
          >
            Download CSV
          </button>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="row">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by employee ID..."
              value={summarySearch}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
      
      <div className="table-responsive custom-table-container">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSummarySort('AFM')}>
                Employee ID {getSortIndicator(summarySort.column, 'AFM', summarySort.direction)}
              </th>
              <th className="sortable" onClick={() => handleSummarySort('PLANNED_HOURS')}>
                Planned Hours {getSortIndicator(summarySort.column, 'PLANNED_HOURS', summarySort.direction)}
              </th>
              <th className="sortable" onClick={() => handleSummarySort('ACTUAL_HOURS')}>
                Actual Hours {getSortIndicator(summarySort.column, 'ACTUAL_HOURS', summarySort.direction)}
              </th>
              <th className="sortable" onClick={() => handleSummarySort('DIFFERENCE_HOURS')}>
                Difference {getSortIndicator(summarySort.column, 'DIFFERENCE_HOURS', summarySort.direction)}
              </th>
              <th className="sortable" onClick={() => handleSummarySort('MISSED_DAYS')}>
                Missed Days {getSortIndicator(summarySort.column, 'MISSED_DAYS', summarySort.direction)}
              </th>
              <th className="sortable" onClick={() => handleSummarySort('FORGOT_TO_CLOCK_IN_OUT')}>
                Forgot Clock In/Out {getSortIndicator(summarySort.column, 'FORGOT_TO_CLOCK_IN_OUT', summarySort.direction)}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedSummary.length > 0 ? (
              paginatedSummary.map((row, idx) => {
                const diff = parseFloat(row.DIFFERENCE_HOURS) || 0;
                return (
                  <tr key={idx}>
                    <td>{row.AFM}</td>
                    <td>{parseFloat(row.PLANNED_HOURS).toFixed(2)}</td>
                    <td>{parseFloat(row.ACTUAL_HOURS).toFixed(2)}</td>
                    <td className={getHoursDiffClass(diff)}>
                      {diff.toFixed(2)}
                    </td>
                    <td>{row.MISSED_DAYS}</td>
                    <td>{row.FORGOT_TO_CLOCK_IN_OUT}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  No summary records found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {summaryData.length > 0 && (
        <PaginationControls
          currentPage={summaryPage}
          setPage={setSummaryPage}
          totalItems={summaryData.length}
          itemsPerPage={summaryPerPage}
        />
      )}
    </section>
  );
} 
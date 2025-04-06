import React from 'react';
import { SortDirection } from '../utils/displayUtils'; // Assuming SortDirection is in displayUtils

export type EmployeeGroupColumns = 'AFM' | 'FirstName' | 'LastName';

interface EmployeeSortControlsProps {
  sortConfig: { column: EmployeeGroupColumns; direction: SortDirection };
  onSort: (column: EmployeeGroupColumns) => void;
}

export default function EmployeeSortControls({ 
  sortConfig, 
  onSort 
}: EmployeeSortControlsProps): JSX.Element {

  const renderSortButton = (column: EmployeeGroupColumns, label: string) => (
    <button 
      className={`btn btn-sm ${sortConfig.column === column ? 'btn-primary' : 'btn-outline-secondary'}`}
      onClick={() => onSort(column)}
    >
      {label}
      {sortConfig.column === column && (
        sortConfig.direction === 'asc' 
          ? <i className="bi bi-arrow-up ms-1"></i> 
          : <i className="bi bi-arrow-down ms-1"></i>
      )}
    </button>
  );

  return (
    <div className="mb-3">
      <div className="d-flex align-items-center">
        <span className="me-2">Sort employees by:</span>
        <div className="btn-group">
          {renderSortButton('AFM', 'Employee ID')}
          {renderSortButton('FirstName', 'First Name')}
          {renderSortButton('LastName', 'Last Name')}
        </div>
      </div>
    </div>
  );
} 
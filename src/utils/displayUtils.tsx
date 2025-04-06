import React from 'react';

// Define types for sorting shared across components
export type SortDirection = 'asc' | 'desc';

// Helper function to get sort indicator JSX
export const getSortIndicator = (column: string, currentColumn: string, direction: SortDirection): JSX.Element | null => {
  if (column !== currentColumn) return null;
  return direction === 'asc' ? <i className="bi bi-caret-up-fill ms-1"></i> : <i className="bi bi-caret-down-fill ms-1"></i>;
};

// Helper function to format hours difference class
export const getHoursDiffClass = (diff: number): string => {
  if (isNaN(diff)) return "";
  if (diff > 0) {
    return "text-success fw-bold";
  } else if (diff < 0) {
    return "text-danger fw-bold";
  }
  return "";
};

// Helper function to format time difference class
export const getTimeDiffClass = (diff: string): string => {
  if (!diff) return "";
  if (diff.startsWith("+")) {
    return "text-success fw-bold";
  } else if (diff.startsWith("-")) {
    return "text-danger fw-bold";
  }
  return "";
};

// Helper to check if a date string (YYYY-MM-DD) is a weekend
export const isWeekend = (dateString: string): boolean => {
  if (!dateString) return false;
  try {
    const date = new Date(dateString + 'T00:00:00'); // Ensure parsing as local time
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    return day === 0 || day === 6;
  } catch (e) {
    console.error("Error parsing date for weekend check:", dateString, e);
    return false;
  }
};

// Helper function to get the row class based on date and holiday flag
export const getDateRowClass = (dateString: string, isHoliday: boolean): string => {
  if (!dateString) return '';
  
  const weekend = isWeekend(dateString);
  
  let classes: string[] = []; 
  if (isHoliday) classes.push('is-holiday');
  if (weekend) classes.push('is-weekend');
  
  return classes.join(' '); 
};

// Helper functions for status formatting
export const getStatusBadge = (status: string): JSX.Element | null => {
  if (!status) return null;
  let className = ""; 
  let icon = "";
  let displayText = "";
  
  if (status.includes("Scheduled day off")) { 
    className = "bg-secondary text-white"; 
    icon = "calendar-check"; 
    displayText = "Scheduled Day Off";
  }
  else if (status.includes("Missing clock")) { 
    className = "bg-danger text-white"; 
    icon = "exclamation-triangle"; 
    displayText = "Missing Clock In/Out";
  }
  else if (status.includes("Didn't work")) { 
    className = "bg-dark text-white"; 
    icon = "x-circle"; 
    displayText = "Didn't Work";
  }
  else if (status.includes("Future shift")) { 
    className = "bg-primary text-white"; 
    icon = "calendar-date"; 
    displayText = "Future Shift";
  }
  else if (status.includes("Total diff")) {
    const diffText = status.replace("Total diff: ", "");
    if (diffText.startsWith("-")) { 
      className = "bg-warning"; 
      icon = "clock-history"; 
      displayText = "Late/Early Departure";
    }
    else { 
      className = "bg-success text-white"; 
      icon = "check-circle"; 
      displayText = "Correct Attendance";
    }
  }
  
  return <span className={`badge ${className} p-2`}><i className={`bi bi-${icon} me-1`}></i> {displayText}</span>;
};

// Helper function to render time in a vertical format
export const renderTimeVertically = (startTime: string, endTime: string): JSX.Element => {
  const renderItem = (label: string, value: string, missingText: string) => (
    <div className="time-item">
      <span className="time-label">{label}:</span>
      {value ? <span>{value}</span> : <span className="text-danger">{missingText}</span>}
    </div>
  );
  if (!startTime && !endTime) return <span className="text-secondary">N/A</span>;
  return (
    <div className="time-container">
      {renderItem('Start', startTime, 'Missing')}
      {renderItem('End', endTime, 'Missing')}
    </div>
  );
};

// Function to render all difference values
export const renderDifferences = (startDiff: string, endDiff: string, totalDiff: string) => {
  const renderDiffItem = (label: string, value: string, className: string) => (
    <div className={`difference-item ${className}`}>
      <span className={className === 'difference-primary' ? 'difference-label-primary' : 'difference-label'}>{label}:</span>
      {value ? <span className={getTimeDiffClass(value)}>{value}</span> : <span className="text-danger">Missing</span>}
    </div>
  );

  return (
    <div className="difference-container">
      {renderDiffItem('Start', startDiff, 'difference-secondary')}
      {renderDiffItem('End', endDiff, 'difference-secondary')}
      {renderDiffItem('Total', totalDiff, 'difference-primary')}
    </div>
  );
};

// Helper function to get severity badge
export const getSeverityBadge = (severity: string): JSX.Element => {
  if (!severity || severity === 'N/A') return <span className="text-secondary">N/A</span>;
  
  let className = ""; 
  let icon = "";
  let displayText = severity;
  
  switch (severity) {
    case "Critical": 
      className = "bg-danger text-white"; 
      icon = "exclamation-octagon"; 
      displayText = "Critical Issue";
      break;
    case "High": 
      className = "bg-orange text-white"; 
      icon = "exclamation-triangle"; 
      displayText = "Major Issue";
      break;
    case "Medium": 
      className = "bg-warning"; 
      icon = "exclamation"; 
      displayText = "Minor Issue";
      break;
    case "Low": 
      className = "bg-success-light text-success"; 
      icon = "check-circle"; 
      displayText = "No Issues";
      break;
    default: 
      className = "bg-secondary text-white"; 
      icon = "dash-circle";
  }
  
  return <span className={`badge ${className} p-2`}><i className={`bi bi-${icon} me-1`}></i> {displayText}</span>;
};

// Helper function to render hours with details
export const renderHoursWithDetails = (row: any): JSX.Element | null => {
  if (!row) return null;
  const totalHours = parseFloat(row["Planned Hours"] || "0").toFixed(2);
  const nightHours = parseFloat(row["Planned Night Hours"] || "0").toFixed(2);
  const sundayHours = parseFloat(row["Planned Sunday Hours"] || "0").toFixed(2);
  const holidayHours = parseFloat(row["Planned Holiday Hours"] || "0").toFixed(2);
  
  return (
    <div className="hours-container">
      {parseFloat(nightHours) > 0 && (
        <div className="hours-item hours-secondary"><span className="hours-label">Night:</span><span className="text-info">{nightHours}</span></div>
      )}
      {parseFloat(sundayHours) > 0 && (
        <div className="hours-item hours-secondary"><span className="hours-label">Sunday:</span><span className="text-primary">{sundayHours}</span></div>
      )}
      {parseFloat(holidayHours) > 0 && (
        <div className="hours-item hours-secondary"><span className="hours-label">Holiday:</span><span className="text-danger">{holidayHours}</span></div>
      )}
      <div className="hours-item hours-primary"><span className="hours-label-primary">Total:</span><span>{totalHours}</span></div>
    </div>
  );
}; 
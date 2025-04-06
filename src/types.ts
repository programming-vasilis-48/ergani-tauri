/**
 * Type definitions for the Ergani Schedule Manager application
 */

/**
 * Data structure for a combined data row from the backend
 */
export interface CombinedDataRow {
  AFM: string;
  Branch: string;
  "First Name": string;
  "Last Name": string;
  "Planned Start (ISO)"?: string;
  "Actual Start (ISO)"?: string;
  "Planned End (ISO)"?: string;
  "Actual End (ISO)"?: string;
  Break?: string;
  "Schedule Start Date"?: string;
  "Schedule Start Time"?: string;
  "Schedule End Date"?: string;
  "Schedule End Time"?: string;
  "Actual Start Date"?: string;
  "Actual Start Time"?: string;
  "Actual End Date"?: string;
  "Actual End Time"?: string;
  "Start Diff"?: string;
  "Finish Diff"?: string;
  Summary?: string;
  Severity?: string;
  "Planned Hours"?: string;
  "Planned Night Hours"?: string;
  "Planned Sunday Hours"?: string;
  "Planned Holiday Hours"?: string;
  isHoliday: boolean;
  // Other possible fields
  [key: string]: any;
}

/**
 * Data structure for a summary row from the backend
 */
export interface SummaryDataRow {
  AFM: string;
  PLANNED_HOURS: string;
  ACTUAL_HOURS: string;
  DIFFERENCE_HOURS: string;
  MISSED_DAYS: string;
  FORGOT_TO_CLOCK_IN_OUT: string;
  // Other possible fields
  [key: string]: any;
}

/**
 * Data structure for an employee group (used in CombinedDataTable)
 */
export interface EmployeeGroup {
  afm: string;
  data: CombinedDataRow[];
}

/**
 * User information structure
 */
export interface User {
  id: string;
  username: string;
  name?: string;
  // Add other user fields as needed
} 
export type DateRange = 'thisMonth' | 'thisMonthTillToday' | 'custom';

export interface DateRangeResult {
  start_date: string;
  end_date: string;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
}

export function calculateDateRange(selectedRange: DateRange, customStartDate?: string, customEndDate?: string): DateRangeResult {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  switch (selectedRange) {
    case 'thisMonth':
      return {
        start_date: formatDate(firstDayOfMonth),
        end_date: formatDate(lastDayOfMonth)
      };
    case 'thisMonthTillToday':
      return {
        start_date: formatDate(firstDayOfMonth),
        end_date: formatDate(today)
      };
    case 'custom':
      if (!customStartDate || !customEndDate) {
        throw new Error('Custom date range requires both start and end dates');
      }
      return {
        start_date: customStartDate,
        end_date: customEndDate
      };
    default:
      throw new Error('Invalid date range selected');
  }
}

export function validateDateRange(startDate: string, endDate: string): void {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date format');
  }
  
  if (start > end) {
    throw new Error('Start date must be before or equal to end date');
  }
  
  const today = new Date();
  if (end > today) {
    throw new Error('End date cannot be in the future');
  }
} 
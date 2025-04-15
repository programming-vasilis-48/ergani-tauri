import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useCallback } from 'react';
import { useAppState } from '../hooks/useAppState';
import CombinedDataTable from './CombinedDataTable';
import SummaryDataTable from './SummaryDataTable';
// Helper to check if a date string (YYYY-MM-DD) is a weekend
const isWeekend = (dateString) => {
    if (!dateString)
        return false;
    try {
        const date = new Date(dateString + 'T00:00:00'); // Ensure parsing as local time
        const day = date.getDay(); // 0 = Sunday, 6 = Saturday
        return day === 0 || day === 6;
    }
    catch (e) {
        console.error("Error parsing date for weekend check:", dateString, e);
        return false;
    }
};
// Helper function to get the row class based on date and holiday flag
// NOW USES the pre-computed holiday set
// ** UPDATED to use isHoliday flag from row data **
const getDateRowClass = (dateString, isHoliday) => {
    if (!dateString)
        return '';
    const weekend = isWeekend(dateString);
    let classes = [];
    if (isHoliday)
        classes.push('is-holiday');
    if (weekend)
        classes.push('is-weekend');
    return classes.join(' ');
};
// Helper function to render hours with details
const renderHoursWithDetails = (row) => {
    if (!row)
        return null;
    const totalHours = parseFloat(row["Planned Hours"] || "0").toFixed(2);
    const nightHours = parseFloat(row["Planned Night Hours"] || "0").toFixed(2);
    const sundayHours = parseFloat(row["Planned Sunday Hours"] || "0").toFixed(2);
    const holidayHours = parseFloat(row["Planned Holiday Hours"] || "0").toFixed(2);
    // Check if this is a Sunday
    const dateStr = row["Schedule Start Date"] || row["Date"] || "";
    const isSundayDay = isWeekend(dateStr) && new Date(dateStr).getDay() === 0; // Check if it's specifically a Sunday
    return (_jsxs("div", { className: "hours-container", children: [parseFloat(nightHours) > 0 && (_jsxs("div", { className: "hours-item hours-secondary", children: [_jsx("span", { className: "hours-label", children: "Night:" }), _jsx("span", { className: "text-info", children: nightHours })] })), parseFloat(sundayHours) > 0 && (_jsxs("div", { className: "hours-item hours-secondary", children: [_jsx("span", { className: "hours-label", children: "Sunday:" }), _jsx("span", { className: "text-primary", children: sundayHours })] })), parseFloat(holidayHours) > 0 && (_jsxs("div", { className: "hours-item hours-secondary", children: [_jsx("span", { className: "hours-label", children: "Holiday:" }), _jsx("span", { className: "text-danger", children: holidayHours })] })), _jsxs("div", { className: "hours-item hours-primary", children: [_jsx("span", { className: "hours-label-primary", children: "Total:" }), _jsx("span", { children: totalHours })] })] }));
};
export default function DataDisplay() {
    const { data: { combined, summary } } = useAppState();
    const [activeTab, setActiveTab] = useState('combined');
    // Combined data pagination and filtering state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    // Badge filters state
    const [badgeFilters, setBadgeFilters] = useState({
        correct: true,
        late: true,
        missing: true,
        dayOff: true,
        didntWork: true,
        futureShift: true
    });
    // Summary pagination
    const [summaryPage, setSummaryPage] = useState(1);
    const [summaryPerPage, setSummaryPerPage] = useState(10);
    const [summarySearch, setSummarySearch] = useState('');
    // Sorting state
    const [summarySort, setSummarySort] = useState({
        column: 'DIFFERENCE_HOURS',
        direction: 'desc'
    });
    const [employeeSort, setEmployeeSort] = useState({
        column: 'Date',
        direction: 'asc'
    });
    const [employeeGroupSort, setEmployeeGroupSort] = useState({
        column: 'AFM',
        direction: 'asc'
    });
    // Toggle badge filter
    const toggleBadgeFilter = (filter) => {
        setBadgeFilters(prev => ({
            ...prev,
            [filter]: !prev[filter]
        }));
        setCurrentPage(1);
    };
    // Toggle all badge filters
    const toggleAllFilters = (state) => {
        setBadgeFilters({
            correct: state,
            late: state,
            missing: state,
            dayOff: state,
            didntWork: state,
            futureShift: state
        });
        setCurrentPage(1);
    };
    // Handle sorting for summary table
    const handleSummarySort = (column) => {
        setSummarySort(prev => ({
            column,
            direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };
    // Handle sorting for employee data table
    const handleEmployeeSort = (column) => {
        setEmployeeSort(prev => ({
            column,
            direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };
    // Handle sorting for employee groups
    const handleEmployeeGroupSort = (column) => {
        setEmployeeGroupSort(prev => ({
            column,
            direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };
    // Function to download data as CSV
    const downloadCsv = useCallback((data, filename) => {
        if (!data || data.length === 0)
            return;
        const csvContent = [
            // Headers
            Object.keys(data[0]).join(','),
            // Data
            ...data.map(row => Object.values(row).map(val => `"${val?.toString().replace(/"/g, '""') || ''}"`)
                .join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, []);
    // Filter combined data
    const filteredData = useMemo(() => {
        if (!combined)
            return [];
        return combined
            .filter(row => {
            // Apply status filter dropdown
            if (statusFilter !== 'all' && row.Summary !== statusFilter) {
                return false;
            }
            // Apply badge filters
            const summary = row.Summary || '';
            // Check for day off filter
            if (!badgeFilters.dayOff && summary.includes("Scheduled day off")) {
                return false;
            }
            // Check for missing clock in/out filter
            if (!badgeFilters.missing && (summary.includes("Missing clock-in") || summary.includes("Missing clock-out"))) {
                return false;
            }
            // Check for didn't work filter
            if (!badgeFilters.didntWork && summary.includes("Didn't work")) {
                return false;
            }
            // Check for future shift filter
            if (!badgeFilters.futureShift && summary.includes("Future shift")) {
                return false;
            }
            // Check for late/early departure filter (indicated by Total diff: -XX:XX)
            if (!badgeFilters.late && summary.includes("Total diff: -")) {
                return false;
            }
            // Check for correct attendance filter (Total diff that is positive or zero)
            if (!badgeFilters.correct && (summary.includes("Total diff: +") || summary.includes("Total diff: 00:00"))) {
                return false;
            }
            // Apply search filter
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                return ((row.AFM?.toString() || '').toLowerCase().includes(searchLower) ||
                    (row["First Name"]?.toString() || '').toLowerCase().includes(searchLower) ||
                    (row["Last Name"]?.toString() || '').toLowerCase().includes(searchLower));
            }
            return true;
        })
            .sort((a, b) => {
            // Sort by Last Name, First Name, then AFM
            const lastNameComp = a["Last Name"]?.localeCompare(b["Last Name"] || '') || 0;
            if (lastNameComp !== 0)
                return lastNameComp;
            const firstNameComp = a["First Name"]?.localeCompare(b["First Name"] || '') || 0;
            if (firstNameComp !== 0)
                return firstNameComp;
            // Then by AFM
            return a.AFM?.toString().localeCompare(b.AFM?.toString() || '') || 0;
        });
    }, [combined, searchTerm, statusFilter, badgeFilters]);
    // Helper function to sort employee data within groups
    const sortEmployeeData = useCallback((data, column, direction) => {
        return [...data].sort((a, b) => {
            let comparison = 0;
            const multiplier = direction === 'asc' ? 1 : -1;
            switch (column) {
                case 'Date':
                    // Sort by date
                    const dateA = new Date(a["Schedule Start Date"] || a["Date"] || "1970-01-01");
                    const dateB = new Date(b["Schedule Start Date"] || b["Date"] || "1970-01-01");
                    comparison = dateA.getTime() - dateB.getTime();
                    break;
                case 'Hours':
                    // Sort by planned hours
                    const hoursA = parseFloat(a["Planned Hours"] || "0") || 0;
                    const hoursB = parseFloat(b["Planned Hours"] || "0") || 0;
                    comparison = hoursA - hoursB;
                    break;
                case 'Severity':
                    // Sort by severity
                    const severityOrder = { "Critical": 4, "High": 3, "Medium": 2, "Low": 1, "": 0 };
                    comparison = (severityOrder[a.Severity || ""] || 0) - (severityOrder[b.Severity || ""] || 0);
                    break;
                case 'Status':
                    // Sort by status
                    comparison = (a.Summary || "").localeCompare(b.Summary || "");
                    break;
                case 'Difference':
                    // Sort by total difference
                    let diffA = 0;
                    let diffB = 0;
                    if (a.Summary && a.Summary.includes("Total diff: ")) {
                        const diff = a.Summary.split("Total diff: ")[1].trim();
                        diffA = parseFloat(diff) || 0;
                    }
                    if (b.Summary && b.Summary.includes("Total diff: ")) {
                        const diff = b.Summary.split("Total diff: ")[1].trim();
                        diffB = parseFloat(diff) || 0;
                    }
                    comparison = diffA - diffB;
                    break;
                case 'ScheduledTime':
                    // Sort by scheduled start time
                    const timeA = a["Schedule Start Time"] || "";
                    const timeB = b["Schedule Start Time"] || "";
                    comparison = timeA.localeCompare(timeB);
                    break;
                case 'ActualTime':
                    // Sort by actual start time
                    const actualA = a["Actual Start Time"] || "";
                    const actualB = b["Actual Start Time"] || "";
                    comparison = actualA.localeCompare(actualB);
                    break;
                default:
                    break;
            }
            return comparison * multiplier;
        });
    }, []);
    // Group and sort data
    const groupedData = useMemo(() => {
        if (!filteredData.length)
            return {};
        const groups = {};
        filteredData.forEach(row => {
            const afm = row.AFM?.toString() || 'Unknown';
            if (!groups[afm]) {
                groups[afm] = [];
            }
            groups[afm].push(row);
        });
        // Sort each group's data according to the employee sort settings
        Object.keys(groups).forEach(key => {
            groups[key] = sortEmployeeData(groups[key], employeeSort.column, employeeSort.direction);
        });
        return groups;
    }, [filteredData, employeeSort, sortEmployeeData]);
    // Get paginated groups for combined data
    const paginatedGroups = useMemo(() => {
        const groupKeys = Object.keys(groupedData);
        // Sort the group keys based on employeeGroupSort
        const sortedGroupKeys = [...groupKeys].sort((a, b) => {
            const groupA = groupedData[a][0];
            const groupB = groupedData[b][0];
            const multiplier = employeeGroupSort.direction === 'asc' ? 1 : -1;
            switch (employeeGroupSort.column) {
                case 'AFM':
                    return multiplier * (a.localeCompare(b));
                case 'FirstName':
                    return multiplier * ((groupA["First Name"] || '').localeCompare(groupB["First Name"] || ''));
                case 'LastName':
                    return multiplier * ((groupA["Last Name"] || '').localeCompare(groupB["Last Name"] || ''));
                default:
                    return 0;
            }
        });
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, sortedGroupKeys.length);
        return sortedGroupKeys.slice(startIndex, endIndex).map(key => ({
            afm: key,
            data: groupedData[key]
        }));
    }, [groupedData, currentPage, itemsPerPage, employeeGroupSort]);
    // Filter and sort summary data
    const filteredSummary = useMemo(() => {
        if (!summary)
            return [];
        return summary
            .filter(row => {
            if (summarySearch) {
                const searchLower = summarySearch.toLowerCase();
                return row.AFM?.toString().includes(searchLower);
            }
            return true;
        })
            .sort((a, b) => {
            const multiplier = summarySort.direction === 'asc' ? 1 : -1;
            switch (summarySort.column) {
                case 'AFM':
                    return multiplier * (a.AFM?.toString() || '').localeCompare(b.AFM?.toString() || '');
                case 'PLANNED_HOURS':
                    return multiplier * (parseFloat(a.PLANNED_HOURS) - parseFloat(b.PLANNED_HOURS));
                case 'ACTUAL_HOURS':
                    return multiplier * (parseFloat(a.ACTUAL_HOURS) - parseFloat(b.ACTUAL_HOURS));
                case 'DIFFERENCE_HOURS':
                    return multiplier * (parseFloat(a.DIFFERENCE_HOURS) - parseFloat(b.DIFFERENCE_HOURS));
                case 'MISSED_DAYS':
                    return multiplier * (parseInt(a.MISSED_DAYS) - parseInt(b.MISSED_DAYS));
                case 'FORGOT_TO_CLOCK_IN_OUT':
                    return multiplier * (parseInt(a.FORGOT_TO_CLOCK_IN_OUT) - parseInt(b.FORGOT_TO_CLOCK_IN_OUT));
                default:
                    return 0;
            }
        });
    }, [summary, summarySearch, summarySort]);
    // Paginate summary data
    const paginatedSummary = useMemo(() => {
        const startIndex = (summaryPage - 1) * summaryPerPage;
        const endIndex = Math.min(startIndex + summaryPerPage, filteredSummary.length);
        return filteredSummary.slice(startIndex, endIndex);
    }, [filteredSummary, summaryPage, summaryPerPage]);
    return (_jsxs("div", { className: "data-display", children: [_jsxs("ul", { className: "nav nav-tabs mb-4", children: [_jsx("li", { className: "nav-item", children: _jsx("button", { className: `nav-link ${activeTab === 'combined' ? 'active' : ''}`, onClick: () => setActiveTab('combined'), children: "Employee Details" }) }), _jsx("li", { className: "nav-item", children: _jsx("button", { className: `nav-link ${activeTab === 'summary' ? 'active' : ''}`, onClick: () => setActiveTab('summary'), children: "Summary" }) })] }), _jsxs("div", { className: "tab-content", children: [_jsx("div", { className: activeTab === 'combined' ? '' : 'd-none', children: combined && (_jsx(CombinedDataTable, { combinedData: combined, paginatedGroups: paginatedGroups, totalGroups: Object.keys(groupedData).length, currentPage: currentPage, setCurrentPage: setCurrentPage, itemsPerPage: itemsPerPage, setItemsPerPage: setItemsPerPage, searchTerm: searchTerm, setSearchTerm: setSearchTerm, badgeFilters: badgeFilters, toggleBadgeFilter: toggleBadgeFilter, toggleAllFilters: toggleAllFilters, employeeSort: employeeSort, handleEmployeeSort: handleEmployeeSort, employeeGroupSort: employeeGroupSort, handleEmployeeGroupSort: handleEmployeeGroupSort, downloadCsv: downloadCsv })) }), _jsx("div", { className: activeTab === 'summary' ? '' : 'd-none', children: summary && (_jsx(SummaryDataTable, { summaryData: filteredSummary, paginatedSummary: paginatedSummary, summaryPage: summaryPage, setSummaryPage: setSummaryPage, summaryPerPage: summaryPerPage, setSummaryPerPage: setSummaryPerPage, summarySearch: summarySearch, setSummarySearch: setSummarySearch, summarySort: summarySort, handleSummarySort: handleSummarySort, downloadCsv: downloadCsv })) })] })] }));
}

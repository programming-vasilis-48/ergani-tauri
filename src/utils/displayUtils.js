import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Helper function to get sort indicator JSX
export const getSortIndicator = (column, currentColumn, direction) => {
    if (column !== currentColumn)
        return null;
    return direction === 'asc' ? _jsx("i", { className: "bi bi-caret-up-fill ms-1" }) : _jsx("i", { className: "bi bi-caret-down-fill ms-1" });
};
// Helper function to format hours difference class
export const getHoursDiffClass = (diff) => {
    if (isNaN(diff))
        return "";
    if (diff > 0) {
        return "text-success fw-bold";
    }
    else if (diff < 0) {
        return "text-danger fw-bold";
    }
    return "";
};
// Helper function to format time difference class
export const getTimeDiffClass = (diff) => {
    if (!diff)
        return "";
    if (diff.startsWith("+")) {
        return "text-success fw-bold";
    }
    else if (diff.startsWith("-")) {
        return "text-danger fw-bold";
    }
    return "";
};
// Helper to check if a date string (YYYY-MM-DD) is a weekend
export const isWeekend = (dateString) => {
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
export const getDateRowClass = (dateString, isHoliday) => {
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
// Helper functions for status formatting
export const getStatusBadge = (status) => {
    if (!status)
        return null;
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
    return _jsxs("span", { className: `badge ${className} p-2`, children: [_jsx("i", { className: `bi bi-${icon} me-1` }), " ", displayText] });
};
// Helper function to render time in a vertical format
export const renderTimeVertically = (startTime, endTime) => {
    const renderItem = (label, value, missingText) => (_jsxs("div", { className: "time-item", children: [_jsxs("span", { className: "time-label", children: [label, ":"] }), value ? _jsx("span", { children: value }) : _jsx("span", { className: "text-danger", children: missingText })] }));
    if (!startTime && !endTime)
        return _jsx("span", { className: "text-secondary", children: "N/A" });
    return (_jsxs("div", { className: "time-container", children: [renderItem('Start', startTime, 'Missing'), renderItem('End', endTime, 'Missing')] }));
};
// Function to render all difference values
export const renderDifferences = (startDiff, endDiff, totalDiff) => {
    const renderDiffItem = (label, value, className) => (_jsxs("div", { className: `difference-item ${className}`, children: [_jsxs("span", { className: className === 'difference-primary' ? 'difference-label-primary' : 'difference-label', children: [label, ":"] }), value ? _jsx("span", { className: getTimeDiffClass(value), children: value }) : _jsx("span", { className: "text-danger", children: "Missing" })] }));
    return (_jsxs("div", { className: "difference-container", children: [renderDiffItem('Start', startDiff, 'difference-secondary'), renderDiffItem('End', endDiff, 'difference-secondary'), renderDiffItem('Total', totalDiff, 'difference-primary')] }));
};
// Helper function to get severity badge
export const getSeverityBadge = (severity) => {
    if (!severity || severity === 'N/A')
        return _jsx("span", { className: "text-secondary", children: "N/A" });
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
    return _jsxs("span", { className: `badge ${className} p-2`, children: [_jsx("i", { className: `bi bi-${icon} me-1` }), " ", displayText] });
};
// Helper function to render hours with details
export const renderHoursWithDetails = (row) => {
    if (!row)
        return null;
    const totalHours = parseFloat(row["Planned Hours"] || "0").toFixed(2);
    const nightHours = parseFloat(row["Planned Night Hours"] || "0").toFixed(2);
    const sundayHours = parseFloat(row["Planned Sunday Hours"] || "0").toFixed(2);
    const holidayHours = parseFloat(row["Planned Holiday Hours"] || "0").toFixed(2);
    return (_jsxs("div", { className: "hours-container", children: [parseFloat(nightHours) > 0 && (_jsxs("div", { className: "hours-item hours-secondary", children: [_jsx("span", { className: "hours-label", children: "Night:" }), _jsx("span", { className: "text-info", children: nightHours })] })), parseFloat(sundayHours) > 0 && (_jsxs("div", { className: "hours-item hours-secondary", children: [_jsx("span", { className: "hours-label", children: "Sunday:" }), _jsx("span", { className: "text-primary", children: sundayHours })] })), parseFloat(holidayHours) > 0 && (_jsxs("div", { className: "hours-item hours-secondary", children: [_jsx("span", { className: "hours-label", children: "Holiday:" }), _jsx("span", { className: "text-danger", children: holidayHours })] })), _jsxs("div", { className: "hours-item hours-primary", children: [_jsx("span", { className: "hours-label-primary", children: "Total:" }), _jsx("span", { children: totalHours })] })] }));
};

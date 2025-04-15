import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function EmployeeSortControls({ sortConfig, onSort }) {
    const renderSortButton = (column, label) => (_jsxs("button", { className: `btn btn-sm ${sortConfig.column === column ? 'btn-primary' : 'btn-outline-secondary'}`, onClick: () => onSort(column), children: [label, sortConfig.column === column && (sortConfig.direction === 'asc'
                ? _jsx("i", { className: "bi bi-arrow-up ms-1" })
                : _jsx("i", { className: "bi bi-arrow-down ms-1" }))] }));
    return (_jsx("div", { className: "mb-3", children: _jsxs("div", { className: "d-flex align-items-center", children: [_jsx("span", { className: "me-2", children: "Sort employees by:" }), _jsxs("div", { className: "btn-group", children: [renderSortButton('AFM', 'Employee ID'), renderSortButton('FirstName', 'First Name'), renderSortButton('LastName', 'Last Name')] })] }) }));
}

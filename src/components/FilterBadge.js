import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function FilterBadge({ active, onClick, className, icon, text }) {
    return (_jsxs("button", { onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick();
        }, className: `badge ${className} p-2 filter-badge border-0 ${active ? 'filter-active' : 'filter-inactive'}`, style: { cursor: 'pointer', opacity: active ? 1 : 0.6 }, children: [_jsx("i", { className: `bi bi-${icon} me-1` }), " ", text] }));
}

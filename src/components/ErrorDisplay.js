import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppState } from '../hooks/useAppState';
export default function ErrorDisplay() {
    const { data: { error }, setState } = useAppState();
    if (!error) {
        return _jsx(_Fragment, {});
    }
    const handleClose = () => {
        setState({ error: null });
    };
    return (_jsx("div", { id: "error-display", className: "alert alert-danger", role: "alert", children: _jsxs("div", { className: "d-flex justify-content-between align-items-start", children: [_jsx("div", { children: error }), _jsx("button", { type: "button", className: "btn-close", "aria-label": "Close", onClick: handleClose })] }) }));
}

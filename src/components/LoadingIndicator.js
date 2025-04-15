import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppState } from '../hooks/useAppState';
export default function LoadingIndicator() {
    const { data: { isProcessing } } = useAppState();
    if (!isProcessing) {
        return _jsx(_Fragment, {});
    }
    return (_jsxs("div", { id: "loading-indicator", className: "text-center my-3", children: [_jsx("div", { className: "spinner-border text-primary", role: "status", children: _jsx("span", { className: "visually-hidden", children: "Loading..." }) }), _jsx("p", { className: "mt-2", children: "Processing your request..." })] }));
}

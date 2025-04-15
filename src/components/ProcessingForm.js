import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { handleAsyncOperation } from '../utils/errorHandling';
import { calculateDateRange, validateDateRange } from '../utils/dateUtils';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';
import { readTextFile } from '@tauri-apps/api/fs';
export default function ProcessingForm() {
    const { data: { user }, setState } = useAppState();
    const [selectedRange, setSelectedRange] = useState('thisMonth');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [outputDir, setOutputDir] = useState('');
    const [removeFuture, setRemoveFuture] = useState(false);
    const [removeDayOff, setRemoveDayOff] = useState(false);
    if (!user) {
        return _jsx(_Fragment, {});
    }
    const handleChooseDir = async () => {
        try {
            const selected = await open({
                directory: true,
                multiple: false,
            });
            if (selected && typeof selected === 'string') {
                setOutputDir(selected);
            }
        }
        catch (error) {
            console.error('Failed to select directory:', error);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleAsyncOperation(async () => {
            const { start_date, end_date } = calculateDateRange(selectedRange, customStartDate, customEndDate);
            validateDateRange(start_date, end_date);
            if (!outputDir) {
                throw new Error('Please select an output directory');
            }
            const params = {
                usernameInfo: user.usernameInfo,
                passwordInfo: user.passwordInfo,
                usernameSchedule: user.usernameSchedule,
                passwordSchedule: user.passwordSchedule,
                start_date,
                end_date,
                output_dir: outputDir,
                remove_future: removeFuture,
                remove_dayoff: removeDayOff
            };
            // Get file paths from Python
            const result = await invoke('run_python', { params });
            // Read the JSON files
            const combinedData = JSON.parse(await readTextFile(result.combined_json));
            const summaryData = JSON.parse(await readTextFile(result.summary_json));
            setState({
                combined: combinedData,
                summary: summaryData,
                error: null
            });
        }, { errorMessage: 'Failed to process data' }, setState);
    };
    return (_jsxs("section", { id: "paramsSection", className: "processing-section", children: [_jsx("h2", { children: "Processing Parameters" }), _jsxs("form", { id: "processingForm", onSubmit: handleSubmit, children: [_jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "form-label", children: "Date Range" }), _jsxs("div", { className: "form-check", children: [_jsx("input", { type: "radio", className: "form-check-input", id: "thisMonth", name: "dateRange", value: "thisMonth", checked: selectedRange === 'thisMonth', onChange: (e) => setSelectedRange(e.target.value) }), _jsx("label", { className: "form-check-label", htmlFor: "thisMonth", children: "This Month" })] }), _jsxs("div", { className: "form-check", children: [_jsx("input", { type: "radio", className: "form-check-input", id: "thisMonthTillToday", name: "dateRange", value: "thisMonthTillToday", checked: selectedRange === 'thisMonthTillToday', onChange: (e) => setSelectedRange(e.target.value) }), _jsx("label", { className: "form-check-label", htmlFor: "thisMonthTillToday", children: "This Month Till Today" })] }), _jsxs("div", { className: "form-check", children: [_jsx("input", { type: "radio", className: "form-check-input", id: "custom", name: "dateRange", value: "custom", checked: selectedRange === 'custom', onChange: (e) => setSelectedRange(e.target.value) }), _jsx("label", { className: "form-check-label", htmlFor: "custom", children: "Custom Range" })] })] }), selectedRange === 'custom' && (_jsx("div", { id: "customDates", className: "mb-3", children: _jsxs("div", { className: "row", children: [_jsxs("div", { className: "col", children: [_jsx("label", { htmlFor: "start_date", className: "form-label", children: "Start Date" }), _jsx("input", { type: "date", className: "form-control", id: "start_date", value: customStartDate, onChange: (e) => setCustomStartDate(e.target.value), required: true })] }), _jsxs("div", { className: "col", children: [_jsx("label", { htmlFor: "end_date", className: "form-label", children: "End Date" }), _jsx("input", { type: "date", className: "form-control", id: "end_date", value: customEndDate, onChange: (e) => setCustomEndDate(e.target.value), required: true })] })] }) })), _jsxs("div", { className: "mb-3", children: [_jsx("label", { htmlFor: "output_dir", className: "form-label", children: "Output Directory" }), _jsxs("div", { className: "input-group", children: [_jsx("input", { type: "text", className: "form-control", id: "output_dir_display", value: outputDir, readOnly: true, required: true }), _jsx("button", { type: "button", className: "btn btn-outline-secondary", onClick: handleChooseDir, children: "Choose Directory" })] })] }), _jsxs("div", { className: "mb-3", children: [_jsxs("div", { className: "form-check", children: [_jsx("input", { type: "checkbox", className: "form-check-input", id: "removeFuture", checked: removeFuture, onChange: (e) => setRemoveFuture(e.target.checked) }), _jsx("label", { className: "form-check-label", htmlFor: "removeFuture", children: "Remove Future Dates" })] }), _jsxs("div", { className: "form-check", children: [_jsx("input", { type: "checkbox", className: "form-check-input", id: "removeDayOff", checked: removeDayOff, onChange: (e) => setRemoveDayOff(e.target.checked) }), _jsx("label", { className: "form-check-label", htmlFor: "removeDayOff", children: "Remove Days Off" })] })] }), _jsx("button", { type: "submit", className: "btn btn-primary", children: "Process Data" })] })] }));
}

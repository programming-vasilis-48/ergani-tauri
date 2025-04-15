import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';

export default function DownloadPage({ latestVersion, versions = [] }) {
    const [showAllVersions, setShowAllVersions] = useState(false);

    // Get download link (Windows only)
    const getDownloadLink = (version) => {
        return version.downloadWindows;
    };

    return (_jsx("div", { className: "download-page", children: _jsx("div", { className: "container py-5", children: _jsx("div", { className: "row justify-content-center", children: _jsx("div", { className: "col-lg-8", children: _jsx("div", { className: "card shadow-sm", children: _jsxs("div", { className: "card-body p-4", children: [
        _jsx("h1", { className: "card-title text-center mb-4", children: "Ergani Schedule Manager" }),
        _jsxs("div", { className: "latest-version mb-5", children: [
            _jsxs("h2", { className: "h4 mb-3", children: ["Latest Version: ", latestVersion.version] }),
            _jsxs("p", { className: "text-muted", children: ["Released on ", latestVersion.releaseDate] }),
            _jsx("div", { className: "download-button text-center mb-4", children: _jsxs("a", {
                href: getDownloadLink(latestVersion),
                className: "btn btn-success btn-lg",
                download: true,
                children: [
                    _jsx("i", { className: "bi bi-download me-2" }),
                    "Download for Windows"
                ]
            }) }),
            _jsxs("div", { className: "release-notes", children: [
                _jsx("h3", { className: "h5 mb-3", children: "What's New" }),
                _jsx("ul", { className: "list-group", children: latestVersion.notes.map((note, index) => (
                    _jsxs("li", { className: "list-group-item", children: [
                        _jsx("i", { className: "bi bi-check-circle-fill text-success me-2" }),
                        note
                    ] }, index)
                )) })
            ] })
        ] }),
        versions.length > 0 && (_jsxs("div", { className: "previous-versions mt-4", children: [
            _jsxs("div", { className: "d-flex justify-content-between align-items-center mb-3", children: [
                _jsx("h3", { className: "h5 mb-0", children: "Previous Versions" }),
                _jsx("button", {
                    className: "btn btn-sm btn-link",
                    onClick: () => setShowAllVersions(!showAllVersions),
                    children: showAllVersions ? 'Hide' : 'Show All'
                })
            ] }),
            showAllVersions && (_jsx("div", { className: "accordion", id: "versionsAccordion", children: versions.map((version, index) => (
                _jsxs("div", { className: "accordion-item", children: [
                    _jsx("h2", { className: "accordion-header", children: _jsxs("button", {
                        className: "accordion-button collapsed",
                        type: "button",
                        "data-bs-toggle": "collapse",
                        "data-bs-target": `#version-${index}`,
                        children: ["Version ", version.version, " - ", version.releaseDate]
                    }) }),
                    _jsx("div", {
                        id: `version-${index}`,
                        className: "accordion-collapse collapse",
                        "data-bs-parent": "#versionsAccordion",
                        children: _jsxs("div", { className: "accordion-body", children: [
                            _jsx("ul", { className: "list-group list-group-flush mb-3", children: version.notes.map((note, idx) => (
                                _jsxs("li", { className: "list-group-item", children: [
                                    _jsx("i", { className: "bi bi-check-circle-fill text-success me-2" }),
                                    note
                                ] }, idx)
                            )) }),
                            _jsx("div", { className: "text-center", children: _jsxs("a", {
                                href: getDownloadLink(version),
                                className: "btn btn-outline-primary btn-sm",
                                download: true,
                                children: [
                                    _jsx("i", { className: "bi bi-download me-2" }),
                                    "Download for Windows"
                                ]
                            }) })
                        ] })
                    })
                ] }, index)
            ))) })
        ] }))
    ] }) }) }) }) }) }));
}

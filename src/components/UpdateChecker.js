import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { checkForUpdates, installAvailableUpdate } from '../utils/updater';
export default function UpdateChecker({ checkOnStart = true, checkInterval = 3600000 // 1 hour
 }) {
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [isInstalling, setIsInstalling] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    // Function to check for updates
    const checkUpdates = async () => {
        try {
            const hasUpdate = await checkForUpdates();
            setUpdateAvailable(hasUpdate);
        }
        catch (err) {
            console.error('Failed to check for updates:', err);
            setError('Failed to check for updates');
        }
    };
    // Function to install available update
    const handleInstallUpdate = async () => {
        setIsInstalling(true);
        setProgress(0);
        setError(null);
        try {
            await installAvailableUpdate((prog) => {
                setProgress(prog);
            });
            // The app will relaunch automatically after successful installation
        }
        catch (err) {
            console.error('Failed to install update:', err);
            setError('Failed to install update. Please try again later.');
            setIsInstalling(false);
        }
    };
    // Check for updates on component mount if enabled
    useEffect(() => {
        if (checkOnStart) {
            checkUpdates();
        }
        // Set up interval to periodically check for updates
        if (checkInterval > 0) {
            const intervalId = setInterval(checkUpdates, checkInterval);
            return () => clearInterval(intervalId);
        }
    }, [checkOnStart, checkInterval]);
    // Don't render anything if no update is available
    if (!updateAvailable && !isInstalling && !error) {
        return null;
    }
    return (_jsxs("div", { className: "update-notification", children: [updateAvailable && !isInstalling && (_jsxs("div", { className: "alert alert-info d-flex align-items-center justify-content-between", children: [_jsxs("div", { children: [_jsx("strong", { children: "Update Available!" }), " A new version of Ergani Schedule Manager is available."] }), _jsx("button", { className: "btn btn-primary btn-sm ms-3", onClick: handleInstallUpdate, disabled: isInstalling, children: isInstalling ? 'Installing...' : 'Update Now' })] })), isInstalling && (_jsxs("div", { className: "alert alert-info", children: [_jsx("strong", { children: "Installing Update" }), _jsx("div", { className: "progress mt-2", children: _jsxs("div", { className: "progress-bar progress-bar-striped progress-bar-animated", role: "progressbar", style: { width: `${progress}%` }, "aria-valuenow": progress, "aria-valuemin": 0, "aria-valuemax": 100, children: [progress, "%"] }) }), _jsx("small", { className: "text-muted mt-1 d-block", children: "The application will restart automatically after the update is complete." })] })), error && (_jsxs("div", { className: "alert alert-danger d-flex align-items-center justify-content-between", children: [_jsx("div", { children: error }), _jsx("button", { className: "btn btn-outline-danger btn-sm ms-3", onClick: () => setError(null), children: "Dismiss" })] }))] }));
}

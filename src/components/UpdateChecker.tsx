import React, { useEffect, useState } from 'react';
import { checkForUpdates, installAvailableUpdate } from '../utils/updater';

interface UpdateCheckerProps {
  checkOnStart?: boolean;
  checkInterval?: number; // in milliseconds
}

export default function UpdateChecker({ 
  checkOnStart = true, 
  checkInterval = 3600000 // 1 hour
}: UpdateCheckerProps): JSX.Element | null {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Function to check for updates
  const checkUpdates = async () => {
    try {
      const hasUpdate = await checkForUpdates();
      setUpdateAvailable(hasUpdate);
    } catch (err) {
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
    } catch (err) {
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

  return (
    <div className="update-notification">
      {updateAvailable && !isInstalling && (
        <div className="alert alert-info d-flex align-items-center justify-content-between">
          <div>
            <strong>Update Available!</strong> A new version of Ergani Schedule Manager is available.
          </div>
          <button 
            className="btn btn-primary btn-sm ms-3" 
            onClick={handleInstallUpdate}
            disabled={isInstalling}
          >
            {isInstalling ? 'Installing...' : 'Update Now'}
          </button>
        </div>
      )}

      {isInstalling && (
        <div className="alert alert-info">
          <strong>Installing Update</strong>
          <div className="progress mt-2">
            <div 
              className="progress-bar progress-bar-striped progress-bar-animated" 
              role="progressbar" 
              style={{ width: `${progress}%` }} 
              aria-valuenow={progress} 
              aria-valuemin={0} 
              aria-valuemax={100}
            >
              {progress}%
            </div>
          </div>
          <small className="text-muted mt-1 d-block">
            The application will restart automatically after the update is complete.
          </small>
        </div>
      )}

      {error && (
        <div className="alert alert-danger d-flex align-items-center justify-content-between">
          <div>{error}</div>
          <button 
            className="btn btn-outline-danger btn-sm ms-3" 
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
} 
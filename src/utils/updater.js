import { checkUpdate, installUpdate } from '@tauri-apps/api/updater';
import { relaunch } from '@tauri-apps/api/process';
/**
 * Checks for available updates and returns the result.
 *
 * @returns A promise that resolves to true if an update was found, false otherwise
 */
export async function checkForUpdates() {
    try {
        const { shouldUpdate, manifest } = await checkUpdate();
        if (shouldUpdate) {
            console.log(`Update available: ${manifest?.version}`);
            return true;
        }
        return false;
    }
    catch (error) {
        console.error('Error checking for updates:', error);
        return false;
    }
}
/**
 * Installs available updates and relaunches the application.
 *
 * @param onProgress Optional callback for update progress
 * @returns A promise that resolves when the application is relaunched
 */
export async function installAvailableUpdate(onProgress) {
    try {
        // Install the update
        await installUpdate();
        // Report progress if needed - this would require manual progress tracking
        if (onProgress) {
            onProgress(100);
        }
        // Relaunch the app after the update is installed
        await relaunch();
    }
    catch (error) {
        console.error('Error installing update:', error);
        throw error;
    }
}
/**
 * Checks for updates and installs them automatically if available.
 *
 * @param silent If true, updates are installed without user interaction
 * @param onProgress Optional callback for update progress
 * @returns A promise that resolves to true if an update was found, false otherwise
 */
export async function checkAndInstallUpdates(silent = false, onProgress) {
    try {
        const { shouldUpdate, manifest } = await checkUpdate();
        if (shouldUpdate) {
            console.log(`Update available: ${manifest?.version}`);
            if (silent) {
                // Install update silently
                await installAvailableUpdate(onProgress);
            }
            return true;
        }
        return false;
    }
    catch (error) {
        console.error('Error during update check and install:', error);
        return false;
    }
}

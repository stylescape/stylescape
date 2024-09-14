// ============================================================================
// Progress Bar Manager
// ============================================================================

/**
 * The ProgressBarManager class controls a progress bar UI element, allowing updates
 * to its value and appearance based on the current progress state.
 *
 * @example
 * // Usage:
 * const progressBarManager = new ProgressBarManager('myProgressBar');
 * progressBarManager.setProgress(50); // Set progress to 50%
 */
export default class ProgressBarManager {
    // The HTML element representing the progress bar.
    private progressBar: HTMLElement | null;

    /**
     * Creates an instance of ProgressBarManager.
     * 
     * @param progressBarId - The ID of the progress bar element to manage.
     */
    constructor(progressBarId: string) {
        this.progressBar = document.getElementById(progressBarId);

        if (!this.progressBar) {
            console.error(`Progress bar element not found with ID: ${progressBarId}`);
        }
    }

    /**
     * Updates the progress bar to the specified percentage.
     * 
     * This method sets the width of the progress bar element to represent the given percentage.
     * 
     * @param percentage - A number representing the progress percentage (0-100).
     */
    public setProgress(percentage: number): void {
        if (!this.progressBar) {
            console.warn('Progress bar element is not available. Cannot set progress.');
            return;
        }

        // Clamp the percentage between 0 and 100
        const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
        this.progressBar.style.width = `${clampedPercentage}%`;

        // Optionally update ARIA attributes or other accessibility features
        this.progressBar.setAttribute('aria-valuenow', clampedPercentage.toString());
    }

    /**
     * Resets the progress bar to 0%.
     * 
     * This method sets the progress bar's width to 0%, effectively resetting it.
     */
    public resetProgress(): void {
        if (!this.progressBar) {
            console.warn('Progress bar element is not available. Cannot reset progress.');
            return;
        }

        this.setProgress(0);
    }

    /**
     * Updates the progress bar element dynamically.
     * 
     * This method allows changing the progress bar element by providing a new CSS selector.
     * It updates the instance with the new progress bar element.
     * 
     * @param progressBarId - The new ID of the progress bar element to manage.
     */
    public updateProgressBarElement(progressBarId: string): void {
        this.progressBar = document.getElementById(progressBarId);

        if (!this.progressBar) {
            console.error(`Updated progress bar element not found with ID: ${progressBarId}`);
        }
    }
}

// Usage example:
// Create a new ProgressBarManager instance with a specified progress bar element ID.
const progressBarManager = new ProgressBarManager('myProgressBar');
progressBarManager.setProgress(50); // Set progress to 50%
/**
 * CountdownTimer class provides a simple countdown functionality that updates a display element on the page.
 * It counts down from a specified end time and updates the UI every second.
 * 
 * When the countdown reaches zero, it stops and displays "Time up!".
 * 
 * @example
 * // Usage:
 * const countdown = new CountdownTimer(new Date('2024/01/01 00:00:00'), 'countdownDisplay');
 */
export default class CountdownTimer {
    // The target end time for the countdown.
    private endTime: Date;
    // The HTML element where the countdown will be displayed.
    private displayElement: HTMLElement;

    /**
     * Creates a new CountdownTimer instance.
     * 
     * @param endTime - The date and time at which the countdown should end.
     * @param displayElementId - The ID of the HTML element where the countdown should be displayed.
     */
    constructor(endTime: Date, displayElementId: string) {
        this.endTime = endTime;
        // Find the display element by its ID and ensure it's an HTMLElement.
        const element = document.getElementById(displayElementId);
        if (!element) {
            throw new Error(`Element with ID ${displayElementId} not found.`);
        }
        this.displayElement = element;
        this.startTimer();
    }

    /**
     * Starts the countdown timer, updating the display every second.
     * 
     * This method calculates the time remaining until the end time and updates the text content of the display element.
     * If the countdown reaches zero, it stops and displays "Time up!".
     * 
     * @private
     */
    private startTimer(): void {
        const interval = setInterval(() => {
            const remaining = this.endTime.getTime() - new Date().getTime();
            if (remaining <= 0) {
                clearInterval(interval);
                this.displayElement.textContent = 'Time up!';
                return;
            }
            this.displayElement.textContent = this.formatTime(remaining);
        }, 1000);
    }

    /**
     * Formats the remaining time in milliseconds into a string in the format "HH:MM:SS".
     * 
     * @param timeInMilliseconds - The remaining time in milliseconds.
     * @returns A string representing the formatted time.
     * 
     * @private
     */
    private formatTime(timeInMilliseconds: number): string {
        const seconds = Math.floor((timeInMilliseconds / 1000) % 60);
        const minutes = Math.floor((timeInMilliseconds / 1000 / 60) % 60);
        const hours = Math.floor((timeInMilliseconds / 1000 / 60 / 60) % 24);

        // Pad minutes and seconds with leading zeros for a cleaner display.
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        const formattedHours = hours.toString().padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }
}

// Usage example:
// Create a new countdown timer that ends on January 1, 2024, at midnight,
// and updates the element with the ID 'countdownDisplay'.
const countdown = new CountdownTimer(new Date('2024/01/01 00:00:00'), 'countdownDisplay');
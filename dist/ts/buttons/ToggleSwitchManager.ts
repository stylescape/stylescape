// ============================================================================
// Toggle Switch Manager
// ============================================================================

/**
 * The ToggleSwitchManager class manages a toggle switch UI element, providing methods
 * to get and set the state of the toggle switch, and handle its change events.
 *
 * @example
 * // Usage:
 * const toggleSwitchManager = new ToggleSwitchManager('myToggleSwitch');
 * console.log(toggleSwitchManager.isOn); // Check the toggle state
 */
export class ToggleSwitchManager {
    // The HTML input element representing the toggle switch.
    private switchElement: HTMLInputElement | null;

    /**
     * Creates an instance of ToggleSwitchManager.
     *
     * @param switchId - The ID of the toggle switch element to manage.
     */
    constructor(switchId: string) {
        this.switchElement = document.getElementById(switchId) as HTMLInputElement;

        if (!this.switchElement) {
            console.error(`Toggle switch element not found with ID: ${switchId}`);
        }
    }

    /**
     * Gets the current state of the toggle switch.
     *
     * @returns {boolean} - True if the toggle switch is on, otherwise false.
     */
    get isOn(): boolean {
        return this.switchElement ? this.switchElement.checked : false;
    }

    /**
     * Sets the state of the toggle switch.
     *
     * @param value - A boolean value to set the toggle switch state (true for on, false for off).
     */
    set isOn(value: boolean) {
        if (!this.switchElement) {
            console.warn('Toggle switch element is not available. Cannot set state.');
            return;
        }

        this.switchElement.checked = value;
    }

    /**
     * Toggles the current state of the toggle switch.
     *
     * This method flips the current state of the toggle switch (on to off, or off to on).
     */
    public toggle(): void {
        if (!this.switchElement) {
            console.warn('Toggle switch element is not available. Cannot toggle state.');
            return;
        }

        this.switchElement.checked = !this.switchElement.checked;
    }

    /**
     * Attaches a callback function to the change event of the toggle switch.
     *
     * This method allows executing custom logic whenever the toggle switch state changes.
     *
     * @param callback - A function to call when the toggle switch changes state.
     */
    public onChange(callback: (isOn: boolean) => void): void {
        if (!this.switchElement) {
            console.warn('Toggle switch element is not available. Cannot attach event listener.');
            return;
        }

        this.switchElement.addEventListener('change', () => {
            callback(this.isOn);
        });
    }
}

// Usage example:
// Create a new ToggleSwitchManager instance with a specified toggle switch element ID.
const toggleSwitchManager = new ToggleSwitchManager('myToggleSwitch');
console.log(toggleSwitchManager.isOn); // Check the toggle state
toggleSwitchManager.onChange((isOn) => {
    console.log(`Toggle switch is now ${isOn ? 'on' : 'off'}`);
});




// export class ToggleSwitchManager {

//     private switchElement: HTMLInputElement;

//     constructor(switchId: string) {
//         this.switchElement = document.getElementById(switchId) as HTMLInputElement;
//     }

//     get isOn(): boolean {
//         return this.switchElement.checked;
//     }

//     set isOn(value: boolean) {
//         this.switchElement.checked = value;
//     }
// }

// // Usage
// const toggleSwitchManager = new ToggleSwitchManager('myToggleSwitch');
// // Check the toggle state: console.log(toggleSwitchManager.isOn);

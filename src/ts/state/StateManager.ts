// ============================================================================
// Stylescape | State Manager
// ============================================================================
// Manages UI element states through class toggling and state tracking.
// Supports data-ss-state attributes for declarative state management.
// ============================================================================

/**
 * Configuration options for StateManager
 */
export interface StateManagerOptions {
    /** Default class to toggle if none specified */
    defaultClass?: string;
    /** Persist state in localStorage */
    persist?: boolean;
    /** Storage key prefix for persistence */
    storagePrefix?: string;
    /** Callback when state changes */
    onChange?: (
        element: Element,
        className: string,
        isActive: boolean,
    ) => void;
}

/**
 * Utility class for managing element state through CSS classes.
 * Provides methods for toggling, adding, and removing state classes.
 *
 * @example JavaScript
 * ```typescript
 * const stateManager = new StateManager()
 *
 * // Toggle the "active" class
 * stateManager.toggleClass(element, "active")
 *
 * // Toggle a custom class
 * stateManager.toggleClass(element, "expanded")
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <button data-ss="state-toggle"
 *         data-ss-state-target="#menu"
 *         data-ss-state-class="open">
 *     Toggle Menu
 * </button>
 * ```
 */
export class StateManager {
    /**
     * Toggles a specified class on an element.
     * Logs a warning if the element is not found.
     *
     * @param element - The DOM element to toggle the class on
     * @param className - The CSS class to toggle (default: "active")
     */
    public toggleClass(element: Element, className: string = "active"): void {
        if (!element) {
            console.warn(`Element: '${element}' not found`);
            return;
        }

        element.classList.toggle(className);
    }
}

// Usage example
// const stateManager = new StateManager();
// const element = document.getElementById('someElement'); // Replace with your actual element ID

// if (element) {
//     stateManager.toggleClass(element, 'active'); // You can now toggle any class, not just 'active'
// } else {
//     console.error('Element not found');
// }

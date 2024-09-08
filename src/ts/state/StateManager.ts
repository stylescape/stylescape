// ============================================================================
// State Manager
// ============================================================================


export class StateManager {
    /**
     * Toggles a specified class on an element.
     * @param element The DOM element to toggle the class on.
     * @param className The class to toggle. Defaults to "active".
     */

    public toggleClass(
        element: Element,
        className: string = 'active'
    ): void {
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

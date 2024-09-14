// ============================================================================
// Button Handler
// ============================================================================

/**
 * The ButtonHandler class manages click events for buttons on the page.
 * It automatically attaches event listeners to all button elements and handles
 * their click events, providing easy access to button IDs for further functionality.
 *
 * @example
 * // Usage:
 * const buttonHandler = new ButtonHandler();
 */
export class ButtonHandler {
    /**
     * Initializes the ButtonHandler class by attaching click event listeners
     * to all button elements on the page.
     */
    constructor() {
        this.attachEventListeners();
    }

    /**
     * Attaches click event listeners to all button elements on the page.
     * 
     * If no button elements are found, a warning is logged to the console.
     */
    private attachEventListeners(): void {
        const buttons = document.querySelectorAll('button');

        if (buttons.length === 0) {
            console.warn('No button elements found on the page.');
            return;
        }

        buttons.forEach(button => {
            button.addEventListener('click', this.handleButtonClick.bind(this));
        });
    }

    /**
     * Handles the click event for button elements.
     * 
     * This method logs the ID of the clicked button and can be extended
     * with custom logic as needed.
     * 
     * @param event - The click event object.
     */
    private handleButtonClick(event: Event): void {
        const button = event.target as HTMLButtonElement;

        if (!button.id) {
            console.warn('Clicked button does not have an ID.');
            return;
        }

        const buttonId = button.id;
        console.log(`Button clicked: ${buttonId}`);

        // Add your custom function logic here, using buttonId if needed
    }

    /**
     * Dynamically updates event listeners for new or existing button elements.
     * 
     * This method reattaches event listeners to all buttons on the page, useful
     * if buttons are added dynamically after the initial page load.
     */
    public updateButtonListeners(): void {
        // Remove existing listeners before reattaching
        document.querySelectorAll('button').forEach(button => {
            button.removeEventListener('click', this.handleButtonClick.bind(this));
        });

        // Reattach listeners
        this.attachEventListeners();
    }

    /**
     * Attaches a click event listener to a specific button element by ID.
     * 
     * @param buttonId - The ID of the button element to attach the event listener to.
     */
    public addListenerToButton(buttonId: string): void {
        const button = document.getElementById(buttonId) as HTMLButtonElement;

        if (!button) {
            console.error(`Button with ID "${buttonId}" not found.`);
            return;
        }

        button.addEventListener('click', this.handleButtonClick.bind(this));
    }
}

// Initialize the ButtonHandler class
const buttonHandler = new ButtonHandler();



// export class ButtonHandler {
//     constructor() {
//         // Attaching event listeners to buttons
//         document.querySelectorAll('button').forEach(button => {
//             button.addEventListener('click', this.handleButtonClick.bind(this));
//         });
//     }

//     private handleButtonClick(event: Event): void {
//         // Retrieving the ID of the clicked button
//         const button = event.target as HTMLButtonElement;
//         const buttonId = button.id;

//         console.log(`Button clicked: ${buttonId}`);
//         // Add your function logic here, using buttonId if needed
//     }
// }

// // Initialize the ButtonHandler class
// const buttonHandler = new ButtonHandler();

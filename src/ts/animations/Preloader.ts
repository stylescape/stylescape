// ============================================================================
// Preloader
// ============================================================================

/**
 * The Preloader class manages a preloader element that displays while the page is loading.
 * It hides the preloader after the specified timeout once the page has fully loaded.
 * 
 * @example
 * // Usage:
 * const preloader = new Preloader('.preloader', 2000);
 */
export class Preloader {
    // CSS selector name of the preloader element.
    private preloaderName: string;
    // The actual HTML element corresponding to the preloader.
    private preloaderElement: HTMLElement | null;
    // Timeout duration before hiding the preloader (in milliseconds).
    private preloaderTimeout: number;

    /**
     * Creates an instance of the Preloader class.
     * 
     * @param preloaderName - The CSS selector for the preloader element.
     * @param preloaderTimeout - The delay in milliseconds before the preloader is hidden after the page loads.
     */
    constructor(preloaderName: string, preloaderTimeout: number) {
        this.preloaderName = preloaderName;
        this.preloaderElement = document.querySelector(preloaderName);
        this.preloaderTimeout = preloaderTimeout;

        if (!this.preloaderElement) {
            console.warn(`Preloader element not found: ${preloaderName}`);
        } else {
            this.setPreloader();
        }
    }

    /**
     * Sets up the preloader by adding an event listener for the window's load event.
     * 
     * This method binds the `handleLoadEvent` function to the window load event,
     * which triggers the preloader to hide after the specified timeout.
     */
    private setPreloader(): void {
        window.addEventListener('load', this.handleLoadEvent.bind(this));
    }

    /**
     * Handles the window load event to start the timeout for hiding the preloader.
     * 
     * Once the page has fully loaded, this method sets a timeout to hide the preloader
     * element after the duration specified by `preloaderTimeout`.
     */
    private handleLoadEvent(): void {
        if (this.preloaderElement) {
            setTimeout(() => this.hidePreloader(), this.preloaderTimeout);
        }
    }

    /**
     * Hides the preloader by adding a CSS class that sets its visibility to hidden.
     * 
     * This method adds a 'preloader_hidden' class to the preloader element,
     * which should be styled in CSS to hide the element.
     */
    private hidePreloader(): void {
        if (this.preloaderElement) {
            this.preloaderElement.classList.add('preloader_hidden');
        }
    }

    /**
     * Updates the preloader element dynamically.
     * 
     * This method allows changing the preloader element by providing a new CSS selector.
     * It updates the instance with the new preloader element.
     * 
     * @param selector - The new CSS selector for the preloader element.
     */
    public updatePreloaderElement(selector: string): void {
        this.preloaderName = selector;
        this.preloaderElement = document.querySelector(selector);

        if (!this.preloaderElement) {
            console.warn(`Updated preloader element not found: ${selector}`);
        }
    }
}

// Usage example:
// Create a new preloader instance with a specified CSS selector and timeout duration.
const preloader = new Preloader('.preloader', 2000);



// export class Preloader {

//     private preloaderName: string
//     private preloaderElement: HTMLElement | null
//     private preloaderTimeout: number

//     constructor(preloaderName: string, preloaderTimeout: number) {
//         this.preloaderName = preloaderName
//         this.preloaderElement = document.querySelector(preloaderName)
//         this.preloaderTimeout = preloaderTimeout
//         if (!this.preloaderElement) {
//             // pass
//             // console.warn(`Preloader element not found: ${preloaderName}`)
//         } else {
//             this.setPreloader()
//         }
//     }

//     setPreloader(): void {
//         window.addEventListener('load', this.handleLoadEvent.bind(this))
//     }

//     private handleLoadEvent(): void {
//         if (this.preloaderElement) {
//             setTimeout(() => this.hidePreloader(), this.preloaderTimeout)
//         }
//     }

//     private hidePreloader(): void {
//         if (this.preloaderElement) {
//             this.preloaderElement.classList.add('preloader_hidden')
//         }
//     }

//     // Optional: Method to update the preloader element dynamically
//     updatePreloaderElement(selector: string): void {
//         this.preloaderName = selector
//         this.preloaderElement = document.querySelector(selector)

//         if (!this.preloaderElement) {
//             console.warn(`Updated preloader element not found: ${selector}`)
//         }
//     }
// }



// Very good and simple solution. I made a few changes. Browsers will still store
// this data even after the browser is closed. I replaced localStorage with
// sessionStorage and cleared it using sessionStorage.removeItem('scrollpos')
// after the scroll position was set. This insures scroll position is cleared
// once the browser is closed. I posted modified code as separate answer.

/**
 * Class responsible for managing the scroll position of the window.
 * It saves the scroll position before the window unloads and restores
 * it when the document is loaded.
 */
export class ScrollPageManager {

    /**
     * Initializes the scroll manager by setting up event listeners.
     */
     constructor() {
        this.initialize();
        // console.log("ScrollStateManager")
    }

    /**
     * Sets up the necessary event listeners for managing the scroll position.
     */
    private initialize(): void {
        // Add listener for when the document is fully loaded
        // document.addEventListener(
        //     "DOMContentLoaded",
        //     this.loadScrollPosition.bind(this)
        // );

        // Add listener for when the window is about to be unloaded
        // window.addEventListener(
        //     "beforeunload",
        //     this.saveScrollPosition.bind(this)
        // );

        // Load the scroll position as soon as possible
        window.addEventListener('load', this.loadScrollPosition.bind(this));

        // Update the scroll position on scroll events
        window.addEventListener('scroll', this.updateScrollPosition.bind(this));
        
        console.log("ScrollStateManager Init")

    }



    /**
     * Loads and applies the saved scroll position from localStorage.
     */
    private loadScrollPosition(): void {
        const scrollpos = localStorage.getItem('scrollpos');
        if (scrollpos) {
            window.scrollTo(0, parseInt(scrollpos));
        }
        console.log("ScrollStateManager Load")

    }

    private updateScrollPosition(): void {
        localStorage.setItem('scrollpos', window.scrollY.toString());
    }

    /**
     * Saves the current scroll position to localStorage.
     */
    private saveScrollPosition(): void {
        localStorage.setItem(
            'scrollpos',
            window.scrollY.toString()
        );

        console.log("ScrollStateManager Save")

    }

}

// Creating an instance of the ScrollManager to activate its functionality.
// const scrollManager = new ScrollStateManager();
